/****************************************************************************/
/* STORED PROCEDURES E VIEWS - MÓDULO CONTEÚDOS                            */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* STORED PROCEDURES                                                         */
/******************************************************************************/

-- Procedure: Criar Conteúdo Completo
CREATE OR ALTER PROCEDURE [dbo].[sp_CriarConteudoCompleto]
    @TipoConteudoId INT,
    @CategoriaId INT = NULL,
    @Titulo NVARCHAR(255),
    @Slug NVARCHAR(255) = NULL,
    @Subtitulo NVARCHAR(500) = NULL,
    @Resumo NVARCHAR(1000) = NULL,
    @Conteudo NVARCHAR(MAX) = NULL,
    @ImagemDestaque NVARCHAR(500) = NULL,
    @AutorId INT,
    @Status NVARCHAR(20) = 'rascunho',
    @Destaque BIT = 0,
    @PermiteComentarios BIT = 1,
    @DataInicio DATETIME2 = NULL,
    @DataFim DATETIME2 = NULL,
    @Tags NVARCHAR(MAX) = NULL, -- JSON array: ["tag1", "tag2"]
    @AnexosIds NVARCHAR(MAX) = NULL, -- JSON array: [1, 2, 3]
    @CamposPersonalizados NVARCHAR(MAX) = NULL, -- JSON
    @MetaTitle NVARCHAR(255) = NULL,
    @MetaDescription NVARCHAR(500) = NULL,
    @MetaKeywords NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @ConteudoId INT;
    DECLARE @PublicadoEm DATETIME2 = CASE WHEN @Status = 'publicado' THEN GETDATE() ELSE NULL END;
    
    BEGIN TRY
        -- Gerar slug se não fornecido
        IF @Slug IS NULL OR @Slug = ''
        BEGIN
            SET @Slug = LOWER(REPLACE(REPLACE(REPLACE(@Titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'));
            -- Remover caracteres especiais
            SET @Slug = REPLACE(REPLACE(REPLACE(REPLACE(@Slug, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o');
            SET @Slug = REPLACE(@Slug, 'ú', 'u');
        END
        
        -- Inserir conteúdo
        INSERT INTO [dbo].[conteudos] 
            (tipo_conteudo_id, categoria_id, titulo, slug, subtitulo, resumo, conteudo, 
             imagem_destaque, autor_id, status, destaque, permite_comentarios, 
             data_inicio, data_fim, meta_title, meta_description, meta_keywords, publicado_em)
        VALUES 
            (@TipoConteudoId, @CategoriaId, @Titulo, @Slug, @Subtitulo, @Resumo, @Conteudo,
             @ImagemDestaque, @AutorId, @Status, @Destaque, @PermiteComentarios,
             @DataInicio, @DataFim, @MetaTitle, @MetaDescription, @MetaKeywords, @PublicadoEm);
        
        SET @ConteudoId = SCOPE_IDENTITY();
        
        -- Processar Tags
        IF @Tags IS NOT NULL
        BEGIN
            DECLARE @TagNome NVARCHAR(50);
            DECLARE @TagId INT;
            
            DECLARE tag_cursor CURSOR FOR
            SELECT value FROM OPENJSON(@Tags);
            
            OPEN tag_cursor;
            FETCH NEXT FROM tag_cursor INTO @TagNome;
            
            WHILE @@FETCH_STATUS = 0
            BEGIN
                -- Verificar se tag existe, senão criar
                SELECT @TagId = id FROM [dbo].[tags] WHERE nome = @TagNome;
                
                IF @TagId IS NULL
                BEGIN
                    INSERT INTO [dbo].[tags] (nome, slug) 
                    VALUES (@TagNome, LOWER(REPLACE(@TagNome, ' ', '-')));
                    SET @TagId = SCOPE_IDENTITY();
                END
                
                -- Associar tag ao conteúdo
                IF NOT EXISTS (SELECT 1 FROM [dbo].[conteudo_tag] WHERE conteudo_id = @ConteudoId AND tag_id = @TagId)
                BEGIN
                    INSERT INTO [dbo].[conteudo_tag] (conteudo_id, tag_id) VALUES (@ConteudoId, @TagId);
                END
                
                FETCH NEXT FROM tag_cursor INTO @TagNome;
            END
            
            CLOSE tag_cursor;
            DEALLOCATE tag_cursor;
        END
        
        -- Processar Anexos
        IF @AnexosIds IS NOT NULL
        BEGIN
            DECLARE @AnexoId INT;
            DECLARE @Ordem INT = 0;
            
            INSERT INTO [dbo].[conteudo_anexo] (conteudo_id, anexo_id, tipo_anexo, ordem, principal)
            SELECT 
                @ConteudoId,
                CAST(value AS INT),
                CASE 
                    WHEN a.tipo IN ('jpg', 'jpeg', 'png', 'gif') THEN 'imagem'
                    WHEN a.tipo IN ('mp4', 'avi', 'mov') THEN 'video'
                    WHEN a.tipo IN ('mp3', 'wav') THEN 'audio'
                    ELSE 'documento'
                END,
                ROW_NUMBER() OVER (ORDER BY (SELECT NULL)),
                CASE WHEN ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) = 1 THEN 1 ELSE 0 END
            FROM OPENJSON(@AnexosIds) j
            INNER JOIN [dbo].[anexos] a ON a.id = CAST(j.value AS INT);
        END
        
        -- Processar Campos Personalizados
        IF @CamposPersonalizados IS NOT NULL
        BEGIN
            INSERT INTO [dbo].[conteudos_valores_personalizados]
                (conteudo_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
            SELECT 
                @ConteudoId,
                JSON_VALUE(value, '$.codigo'),
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('text', 'textarea', 'email', 'phone', 'url') 
                     THEN JSON_VALUE(value, '$.valor') END,
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('number', 'decimal') 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DECIMAL(18,4)) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'date' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATE) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'datetime' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATETIME2) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'boolean' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS BIT) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'json' 
                     THEN JSON_QUERY(value, '$.valor') END
            FROM OPENJSON(@CamposPersonalizados);
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @ConteudoId AS ConteudoId,
            @Slug AS Slug;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 
            'ERROR' AS Status,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO