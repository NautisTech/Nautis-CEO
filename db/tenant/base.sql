ALTER DATABASE [ceo_tenant_microlopes] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ceo_tenant_microlopes].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ARITHABORT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET RECOVERY FULL 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  MULTI_USER 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'ceo_tenant_microlopes', N'ON'
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUERY_STORE = ON
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [ceo_tenant_microlopes]
GO
/****** Object:  Table [dbo].[tipos_ticket]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipos_ticket](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[sla_horas] [int] NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tipos_ticket] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tickets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_ticket] [nvarchar](50) NOT NULL,
	[tipo_ticket_id] [int] NOT NULL,
	[equipamento_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NOT NULL,
	[prioridade] [nvarchar](20) NOT NULL,
	[status] [nvarchar](30) NOT NULL,
	[solicitante_id] [int] NOT NULL,
	[atribuido_id] [int] NULL,
	[localizacao] [nvarchar](255) NULL,
	[data_abertura] [datetime2](7) NOT NULL,
	[data_prevista] [datetime2](7) NULL,
	[data_conclusao] [datetime2](7) NULL,
	[tempo_resolucao_minutos] [int] NULL,
	[avaliacao] [int] NULL,
	[comentario_avaliacao] [nvarchar](1000) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[cliente_id] [int] NULL,
	[equipamento_sn] [nvarchar](100) NULL,
	[equipamento_descritivo] [nvarchar](500) NULL,
	[codigo_unico] [nvarchar](10) NULL,
 CONSTRAINT [PK_tickets] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizadores]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizadores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](100) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[senha_hash] [nvarchar](255) NOT NULL,
	[telefone] [nvarchar](50) NULL,
	[ativo] [bit] NOT NULL,
	[email_verificado] [bit] NOT NULL,
	[email_verificado_em] [datetime2](7) NULL,
	[senha_alterada_em] [datetime2](7) NULL,
	[token_recordar] [nvarchar](255) NULL,
	[token_reset_senha] [nvarchar](255) NULL,
	[token_reset_expira_em] [datetime2](7) NULL,
	[ultimo_acesso] [datetime2](7) NULL,
	[foto_url] [nvarchar](500) NULL,
	[idioma] [nvarchar](10) NULL,
	[tema] [nvarchar](20) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[funcionario_id] [int] NULL,
	[cliente_id] [int] NULL,
	[tipo_utilizador] [nvarchar](50) NULL,
 CONSTRAINT [PK_utilizadores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empresas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empresas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[nif] [nvarchar](50) NULL,
	[logo_url] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[nome_comercial] [nvarchar](255) NULL,
	[nome_juridico] [nvarchar](255) NULL,
	[tipo_empresa] [nvarchar](50) NULL,
	[natureza_juridica] [nvarchar](100) NULL,
	[capital_social] [decimal](15, 2) NULL,
	[num_matricula] [nvarchar](50) NULL,
	[data_constituicao] [date] NULL,
	[email] [nvarchar](255) NULL,
	[telefone] [nvarchar](50) NULL,
	[telemovel] [nvarchar](50) NULL,
	[fax] [nvarchar](50) NULL,
	[website] [nvarchar](255) NULL,
	[morada_fiscal] [nvarchar](500) NULL,
	[codigo_postal] [nvarchar](20) NULL,
	[localidade] [nvarchar](100) NULL,
	[distrito] [nvarchar](100) NULL,
	[pais] [nvarchar](100) NULL,
	[morada_correspondencia] [nvarchar](500) NULL,
	[codigo_postal_correspondencia] [nvarchar](20) NULL,
	[localidade_correspondencia] [nvarchar](100) NULL,
	[num_cliente] [nvarchar](50) NULL,
	[num_fornecedor] [nvarchar](50) NULL,
	[segmento] [nvarchar](100) NULL,
	[setor_atividade] [nvarchar](100) NULL,
	[codigo_cae] [nvarchar](20) NULL,
	[iban] [nvarchar](50) NULL,
	[swift_bic] [nvarchar](20) NULL,
	[banco] [nvarchar](100) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[limite_credito] [decimal](15, 2) NULL,
	[desconto_comercial] [decimal](5, 2) NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[tags] [nvarchar](500) NULL,
	[rating] [int] NULL,
	[estado] [nvarchar](50) NULL,
	[ref_externa] [nvarchar](100) NULL,
	[id_phc] [nvarchar](50) NULL,
	[sincronizado_phc] [bit] NULL,
	[ultima_sincronizacao] [datetime2](7) NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
 CONSTRAINT [PK_empresas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_TicketsAbertos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* VIEWS                                                                     */
/******************************************************************************/

-- View: Tickets em Aberto
CREATE   VIEW [dbo].[vw_TicketsAbertos]
AS
SELECT 
    t.id,
    t.numero_ticket,
    t.titulo,
    t.prioridade,
    t.status,
    t.data_abertura,
    t.data_prevista,
    DATEDIFF(HOUR, t.data_abertura, GETDATE()) AS horas_abertas,
    CASE 
        WHEN t.data_prevista < GETDATE() THEN 'Atrasado'
        WHEN DATEADD(HOUR, -2, t.data_prevista) < GETDATE() THEN 'Próximo do vencimento'
        ELSE 'No prazo'
    END AS situacao_sla,
    tt.nome AS tipo_ticket,
    sol.username AS solicitante,
    atr.username AS atribuido,
    eq.nome AS empresa
FROM [dbo].[tickets] t
INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
WHERE t.status NOT IN ('fechado', 'cancelado');
GO
/****** Object:  Table [dbo].[utilizador_empresa]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizador_empresa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[empresa_id] [int] NOT NULL,
	[empresa_principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_empresa] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veiculos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[veiculos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[entidade] [nvarchar](100) NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[marca] [nvarchar](30) NOT NULL,
	[modelo] [nvarchar](40) NULL,
	[matricula] [nvarchar](20) NULL,
	[chassis] [nvarchar](40) NULL,
	[cor] [nvarchar](30) NULL,
	[combustivel] [nvarchar](30) NOT NULL,
	[ano] [int] NULL,
	[capacidade] [int] NULL,
	[quilometragem] [int] NULL,
	[detalhes] [nvarchar](max) NULL,
	[data_aquisicao] [date] NULL,
	[valor_aquisicao] [decimal](18, 2) NULL,
	[data_baixa] [date] NULL,
	[em_circulacao] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[empresa_id] [int] NULL,
 CONSTRAINT [PK_veiculos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo_conteudo_id] [int] NOT NULL,
	[categoria_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[slug] [nvarchar](255) NOT NULL,
	[subtitulo] [nvarchar](500) NULL,
	[resumo] [nvarchar](1000) NULL,
	[conteudo] [nvarchar](max) NULL,
	[imagem_destaque] [nvarchar](500) NULL,
	[autor_id] [int] NULL,
	[status] [nvarchar](20) NOT NULL,
	[destaque] [bit] NOT NULL,
	[permite_comentarios] [bit] NOT NULL,
	[visualizacoes] [int] NOT NULL,
	[ordem] [int] NULL,
	[publicado_em] [datetime2](7) NULL,
	[data_inicio] [datetime2](7) NULL,
	[data_fim] [datetime2](7) NULL,
	[meta_title] [nvarchar](255) NULL,
	[meta_description] [nvarchar](500) NULL,
	[meta_keywords] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[aprovado_por_id] [int] NULL,
	[aprovado_em] [datetime2](7) NULL,
	[empresa_id] [int] NULL,
	[visibilidade] [nvarchar](20) NOT NULL,
	[variants] [nvarchar](max) NULL,
	[idiomas] [nvarchar](500) NULL,
 CONSTRAINT [PK_conteudos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[funcionarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero] [int] NULL,
	[tipo_funcionario_id] [int] NULL,
	[nome_completo] [nvarchar](255) NOT NULL,
	[nome_abreviado] [nvarchar](100) NULL,
	[sexo] [nvarchar](20) NOT NULL,
	[data_nascimento] [date] NOT NULL,
	[naturalidade] [nvarchar](255) NULL,
	[nacionalidade] [nvarchar](100) NULL,
	[estado_civil] [nvarchar](50) NULL,
	[foto_url] [nvarchar](500) NULL,
	[observacoes] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[empresa_id] [int] NULL,
 CONSTRAINT [PK_funcionarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_EstatisticasEmpresas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* VIEWS COM CONTROLO DE ACESSO                                             */
/******************************************************************************/

-- View: Estatísticas por Empresa
CREATE   VIEW [dbo].[vw_EstatisticasEmpresas]
AS
SELECT 
    e.id,
    e.codigo,
    e.nome,
    (SELECT COUNT(*) FROM [dbo].[funcionarios] WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
    (SELECT COUNT(*) FROM [dbo].[veiculos] WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos,
    (SELECT COUNT(*) FROM [dbo].[conteudos] WHERE empresa_id = e.id AND status = 'publicado') AS total_conteudos,
    (SELECT COUNT(DISTINCT utilizador_id) FROM [dbo].[utilizador_empresa] WHERE empresa_id = e.id) AS total_utilizadores
FROM [dbo].[empresas] e
WHERE e.ativo = 1;
GO
/****** Object:  Table [dbo].[marcas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[marcas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[logo_url] [nvarchar](500) NULL,
	[website] [nvarchar](255) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
	[email_suporte] [nvarchar](50) NULL,
	[telefone_suporte] [nvarchar](50) NULL,
	[link_suporte] [nvarchar](100) NULL,
 CONSTRAINT [PK_marcas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_equipamento]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categorias_equipamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[icone] [nvarchar](50) NULL,
	[cor] [nvarchar](20) NULL,
	[categoria_pai_id] [int] NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_categorias_equipamento] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[modelos_equipamento]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[modelos_equipamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[marca_id] [int] NOT NULL,
	[categoria_id] [int] NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[codigo] [nvarchar](50) NULL,
	[descricao] [nvarchar](1000) NULL,
	[especificacoes] [nvarchar](max) NULL,
	[imagem_url] [nvarchar](300) NULL,
	[manual_url] [nvarchar](300) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
 CONSTRAINT [PK_modelos_equipamento] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipamentos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[equipamentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NULL,
	[modelo_id] [int] NOT NULL,
	[numero_serie] [nvarchar](100) NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[localizacao] [nvarchar](255) NULL,
	[responsavel_id] [int] NULL,
	[utilizador_id] [int] NULL,
	[estado] [nvarchar](30) NOT NULL,
	[data_aquisicao] [date] NULL,
	[valor_aquisicao] [decimal](18, 2) NULL,
	[fornecedor] [nvarchar](255) NULL,
	[data_garantia] [date] NULL,
	[data_proxima_manutencao] [date] NULL,
	[observacoes] [nvarchar](max) NULL,
	[foto_url] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
 CONSTRAINT [PK_equipamentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_EquipamentosManutencaoProxima]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Equipamentos com Manutenção Próxima
CREATE   VIEW [dbo].[vw_EquipamentosManutencaoProxima]
AS
SELECT 
    e.id,
    e.numero_interno,
    e.descricao,
    e.localizacao,
    e.data_proxima_manutencao,
    DATEDIFF(DAY, GETDATE(), e.data_proxima_manutencao) AS dias_para_manutencao,
    m.nome AS modelo,
    ma.nome AS marca,
    cat.nome AS categoria,
    emp.nome AS empresa,
    resp.nome_completo AS responsavel
FROM [dbo].[equipamentos] e
INNER JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
INNER JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
INNER JOIN [dbo].[categorias_equipamento] cat ON m.categoria_id = cat.id
LEFT JOIN [dbo].[empresas] emp ON e.empresa_id = emp.id
LEFT JOIN [dbo].[funcionarios] resp ON e.responsavel_id = resp.id
WHERE e.ativo = 1
  AND e.data_proxima_manutencao IS NOT NULL
  AND e.data_proxima_manutencao <= DATEADD(DAY, 30, GETDATE());
GO
/****** Object:  View [dbo].[vw_EstatisticasTickets]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Estatísticas de Tickets
CREATE   VIEW [dbo].[vw_EstatisticasTickets]
AS
SELECT 
    COUNT(*) AS total_tickets,
    SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) AS abertos,
    SUM(CASE WHEN status = 'em_andamento' THEN 1 ELSE 0 END) AS em_andamento,
    SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) AS resolvidos,
    SUM(CASE WHEN status = 'fechado' THEN 1 ELSE 0 END) AS fechados,
    SUM(CASE WHEN status NOT IN ('fechado', 'cancelado') AND data_prevista < GETDATE() THEN 1 ELSE 0 END) AS atrasados,
    AVG(CASE WHEN tempo_resolucao_minutos IS NOT NULL THEN tempo_resolucao_minutos ELSE NULL END) AS tempo_medio_resolucao,
    AVG(CASE WHEN avaliacao IS NOT NULL THEN CAST(avaliacao AS FLOAT) ELSE NULL END) AS avaliacao_media
FROM [dbo].[tickets];
GO
/****** Object:  Table [dbo].[intervencoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intervencoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NULL,
	[equipamento_id] [int] NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[numero_intervencao] [nvarchar](50) NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[diagnostico] [nvarchar](max) NULL,
	[solucao] [nvarchar](max) NULL,
	[tecnico_id] [int] NOT NULL,
	[data_inicio] [datetime2](7) NOT NULL,
	[data_fim] [datetime2](7) NULL,
	[duracao_minutos] [int] NULL,
	[custo_mao_obra] [decimal](18, 2) NULL,
	[custo_pecas] [decimal](18, 2) NULL,
	[custo_total] [decimal](18, 2) NULL,
	[fornecedor_externo] [nvarchar](255) NULL,
	[numero_fatura] [nvarchar](100) NULL,
	[garantia] [bit] NOT NULL,
	[observacoes] [nvarchar](max) NULL,
	[status] [nvarchar](30) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[anexo_url] [nvarchar](300) NULL,
	[cliente_id] [int] NULL,
	[precisa_aprovacao_cliente] [bit] NULL,
	[aprovacao_cliente] [bit] NULL,
	[data_aprovacao] [datetime] NULL,
	[equipamento_sn] [nvarchar](100) NULL,
	[equipamento_descritivo] [nvarchar](500) NULL,
 CONSTRAINT [PK_intervencoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_CustosEquipamentos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Custos por Equipamento
CREATE   VIEW [dbo].[vw_CustosEquipamentos]
AS
SELECT 
    e.id AS equipamento_id,
    e.numero_interno,
    e.descricao AS equipamento_descricao,
    m.nome AS modelo,
    ma.nome AS marca,
    e.valor_aquisicao,
    ISNULL(SUM(i.custo_total), 0) AS custo_total_intervencoes,
    COUNT(i.id) AS total_intervencoes,
    e.valor_aquisicao + ISNULL(SUM(i.custo_total), 0) AS custo_total
FROM [dbo].[equipamentos] e
INNER JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
INNER JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
LEFT JOIN [dbo].[intervencoes] i ON e.id = i.equipamento_id
GROUP BY e.id, e.numero_interno, e.descricao, m.nome, ma.nome, e.valor_aquisicao;
GO
/****** Object:  Table [dbo].[a_formacoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[a_formacoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[m_formacao_id] [int] NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[tipo] [nvarchar](50) NULL,
	[ordem] [int] NOT NULL,
	[duracao_minutos] [decimal](5, 2) NULL,
	[publicado] [bit] NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[a_formacoes_blocos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[a_formacoes_blocos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[a_formacao_id] [int] NOT NULL,
	[titulo] [nvarchar](255) NULL,
	[conteudo] [nvarchar](max) NULL,
	[tipo] [nvarchar](50) NULL,
	[ordem] [int] NOT NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[a_formacoes_blocos_anexos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[a_formacoes_blocos_anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[bloco_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[legenda] [nvarchar](255) NULL,
	[ordem] [int] NOT NULL,
	[principal] [bit] NULL,
	[criado_em] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[a_formacoes_comentarios]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[a_formacoes_comentarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[a_formacao_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[comentario] [nvarchar](max) NULL,
	[rating] [int] NULL,
	[criado_em] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[a_formacoes_progresso]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[a_formacoes_progresso](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[aluno_id] [int] NOT NULL,
	[a_formacao_id] [int] NOT NULL,
	[visto] [bit] NULL,
	[tempo_assistido] [decimal](6, 2) NULL,
	[data_inicio] [datetime] NULL,
	[data_conclusao] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[anexos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[nome_original] [nvarchar](255) NOT NULL,
	[caminho] [nvarchar](500) NOT NULL,
	[tipo] [nvarchar](10) NULL,
	[tamanho_bytes] [bigint] NULL,
	[mime_type] [nvarchar](100) NULL,
	[hash_md5] [nvarchar](50) NULL,
	[principal] [bit] NOT NULL,
	[metadados] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[upload_por_id] [int] NULL,
	[variants] [nvarchar](max) NULL,
 CONSTRAINT [PK_anexos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[beneficios]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[beneficios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](255) NULL,
	[valor] [decimal](18, 2) NULL,
	[data_inicio] [date] NULL,
	[data_fim] [date] NULL,
	[codigo_pagamento] [nvarchar](50) NULL,
	[numero_beneficiario] [nvarchar](50) NULL,
	[operadora] [nvarchar](255) NULL,
	[observacoes] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_beneficios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[beneficios_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[beneficios_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[beneficio_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_beneficios_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categorias_conteudo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[slug] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[ordem] [int] NOT NULL,
	[ativo] [bit] NOT NULL,
	[categoria_pai_id] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_categorias_conteudo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[clientes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clientes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NULL,
	[num_cliente] [nvarchar](50) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[limite_credito] [decimal](15, 2) NULL,
	[desconto_comercial] [decimal](5, 2) NULL,
	[dia_vencimento_preferido] [int] NULL,
	[motivo_bloqueio] [nvarchar](500) NULL,
	[data_bloqueio] [datetime2](7) NULL,
	[gestor_conta_id] [int] NULL,
	[total_compras] [decimal](15, 2) NULL,
	[data_primeira_compra] [datetime2](7) NULL,
	[data_ultima_compra] [datetime2](7) NULL,
	[num_encomendas] [int] NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[origem] [nvarchar](100) NULL,
	[ativo] [bit] NOT NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[nome_cliente] [nvarchar](200) NOT NULL,
 CONSTRAINT [PK_clientes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comentarios]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comentarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[comentario_pai_id] [int] NULL,
	[autor_nome] [nvarchar](100) NULL,
	[autor_email] [nvarchar](255) NULL,
	[conteudo] [nvarchar](2000) NOT NULL,
	[aprovado] [bit] NOT NULL,
	[aprovado_por_id] [int] NULL,
	[aprovado_em] [datetime2](7) NULL,
	[denuncias] [int] NOT NULL,
	[likes] [int] NOT NULL,
	[ip_address] [nvarchar](50) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_comentarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[configuracoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[configuracoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](100) NOT NULL,
	[valor] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[encriptado] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contatos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contatos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[valor] [nvarchar](255) NOT NULL,
	[principal] [bit] NOT NULL,
	[observacoes] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_contatos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudo_anexo]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudo_anexo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_anexo] [nvarchar](20) NOT NULL,
	[legenda] [nvarchar](500) NULL,
	[ordem] [int] NOT NULL,
	[principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_anexo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudo_tag]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudo_tag](
	[conteudo_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_tag] PRIMARY KEY CLUSTERED 
(
	[conteudo_id] ASC,
	[tag_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_favoritos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos_favoritos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[notas] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_favoritos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_conteudos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_visualizacoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos_visualizacoes](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[ip_address] [nvarchar](50) NULL,
	[user_agent] [nvarchar](500) NULL,
	[referer] [nvarchar](500) NULL,
	[tempo_leitura_segundos] [int] NULL,
	[visualizado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_visualizacoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dependentes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[dependentes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[parentesco] [nvarchar](30) NOT NULL,
	[data_nascimento] [date] NULL,
	[cpf] [nvarchar](20) NULL,
	[profissao] [nvarchar](255) NULL,
	[tem_condicao_medica] [bit] NOT NULL,
	[descricao_condicao_medica] [nvarchar](500) NULL,
	[dependente_ir] [bit] NOT NULL,
	[dependente_saude] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_dependentes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[numero] [nvarchar](50) NOT NULL,
	[orgao_emissor] [nvarchar](100) NULL,
	[vitalicio] [bit] NULL,
	[data_emissao] [date] NULL,
	[data_validade] [date] NULL,
	[detalhes] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[anexo_url] [nvarchar](255) NULL,
 CONSTRAINT [PK_documentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[documento_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_documentos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empregos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[empresa] [nvarchar](255) NULL,
	[data_admissao] [date] NOT NULL,
	[data_inicio] [date] NOT NULL,
	[data_fim] [date] NULL,
	[tipo_contrato] [nvarchar](30) NULL,
	[cargo] [nvarchar](255) NOT NULL,
	[departamento] [nvarchar](255) NULL,
	[categoria] [nvarchar](100) NULL,
	[nivel_qualificacao] [nvarchar](255) NULL,
	[vencimento_base] [decimal](18, 2) NULL,
	[carga_horaria] [nvarchar](100) NULL,
	[situacao] [nvarchar](30) NULL,
	[motivo_desligamento] [nvarchar](500) NULL,
	[forma_pagamento] [nvarchar](50) NULL,
	[banco] [nvarchar](100) NULL,
	[agencia] [nvarchar](20) NULL,
	[conta] [nvarchar](30) NULL,
	[iban] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_empregos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empregos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[emprego_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_empregos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enderecos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[enderecos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[logradouro] [nvarchar](255) NOT NULL,
	[numero] [nvarchar](20) NULL,
	[complemento] [nvarchar](100) NULL,
	[bairro] [nvarchar](100) NULL,
	[cidade] [nvarchar](100) NOT NULL,
	[estado] [nvarchar](50) NULL,
	[codigo_postal] [nvarchar](20) NOT NULL,
	[pais] [nvarchar](100) NULL,
	[principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_enderecos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipamentos_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[equipamentos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[equipamento_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_equipamentos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[categoria] [nvarchar](100) NULL,
	[nivel] [nvarchar](50) NULL,
	[duracao_minutos] [decimal](6, 2) NULL,
	[autor_id] [int] NOT NULL,
	[publicado] [bit] NULL,
	[ativo] [bit] NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
	[capa_url] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_clientes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_clientes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[formacao_id] [int] NOT NULL,
	[cliente_id] [int] NOT NULL,
	[data_inscricao] [datetime] NULL,
	[progresso] [decimal](5, 2) NULL,
	[horas_estudo] [decimal](6, 2) NULL,
	[nota_final] [decimal](5, 2) NULL,
	[certificado_url] [nvarchar](255) NULL,
	[data_conclusao] [datetime] NULL,
	[ativo] [bit] NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_quiz]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_quiz](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[formacao_id] [int] NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[tempo_limite_minutos] [int] NULL,
	[nota_minima_aprovacao] [int] NULL,
	[mostrar_resultados] [bit] NOT NULL,
	[permitir_tentativas_multiplas] [bit] NOT NULL,
	[max_tentativas] [int] NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime] NOT NULL,
	[atualizado_em] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_quiz_opcoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_quiz_opcoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pergunta_id] [int] NOT NULL,
	[texto] [nvarchar](500) NOT NULL,
	[correta] [bit] NOT NULL,
	[ordem] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_quiz_perguntas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_quiz_perguntas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quiz_id] [int] NOT NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[enunciado] [nvarchar](max) NOT NULL,
	[pontuacao] [int] NOT NULL,
	[ordem] [int] NOT NULL,
	[criado_em] [datetime] NOT NULL,
	[atualizado_em] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_quiz_respostas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_quiz_respostas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tentativa_id] [int] NOT NULL,
	[pergunta_id] [int] NOT NULL,
	[opcao_id] [int] NULL,
	[resposta_texto] [nvarchar](max) NULL,
	[correta] [bit] NULL,
	[pontos_obtidos] [decimal](5, 2) NULL,
	[respondida_em] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formacoes_quiz_tentativas]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formacoes_quiz_tentativas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quiz_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[numero_tentativa] [int] NOT NULL,
	[nota_obtida] [decimal](5, 2) NULL,
	[data_inicio] [datetime] NOT NULL,
	[data_conclusao] [datetime] NULL,
	[tempo_decorrido_minutos] [int] NULL,
	[aprovado] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fornecedores]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fornecedores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NOT NULL,
	[num_fornecedor] [nvarchar](50) NULL,
	[segmento] [nvarchar](100) NULL,
	[setor_atividade] [nvarchar](100) NULL,
	[tipo_fornecedor] [nvarchar](50) NULL,
	[produtos_servicos] [nvarchar](500) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[dia_pagamento_preferido] [int] NULL,
	[iban] [nvarchar](50) NULL,
	[swift_bic] [nvarchar](20) NULL,
	[banco] [nvarchar](100) NULL,
	[prazo_entrega_dias] [int] NULL,
	[prazo_entrega_minimo] [int] NULL,
	[prazo_entrega_maximo] [int] NULL,
	[metodo_envio_preferido] [nvarchar](100) NULL,
	[morada_recolha] [nvarchar](500) NULL,
	[horario_entrega] [nvarchar](200) NULL,
	[rating_qualidade] [int] NULL,
	[rating_pontualidade] [int] NULL,
	[rating_preco] [int] NULL,
	[certificacoes] [nvarchar](500) NULL,
	[estado] [nvarchar](50) NULL,
	[motivo_bloqueio] [nvarchar](500) NULL,
	[data_bloqueio] [datetime2](7) NULL,
	[requer_aprovacao] [bit] NULL,
	[comprador_responsavel_id] [int] NULL,
	[total_compras] [decimal](15, 2) NULL,
	[data_primeira_compra] [datetime2](7) NULL,
	[data_ultima_compra] [datetime2](7) NULL,
	[num_encomendas] [int] NULL,
	[num_reclamacoes] [int] NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[tags] [nvarchar](500) NULL,
	[contrato_anexo_url] [nvarchar](500) NULL,
	[data_inicio_contrato] [datetime2](7) NULL,
	[data_fim_contrato] [datetime2](7) NULL,
	[ref_externa] [nvarchar](100) NULL,
	[id_phc] [nvarchar](50) NULL,
	[sincronizado_phc] [bit] NULL,
	[ultima_sincronizacao] [datetime2](7) NULL,
	[ativo] [bit] NOT NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_fornecedores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[funcionarios_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_funcionarios_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_permissao]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_permissao](
	[grupo_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_permissao] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_utilizador]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_utilizador](
	[grupo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_utilizador] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_grupos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[intervencoes_anexos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intervencoes_anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_documento] [nvarchar](255) NULL,
	[descricao] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_intervencoes_anexos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[intervencoes_custos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intervencoes_custos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[descricao] [nvarchar](255) NOT NULL,
	[codigo] [nvarchar](100) NULL,
	[quantidade] [int] NOT NULL,
	[valor_unitario] [decimal](18, 2) NULL,
	[valor_total] [decimal](18, 2) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[anexo_url] [nvarchar](255) NULL,
	[fornecedor_id] [int] NULL,
 CONSTRAINT [PK_intervencoes_pecas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[m_formacoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[m_formacoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[categoria] [nvarchar](100) NULL,
	[nivel] [nvarchar](50) NULL,
	[duracao_total] [decimal](6, 2) NULL,
	[ativo] [bit] NULL,
	[criado_por] [int] NOT NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
	[formacao_id] [int] NULL,
	[capa_url] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[newsletter_inscritos]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[newsletter_inscritos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[idioma] [nvarchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[permissoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[permissoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](100) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[modulo] [nvarchar](50) NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_permissoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tags]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tags](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](50) NOT NULL,
	[slug] [nvarchar](50) NOT NULL,
	[cor] [nvarchar](20) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_tags] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets_historico]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tickets_historico](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[tipo_acao] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](1000) NULL,
	[valor_anterior] [nvarchar](500) NULL,
	[valor_novo] [nvarchar](500) NULL,
	[visivel_cliente] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_tickets_historico] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipos_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipos_conteudo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[icone] [nvarchar](50) NULL,
	[permite_comentarios] [bit] NOT NULL,
	[permite_anexos] [bit] NOT NULL,
	[max_anexos] [int] NULL,
	[permite_galeria] [bit] NOT NULL,
	[requer_aprovacao] [bit] NOT NULL,
	[template_visualizacao] [nvarchar](100) NULL,
	[configuracao_campos] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[cor] [nvarchar](20) NULL,
 CONSTRAINT [PK_tipos_conteudo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipos_funcionarios]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipos_funcionarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[icone] [nvarchar](100) NULL,
 CONSTRAINT [PK_tipos_funcionarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transacoes]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transacoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[entidade_origem_tipo] [nvarchar](50) NOT NULL,
	[entidade_origem_id] [int] NOT NULL,
	[entidade_destino_tipo] [nvarchar](50) NOT NULL,
	[entidade_destino_id] [int] NOT NULL,
	[data_transacao] [datetime] NULL,
	[descricao] [nvarchar](255) NULL,
	[documento] [nvarchar](100) NULL,
	[tipo_transacao] [nvarchar](50) NOT NULL,
	[valor] [decimal](18, 2) NOT NULL,
	[moeda] [nvarchar](10) NULL,
	[anexo_url] [nvarchar](300) NULL,
	[estado] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[criado_por] [int] NULL,
	[criado_em] [datetime] NULL,
	[atualizado_em] [datetime] NULL,
	[documento_id] [int] NULL,
	[saldo_apos] [decimal](18, 2) NULL,
	[metadata] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transacoes_itens]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transacoes_itens](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[transacao_id] [int] NOT NULL,
	[item_tipo] [nvarchar](50) NOT NULL,
	[item_id] [int] NOT NULL,
	[valor] [decimal](18, 2) NOT NULL,
	[quantidade] [decimal](10, 2) NULL,
	[descricao] [nvarchar](500) NULL,
	[criado_em] [datetime] NOT NULL,
 CONSTRAINT [PK_transacoes_itens] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizador_permissao]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizador_permissao](
	[utilizador_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_permissao] PRIMARY KEY CLUSTERED 
(
	[utilizador_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veiculos_valores_personalizados]    Script Date: 01/11/2025 11:40:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[veiculos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[veiculo_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_veiculos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[a_formacoes] ON 
GO
INSERT [dbo].[a_formacoes] ([id], [m_formacao_id], [titulo], [descricao], [tipo], [ordem], [duracao_minutos], [publicado], [criado_em], [atualizado_em]) VALUES (1, 1, N'Download do PHC', NULL, N'outro', 1, CAST(10.00 AS Decimal(5, 2)), 1, CAST(N'2025-10-29T17:26:28.850' AS DateTime), CAST(N'2025-10-29T17:26:28.850' AS DateTime))
GO
INSERT [dbo].[a_formacoes] ([id], [m_formacao_id], [titulo], [descricao], [tipo], [ordem], [duracao_minutos], [publicado], [criado_em], [atualizado_em]) VALUES (2, 1, N'Configuração da Máquina', N'Configuração do computador para máximo proveito do phc', NULL, 2, CAST(15.00 AS Decimal(5, 2)), 1, CAST(N'2025-10-29T17:36:00.567' AS DateTime), CAST(N'2025-10-29T17:36:00.567' AS DateTime))
GO
INSERT [dbo].[a_formacoes] ([id], [m_formacao_id], [titulo], [descricao], [tipo], [ordem], [duracao_minutos], [publicado], [criado_em], [atualizado_em]) VALUES (3, 2, N'Módulo de Frotas', NULL, NULL, 1, CAST(5.00 AS Decimal(5, 2)), 1, CAST(N'2025-10-29T17:55:46.563' AS DateTime), CAST(N'2025-10-29T17:55:46.563' AS DateTime))
GO
INSERT [dbo].[a_formacoes] ([id], [m_formacao_id], [titulo], [descricao], [tipo], [ordem], [duracao_minutos], [publicado], [criado_em], [atualizado_em]) VALUES (4, 2, N'Módulo de Stocks', NULL, NULL, 2, CAST(5.00 AS Decimal(5, 2)), 1, CAST(N'2025-10-29T17:56:00.210' AS DateTime), CAST(N'2025-10-29T17:56:00.210' AS DateTime))
GO
INSERT [dbo].[a_formacoes] ([id], [m_formacao_id], [titulo], [descricao], [tipo], [ordem], [duracao_minutos], [publicado], [criado_em], [atualizado_em]) VALUES (5, 2, N'Módulo de Faturas', NULL, NULL, 3, CAST(3.00 AS Decimal(5, 2)), 1, CAST(N'2025-10-29T17:56:13.003' AS DateTime), CAST(N'2025-10-29T17:56:13.003' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[a_formacoes] OFF
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_blocos] ON 
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (1, 1, N'Download', N'Existem várias maneiras de dar download do phc seja via web ou via pacote usb', N'texto', 1, CAST(N'2025-10-29T17:36:44.403' AS DateTime), CAST(N'2025-10-29T17:36:44.403' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (2, 1, N'Demonstração download ', N'É possível ver no vídeo o download do phc através do site oficial da cegid', N'video', 2, CAST(N'2025-10-29T17:37:42.400' AS DateTime), CAST(N'2025-10-29T17:37:42.400' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (3, 2, N'Demonstração de Configuração ', NULL, N'imagem', 1, CAST(N'2025-10-29T17:53:56.743' AS DateTime), CAST(N'2025-10-29T17:53:56.743' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (4, 3, N'Demostração modulo de frotas', N'O modulo de frotas serve para gerir as viaturas e os quilometros de uma empresa
', N'texto', 1, CAST(N'2025-10-29T17:56:57.680' AS DateTime), CAST(N'2025-10-29T17:56:57.680' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (5, 4, N'Demonstração módulos de stocks ', N'O modulo de stocks serve para gerir entradas e saidas de material', N'texto', 1, CAST(N'2025-10-29T18:01:28.050' AS DateTime), CAST(N'2025-10-29T18:01:28.050' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos] ([id], [a_formacao_id], [titulo], [conteudo], [tipo], [ordem], [criado_em], [atualizado_em]) VALUES (6, 5, N'Demonstracao Modulo de faturas', N'Imagem fsafsa', N'imagem', 1, CAST(N'2025-10-29T18:40:04.803' AS DateTime), CAST(N'2025-10-29T18:40:04.803' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_blocos] OFF
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_blocos_anexos] ON 
GO
INSERT [dbo].[a_formacoes_blocos_anexos] ([id], [bloco_id], [anexo_id], [legenda], [ordem], [principal], [criado_em]) VALUES (4, 4, 7, N'Frota1.jpg', 1, 1, CAST(N'2025-10-29T17:57:30.220' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos_anexos] ([id], [bloco_id], [anexo_id], [legenda], [ordem], [principal], [criado_em]) VALUES (5, 5, 8, N'cativar_stock03.png', 1, 1, CAST(N'2025-10-29T18:01:45.400' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos_anexos] ([id], [bloco_id], [anexo_id], [legenda], [ordem], [principal], [criado_em]) VALUES (6, 5, 9, N'vvstock1.jpg', 2, 0, CAST(N'2025-10-29T18:01:57.263' AS DateTime))
GO
INSERT [dbo].[a_formacoes_blocos_anexos] ([id], [bloco_id], [anexo_id], [legenda], [ordem], [principal], [criado_em]) VALUES (7, 6, 10, N'faturascunho2fancy.png', 1, 1, CAST(N'2025-10-29T18:40:17.427' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_blocos_anexos] OFF
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_progresso] ON 
GO
INSERT [dbo].[a_formacoes_progresso] ([id], [aluno_id], [a_formacao_id], [visto], [tempo_assistido], [data_inicio], [data_conclusao]) VALUES (1, 1, 2, 1, CAST(0.00 AS Decimal(6, 2)), CAST(N'2025-10-29T18:07:28.270' AS DateTime), CAST(N'2025-10-29T18:07:28.270' AS DateTime))
GO
INSERT [dbo].[a_formacoes_progresso] ([id], [aluno_id], [a_formacao_id], [visto], [tempo_assistido], [data_inicio], [data_conclusao]) VALUES (2, 1, 3, 1, CAST(0.00 AS Decimal(6, 2)), CAST(N'2025-10-29T18:22:52.720' AS DateTime), CAST(N'2025-10-29T18:22:52.720' AS DateTime))
GO
INSERT [dbo].[a_formacoes_progresso] ([id], [aluno_id], [a_formacao_id], [visto], [tempo_assistido], [data_inicio], [data_conclusao]) VALUES (3, 1, 4, 1, CAST(0.00 AS Decimal(6, 2)), CAST(N'2025-10-29T18:22:57.347' AS DateTime), CAST(N'2025-10-29T18:22:57.347' AS DateTime))
GO
INSERT [dbo].[a_formacoes_progresso] ([id], [aluno_id], [a_formacao_id], [visto], [tempo_assistido], [data_inicio], [data_conclusao]) VALUES (4, 1, 5, 1, CAST(0.00 AS Decimal(6, 2)), CAST(N'2025-10-29T18:41:57.580' AS DateTime), CAST(N'2025-10-29T18:41:57.580' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[a_formacoes_progresso] OFF
GO
SET IDENTITY_INSERT [dbo].[anexos] ON 
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (1, N'c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg', N'microlopes.png', N'http://localhost:9833/api/uploads\tenant_1003\c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg', N'png', 149999, N'image/png', NULL, 0, NULL, CAST(N'2025-10-29T12:36:29.9233333' AS DateTime2), CAST(N'2025-10-29T12:36:29.9233333' AS DateTime2), NULL, N'{"original":"c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_original.jpg","large":"c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_original.jpg","medium":"c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg","small":"c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_small.jpg","thumbnail":"c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (2, N'923daed1-3205-43e6-96e4-f114881c1f7c_medium.jpg', N'Captura de ecrÃ£ 2025-10-29 130526.png', N'http://localhost:9833/api/uploads\tenant_1003\923daed1-3205-43e6-96e4-f114881c1f7c_medium.jpg', N'png', 230177, N'image/png', NULL, 0, NULL, CAST(N'2025-10-29T13:05:51.0833333' AS DateTime2), CAST(N'2025-10-29T13:05:51.0833333' AS DateTime2), NULL, N'{"original":"923daed1-3205-43e6-96e4-f114881c1f7c_original.jpg","large":"923daed1-3205-43e6-96e4-f114881c1f7c_original.jpg","medium":"923daed1-3205-43e6-96e4-f114881c1f7c_medium.jpg","small":"923daed1-3205-43e6-96e4-f114881c1f7c_small.jpg","thumbnail":"923daed1-3205-43e6-96e4-f114881c1f7c_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (3, N'ed550e45-6879-40ef-8756-d0a692abbbe5_medium.jpg', N'Frame_3.png', N'http://localhost:9833/api/uploads\tenant_1003\ed550e45-6879-40ef-8756-d0a692abbbe5_medium.jpg', N'png', 50562, N'image/png', NULL, 0, NULL, CAST(N'2025-10-29T13:13:31.7033333' AS DateTime2), CAST(N'2025-10-29T13:13:31.7033333' AS DateTime2), NULL, N'{"original":"ed550e45-6879-40ef-8756-d0a692abbbe5_original.jpg","large":"ed550e45-6879-40ef-8756-d0a692abbbe5_original.jpg","medium":"ed550e45-6879-40ef-8756-d0a692abbbe5_medium.jpg","small":"ed550e45-6879-40ef-8756-d0a692abbbe5_small.jpg","thumbnail":"ed550e45-6879-40ef-8756-d0a692abbbe5_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (4, N'045085e8-9558-4fa9-b9bf-c312a2547ffe_medium.jpg', N'escola-as.jpg', N'http://localhost:9833/api/uploads\tenant_1003\045085e8-9558-4fa9-b9bf-c312a2547ffe_medium.jpg', N'jpg', 178980, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-29T17:52:56.2900000' AS DateTime2), CAST(N'2025-10-29T17:52:56.2900000' AS DateTime2), NULL, N'{"original":"045085e8-9558-4fa9-b9bf-c312a2547ffe_original.jpg","large":"045085e8-9558-4fa9-b9bf-c312a2547ffe_original.jpg","medium":"045085e8-9558-4fa9-b9bf-c312a2547ffe_medium.jpg","small":"045085e8-9558-4fa9-b9bf-c312a2547ffe_small.jpg","thumbnail":"045085e8-9558-4fa9-b9bf-c312a2547ffe_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (5, N'f7bc57a9-7b8d-406d-9678-c80a6daff3b9_medium.jpg', N'new-year.jpg', N'http://localhost:9833/api/uploads\tenant_1003\f7bc57a9-7b8d-406d-9678-c80a6daff3b9_medium.jpg', N'jpg', 787565, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-29T17:52:56.7966667' AS DateTime2), CAST(N'2025-10-29T17:52:56.7966667' AS DateTime2), NULL, N'{"original":"f7bc57a9-7b8d-406d-9678-c80a6daff3b9_original.jpg","large":"f7bc57a9-7b8d-406d-9678-c80a6daff3b9_large.jpg","medium":"f7bc57a9-7b8d-406d-9678-c80a6daff3b9_medium.jpg","small":"f7bc57a9-7b8d-406d-9678-c80a6daff3b9_small.jpg","thumbnail":"f7bc57a9-7b8d-406d-9678-c80a6daff3b9_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (6, N'4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_medium.jpg', N'new-courses.jpg', N'http://localhost:9833/api/uploads\tenant_1003\4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_medium.jpg', N'jpg', 581174, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-29T17:52:56.9366667' AS DateTime2), CAST(N'2025-10-29T17:52:56.9366667' AS DateTime2), NULL, N'{"original":"4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_original.jpg","large":"4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_original.jpg","medium":"4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_medium.jpg","small":"4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_small.jpg","thumbnail":"4a2f9fa9-f7fd-493a-9a40-616c3bb526ef_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (7, N'Frota1.jpg', N'Frota1.jpg', N'https://www.phc.pt/enews/Frota1.jpg', N'jpg', 0, NULL, NULL, 0, NULL, CAST(N'2025-10-29T17:57:30.1600000' AS DateTime2), CAST(N'2025-10-29T17:57:30.1600000' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (8, N'cativar_stock03.png', N'cativar_stock03.png', N'https://www.phc.pt/enews/cativar_stock03.png', N'png', 0, NULL, NULL, 0, NULL, CAST(N'2025-10-29T18:01:45.3166667' AS DateTime2), CAST(N'2025-10-29T18:01:45.3166667' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (9, N'vvstock1.jpg', N'vvstock1.jpg', N'https://www.phc.pt/enews/vvstock1.jpg', N'jpg', 0, NULL, NULL, 0, NULL, CAST(N'2025-10-29T18:01:57.2033333' AS DateTime2), CAST(N'2025-10-29T18:01:57.2033333' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (10, N'faturascunho2fancy.png', N'faturascunho2fancy.png', N'https://www.phc.pt/enews/faturascunho2fancy.png', N'png', 0, NULL, NULL, 0, NULL, CAST(N'2025-10-29T18:40:17.3666667' AS DateTime2), CAST(N'2025-10-29T18:40:17.3666667' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (11, N'a76c37d3-34ba-433b-9906-6dbbac28014f_medium.jpg', N'Captura de ecrÃ£ 2025-10-29 094826.png', N'http://localhost:9833/api/uploads\tenant_1003\a76c37d3-34ba-433b-9906-6dbbac28014f_medium.jpg', N'png', 71740, N'image/png', NULL, 0, NULL, CAST(N'2025-10-30T16:41:38.1500000' AS DateTime2), CAST(N'2025-10-30T16:41:38.1500000' AS DateTime2), NULL, N'{"original":"a76c37d3-34ba-433b-9906-6dbbac28014f_original.jpg","large":"a76c37d3-34ba-433b-9906-6dbbac28014f_original.jpg","medium":"a76c37d3-34ba-433b-9906-6dbbac28014f_medium.jpg","small":"a76c37d3-34ba-433b-9906-6dbbac28014f_small.jpg","thumbnail":"a76c37d3-34ba-433b-9906-6dbbac28014f_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (12, N'1b2e9b6b-e103-4b91-ab3b-ff78abddc50c.pdf', N'Documento TÃ©cnico - Nautis Design.pdf', N'http://localhost:9833/api/uploads/tenant_1003/1b2e9b6b-e103-4b91-ab3b-ff78abddc50c.pdf', N'pdf', 346182, N'application/pdf', NULL, 0, NULL, CAST(N'2025-10-31T00:08:13.3200000' AS DateTime2), CAST(N'2025-10-31T00:08:13.3200000' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (13, N'714d9b1b-7732-463a-92b5-aea357512f13_medium.jpg', N'Screenshot-90-1024x521ggg.png', N'http://localhost:9833/api/uploads\tenant_1003\714d9b1b-7732-463a-92b5-aea357512f13_medium.jpg', N'png', 147998, N'image/png', NULL, 0, NULL, CAST(N'2025-10-31T22:54:18.5500000' AS DateTime2), CAST(N'2025-10-31T22:54:18.5500000' AS DateTime2), NULL, N'{"original":"714d9b1b-7732-463a-92b5-aea357512f13_original.jpg","large":"714d9b1b-7732-463a-92b5-aea357512f13_original.jpg","medium":"714d9b1b-7732-463a-92b5-aea357512f13_medium.jpg","small":"714d9b1b-7732-463a-92b5-aea357512f13_small.jpg","thumbnail":"714d9b1b-7732-463a-92b5-aea357512f13_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (14, N'6d967095-7c10-45cf-b523-4b9f6ba4d73c_medium.jpg', N'microlopes.png', N'http://localhost:9833/api/uploads\tenant_1003\6d967095-7c10-45cf-b523-4b9f6ba4d73c_medium.jpg', N'png', 149999, N'image/png', NULL, 0, NULL, CAST(N'2025-10-31T22:55:42.0100000' AS DateTime2), CAST(N'2025-10-31T22:55:42.0100000' AS DateTime2), NULL, N'{"original":"6d967095-7c10-45cf-b523-4b9f6ba4d73c_original.jpg","large":"6d967095-7c10-45cf-b523-4b9f6ba4d73c_original.jpg","medium":"6d967095-7c10-45cf-b523-4b9f6ba4d73c_medium.jpg","small":"6d967095-7c10-45cf-b523-4b9f6ba4d73c_small.jpg","thumbnail":"6d967095-7c10-45cf-b523-4b9f6ba4d73c_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (15, N'75ad9d1d-83df-441e-89ba-0247b02234b7_medium.jpg', N'Frame_3.png', N'http://localhost:9833/api/uploads\tenant_1003\75ad9d1d-83df-441e-89ba-0247b02234b7_medium.jpg', N'png', 50562, N'image/png', NULL, 0, NULL, CAST(N'2025-10-31T23:43:18.5466667' AS DateTime2), CAST(N'2025-10-31T23:43:18.5466667' AS DateTime2), NULL, N'{"original":"75ad9d1d-83df-441e-89ba-0247b02234b7_original.jpg","large":"75ad9d1d-83df-441e-89ba-0247b02234b7_original.jpg","medium":"75ad9d1d-83df-441e-89ba-0247b02234b7_medium.jpg","small":"75ad9d1d-83df-441e-89ba-0247b02234b7_small.jpg","thumbnail":"75ad9d1d-83df-441e-89ba-0247b02234b7_thumb.jpg"}')
GO
SET IDENTITY_INSERT [dbo].[anexos] OFF
GO
SET IDENTITY_INSERT [dbo].[categorias_conteudo] ON 
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (1, N'Tecnologia', N'tecnologia', N'Artigos e conteúdos sobre inovação e tecnologia.', N'#0078D7', N'tabler-device-laptop', 1, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (2, N'Negócios', N'negocios', N'Tópicos relacionados a gestão, finanças e empreendedorismo.', N'#FFB900', N'tabler-briefcase', 2, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (3, N'Marketing', N'marketing', N'Dicas e estratégias de marketing digital.', N'#E74856', N'tabler-megaphone', 3, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (4, N'Saúde', N'saude', N'Conteúdos sobre bem-estar, nutrição e saúde mental.', N'#009E60', N'tabler-heartbeat', 4, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (5, N'Educação', N'educacao', N'Artigos e formações sobre aprendizagem e ensino.', N'#FF8C00', N'tabler-book', 5, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (6, N'Carreira', N'carreira', N'Dicas profissionais e desenvolvimento pessoal.', N'#A4373A', N'tabler-user-tie', 6, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (7, N'Inovação', N'inovacao', N'Novas ideias, startups e tendências.', N'#0063B1', N'tabler-bulb', 7, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (8, N'Sustentabilidade', N'sustentabilidade', N'Conteúdos sobre meio ambiente e práticas verdes.', N'#107C10', N'tabler-leaf', 8, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (9, N'Notícias', N'noticias', N'Últimas atualizações e comunicados.', N'#515C6B', N'tabler-news', 9, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (10, N'Eventos', N'eventos', N'Divulgação de eventos, palestras e conferências.', N'#B146C2', N'tabler-calendar-event', 10, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (11, N'Formações', N'formacoes', N'Cursos e formações disponíveis.', N'#0099BC', N'tabler-school', 11, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (12, N'Vídeos', N'videos', N'Coleção de vídeos e tutoriais educativos.', N'#FF4343', N'tabler-video', 12, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (13, N'Projetos', N'projetos', N'Projetos internos e externos em destaque.', N'#F7630C', N'tabler-folder', 13, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (14, N'Clientes', N'clientes', N'Histórias de sucesso e casos de clientes.', N'#498205', N'tabler-users-group', 14, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (15, N'Parceiros', N'parceiros', N'Empresas e organizações parceiras.', N'#B91D47', N'tabler-handshake', 15, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (16, N'Documentos', N'documentos', N'Guias, PDFs e outros documentos úteis.', N'#2D7D9A', N'tabler-file-description', 16, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (17, N'Blog', N'blog', N'Publicações gerais e artigos de opinião.', N'#607D8B', N'tabler-pencil', 17, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (18, N'Tutoriais', N'tutoriais', N'Passo a passo e guias técnicos.', N'#00B294', N'tabler-manual-gearbox', 18, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (19, N'RH', N'rh', N'Conteúdos de recursos humanos e cultura interna.', N'#8E8CD8', N'tabler-users', 19, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (20, N'Segurança', N'seguranca', N'Práticas de segurança digital e física.', N'#D13438', N'tabler-shield-lock', 20, 1, NULL, CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2), CAST(N'2025-10-29T12:38:00.9466667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[categorias_conteudo] OFF
GO
SET IDENTITY_INSERT [dbo].[categorias_equipamento] ON 
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'Computadores', N'Equipamentos de processamento e trabalho informático.', N'tabler-device-desktop', N'#0078D7', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (2, N'Portáteis', N'Laptops e notebooks para uso profissional ou pessoal.', N'tabler-device-laptop', N'#3399FF', 1, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (3, N'Servidores', N'Máquinas dedicadas à gestão de redes e aplicações.', N'tabler-server', N'#004E8C', 1, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (4, N'Monitores', N'Ecrãs e displays de diferentes tamanhos e resoluções.', N'tabler-device-monitor', N'#0096C7', 1, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (5, N'Impressoras', N'Impressoras a jato de tinta, laser e multifunções.', N'tabler-printer', N'#00BFFF', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (6, N'Scanners', N'Dispositivos para digitalização de documentos e imagens.', N'tabler-scan', N'#00CED1', 5, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (7, N'Redes', N'Equipamentos de rede como routers, switches e access points.', N'tabler-network', N'#4CAF50', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (8, N'Roteadores', N'Routers e gateways para ligação à internet.', N'tabler-router', N'#388E3C', 7, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (9, N'Switches', N'Switches de rede para distribuição de tráfego.', N'tabler-topology-star-3', N'#2E7D32', 7, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (10, N'Câmaras de Vigilância', N'Sistemas de CCTV e câmaras IP.', N'tabler-camera-security', N'#9C27B0', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (11, N'Alarmes', N'Sistemas de deteção de intrusão e alarmes.', N'tabler-alarm', N'#AB47BC', 10, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (12, N'Controlo de Acesso', N'Leitores biométricos e cartões RFID.', N'tabler-id', N'#8E24AA', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (13, N'Telefones IP', N'Dispositivos de voz sobre IP (VoIP).', N'tabler-phone', N'#FF9800', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (14, N'Projetores', N'Projetores multimédia e de escritório.', N'tabler-device-projector', N'#FFC107', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (15, N'Fontes de Alimentação', N'UPS, estabilizadores e fontes externas.', N'tabler-bolt', N'#FF5722', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (16, N'Componentes Internos', N'Memórias, discos, placas e processadores.', N'tabler-cpu', N'#607D8B', 1, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (17, N'Periféricos', N'Dispositivos externos como teclados e ratos.', N'tabler-device-mouse', N'#795548', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (18, N'Armazenamento', N'Discos rígidos, SSDs e NAS.', N'tabler-database', N'#3F51B5', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (19, N'Software', N'Sistemas operativos, aplicações e licenças.', N'tabler-code', N'#673AB7', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (20, N'Equipamentos Elétricos', N'Equipamentos elétricos e de energia.', N'tabler-plug', N'#E91E63', NULL, 1, CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2), CAST(N'2025-10-30T23:30:10.8366667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[categorias_equipamento] OFF
GO
SET IDENTITY_INSERT [dbo].[clientes] ON 
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (1, 1, N'CLI001', N'30 dias', N'Transferência Bancária', CAST(25000.00 AS Decimal(15, 2)), CAST(5.00 AS Decimal(5, 2)), 15, NULL, NULL, 1, CAST(150000.00 AS Decimal(15, 2)), CAST(N'2024-01-10T00:00:00.0000000' AS DateTime2), CAST(N'2025-10-20T00:00:00.0000000' AS DateTime2), 12, N'João Martins', N'Gestor de TI', N'joao.martins@softon.pt', N'+351912345678', N'Cliente estratégico com histórico positivo.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), N'Softon Solutions')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (2, 2, N'CLI002', N'60 dias', N'Cheque', CAST(50000.00 AS Decimal(15, 2)), CAST(3.00 AS Decimal(5, 2)), 30, NULL, NULL, 2, CAST(87000.00 AS Decimal(15, 2)), CAST(N'2024-05-14T00:00:00.0000000' AS DateTime2), CAST(N'2025-09-18T00:00:00.0000000' AS DateTime2), 8, N'Maria Silva', N'Diretora Financeira', N'maria.silva@nautis.pt', N'+351913223344', N'Cliente regular, pagamentos pontuais.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), N'Nautis Systems')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (3, 3, N'CLI003', N'30 dias', N'Cartão de Crédito', CAST(15000.00 AS Decimal(15, 2)), CAST(2.50 AS Decimal(5, 2)), 10, NULL, NULL, 1, CAST(45000.00 AS Decimal(15, 2)), CAST(N'2024-02-05T00:00:00.0000000' AS DateTime2), CAST(N'2025-08-29T00:00:00.0000000' AS DateTime2), 10, N'Rui Costa', N'Administrador', N'rui.costa@techwave.pt', N'+351914445566', N'Cliente em expansão, bom potencial.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), N'TechWave')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (4, 4, N'CLI004', N'45 dias', N'Transferência Bancária', CAST(30000.00 AS Decimal(15, 2)), CAST(4.00 AS Decimal(5, 2)), 20, NULL, NULL, 2, CAST(120000.00 AS Decimal(15, 2)), CAST(N'2023-12-10T00:00:00.0000000' AS DateTime2), CAST(N'2025-09-15T00:00:00.0000000' AS DateTime2), 15, N'Carla Ferreira', N'Gestora Comercial', N'carla.ferreira@datalogic.pt', N'+351916778899', N'Cliente premium com alto volume de dados.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), N'DataLogic')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (5, 5, N'CLI005', N'60 dias', N'Transferência Bancária', CAST(60000.00 AS Decimal(15, 2)), CAST(3.50 AS Decimal(5, 2)), 25, NULL, NULL, 1, CAST(270000.00 AS Decimal(15, 2)), CAST(N'2023-12-12T00:00:00.0000000' AS DateTime2), CAST(N'2025-09-30T00:00:00.0000000' AS DateTime2), 18, N'André Pinto', N'Diretor de Operações', N'andre.pinto@cloudprime.pt', N'+351917667788', N'Cliente fiel, movimenta grandes volumes.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), CAST(N'2025-10-29T17:22:22.5300000' AS DateTime2), N'CloudPrime')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (6, NULL, N'CLI999', N'Pronto pagamento', N'Dinheiro', CAST(0.00 AS Decimal(15, 2)), CAST(0.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, CAST(0.00 AS Decimal(15, 2)), NULL, NULL, 0, NULL, NULL, NULL, NULL, N'Cliente genérico para vendas sem fatura', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:24:56.5100000' AS DateTime2), CAST(N'2025-10-29T17:24:56.5100000' AS DateTime2), N'Consumidor Final')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (8, NULL, N'CLI1001', N'Pronto pagamento', N'MBWAY', CAST(500.00 AS Decimal(15, 2)), CAST(0.00 AS Decimal(5, 2)), NULL, NULL, NULL, 1, CAST(350.00 AS Decimal(15, 2)), CAST(N'2024-11-12T00:00:00.0000000' AS DateTime2), CAST(N'2025-09-01T00:00:00.0000000' AS DateTime2), 3, N'Luís Pereira', NULL, N'luis.pereira@gmail.com', N'+351917112233', N'Cliente particular com compras ocasionais.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:25:32.6666667' AS DateTime2), CAST(N'2025-10-29T17:25:32.6666667' AS DateTime2), N'Luís Pereira')
GO
INSERT [dbo].[clientes] ([id], [empresa_id], [num_cliente], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [dia_vencimento_preferido], [motivo_bloqueio], [data_bloqueio], [gestor_conta_id], [total_compras], [data_primeira_compra], [data_ultima_compra], [num_encomendas], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [origem], [ativo], [criado_por], [atualizado_por], [criado_em], [atualizado_em], [nome_cliente]) VALUES (9, NULL, N'CLI1002', N'30 dias', N'Cartão de Crédito', CAST(1000.00 AS Decimal(15, 2)), CAST(0.00 AS Decimal(5, 2)), 30, NULL, NULL, 2, CAST(920.00 AS Decimal(15, 2)), CAST(N'2025-01-05T00:00:00.0000000' AS DateTime2), CAST(N'2025-10-15T00:00:00.0000000' AS DateTime2), 5, N'Inês Carvalho', NULL, N'ines.carvalho@hotmail.com', N'+351918556677', N'Cliente particular regular com bom histórico de pagamento.', N'interno', 1, 1, 1, CAST(N'2025-10-29T17:25:32.6666667' AS DateTime2), CAST(N'2025-10-29T17:25:32.6666667' AS DateTime2), N'Inês Carvalho')
GO
SET IDENTITY_INSERT [dbo].[clientes] OFF
GO
SET IDENTITY_INSERT [dbo].[configuracoes] ON 
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (1, N'SITE_PUBLIC_ENABLED', N'Define se o site público está ativo (1) ou desativado (0)', N'1', CAST(N'2025-10-30T18:35:11.5633333' AS DateTime2), CAST(N'2025-10-30T18:35:11.5633333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (2, N'SITE_PUBLIC_LANGUAGES', N'Idiomas disponíveis no site público', N'["pt-PT", "en", "es", "fr", "de", "it", "ar"]', CAST(N'2025-10-30T18:35:15.7700000' AS DateTime2), CAST(N'2025-10-30T18:35:15.7700000' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (3, N'SMTP_HOST', N'Servidor SMTP utilizado para envio de e-mails (encriptado).', N'UOZ6xEby8c6Zdi55o5yoGw==', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (4, N'SMTP_PORT', N'Porta do servidor SMTP (encriptada).', N'oU0/ZkpSr3T22F1d7K7onPWpFRyqb28jB5HzlF0vK2U=', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (5, N'SMTP_SECURE', N'Define se a conexão SMTP é segura (true/false, encriptado).', N'Sb3wrxammZSwpT/n0UsUHg==', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (6, N'SMTP_USER', N'Utilizador da conta SMTP (encriptado).', N'oU0/ZkpSr3T22F1d7K7onPWpFRyqb28jB5HzlF0vK2U=', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (7, N'SMTP_PASS', N'Senha ou App Password da conta SMTP (encriptada).', N'Eo/rlOB3UHXvjtSzwLWsQHliMQOgWNAoUGaPytWPBgY=', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (8, N'SMTP_FROM', N'Endereço padrão de envio (encriptado).', N'7TQ/Vnlk+SbYWKDgzACkOqIpHiMMsmQ4/fKMCwXHQPs=', CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), CAST(N'2025-10-31T11:22:46.5833333' AS DateTime2), 1)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (9, N'TENANT_NAME', N'Nome do tenant / comunidade atual.', N'Comunidade Microlopes', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (10, N'NEXT_PUBLIC_TENANT_NAME', N'Nome público do tenant visível no frontend.', N'Comunidade Microlopes', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (11, N'CLIENT_PORTAL', N'Ativa ou desativa o portal de clientes.', N'true', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (12, N'SUPPLIER_PORTAL', N'Ativa ou desativa o portal de fornecedores.', N'true', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (13, N'TICKET_PORTAL', N'Ativa ou desativa o portal de tickets.', N'true', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (14, N'USE_TENANT_LOGO', N'Define se o logotipo do tenant é usado no frontend.', N'true', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (15, N'TENANT_LOGO_PATH', N'Caminho do logotipo do tenant.', N'/images/tenant/logo (2).svg', CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), CAST(N'2025-10-31T18:12:46.5233333' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (16, N'CEO_TRANSLATIONS', N'Define se o sistema possui traduções específicas para o CEO (true/false)', N'true', CAST(N'2025-10-31T18:45:00.0000000' AS DateTime2), CAST(N'2025-10-31T18:55:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[configuracoes] ([id], [codigo], [descricao], [valor], [criado_em], [atualizado_em], [encriptado]) VALUES (17, N'TENANT_LOGO_PATH_DARK', N'Caminho do logotipo do tenant (dark mode).', N'/images/tenant/logo-dark.svg', CAST(N'2025-10-31T23:08:13.3300000' AS DateTime2), NULL, 0)
GO
SET IDENTITY_INSERT [dbo].[configuracoes] OFF
GO
SET IDENTITY_INSERT [dbo].[contatos] ON 
GO
INSERT [dbo].[contatos] ([id], [funcionario_id], [tipo], [valor], [principal], [observacoes], [criado_em], [atualizado_em]) VALUES (2, 1, N'Email', N'dasvieira07@gmail.com', 1, NULL, CAST(N'2025-10-29T13:16:24.1633333' AS DateTime2), CAST(N'2025-10-29T13:18:17.9100000' AS DateTime2))
GO
INSERT [dbo].[contatos] ([id], [funcionario_id], [tipo], [valor], [principal], [observacoes], [criado_em], [atualizado_em]) VALUES (3, 1, N'Telefone', N'969207733', 1, NULL, CAST(N'2025-10-29T13:17:43.6300000' AS DateTime2), CAST(N'2025-10-29T13:17:43.6300000' AS DateTime2))
GO
INSERT [dbo].[contatos] ([id], [funcionario_id], [tipo], [valor], [principal], [observacoes], [criado_em], [atualizado_em]) VALUES (4, 1, N'Email', N'davidvieira@microlopes.pt', 0, N'Email profissional
', CAST(N'2025-10-29T13:22:57.3200000' AS DateTime2), CAST(N'2025-10-29T13:22:57.3200000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[contatos] OFF
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 1, CAST(N'2025-10-29T13:04:21.2566667' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 2, CAST(N'2025-10-29T13:04:21.2700000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 3, CAST(N'2025-10-29T13:04:21.2800000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 4, CAST(N'2025-10-29T13:04:21.2933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 5, CAST(N'2025-10-29T13:04:21.3066667' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 6, CAST(N'2025-10-29T13:04:21.3200000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 7, CAST(N'2025-10-29T13:04:21.3333333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (1, 8, CAST(N'2025-10-29T13:04:21.3433333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 1, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 2, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 3, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 4, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 5, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 6, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 7, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2, 8, CAST(N'2025-10-29T12:49:05.0933333' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 1, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 2, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 3, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 4, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 5, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 6, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 7, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (3, 8, CAST(N'2025-10-29T12:58:06.6000000' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (4, 1, CAST(N'2025-10-30T23:25:44.2066667' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (5, 1, CAST(N'2025-10-30T16:41:40.4433333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[conteudos] ON 
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (1, 16, 3, N'Bem vindo à Microlopes', N'bem-vindo-microlopes', N'Seja bem vindo ao nosso espaço digital Microlopes!', NULL, N'<h1 style="text-align: justify;"><strong>Sobre Nós</strong></h1><h3><strong>&nbsp;</strong></h3><p>Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde <strong>1986</strong>, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.</p><p>Porém, perante a quantidade de solicitações feitas pelos seus clientes, a Microgaia teve que alargar a sua área de funcionamento, criando outros departamentos, para além da formação de técnicos. Desta forma, o ano que marcou o início do milénio, assinalou também, o começo de uma nova fase na vida desta entidade patronal, mudando o nome de Microgaia para Microlopes.</p><p>Assim, a empresa apresenta, atualmente, um organigrama com secções distintas, desde a formação de pessoal especializado, mas também do departamento Clínica (no qual se faz montagens de computadores, servidores e bastidores, entre outros) e Consultoria. O departamento de Consultoria subdivide-se, entre outras, no sector de Sistemas de Informação Empresarial (onde se oferece uma gama de serviços como a informatização de empresas, na área da Gestão e ERP, Financeira, CRM, etc e, ainda, programas informáticos verticais próprios para clínicas, restaurantes, escolas, farmácias, entre muitos outros).</p><p>A empresa está empenhada com a sua nova política de expansão e divulgação dos respetivos serviços e produtos, apostando, em força - "num crescimento constante e fundamentado em objetivos concretos nas áreas da informática e formação, que são, sem dúvida, a mais-valia da empresa"​, cujo lema é <strong>"compromissos de sucesso"​</strong> demonstra, aos seus clientes, e de uma forma inequívoca, que podem confiar em toda a equipa da empresa.</p><p>Desta maneira, é verdadeiramente assinalável o esforço e tempo despendidos na expansão, evolução e modernização da empresa, que, na maioria dos casos, se afigura extremamente custosa, pois, atualmente, vivemos em plena revolução digital e informática, o que faz com que haja algo de novo praticamente todos os dias.</p>', N'http://localhost:9833/api/uploads/tenant_1003/c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg', 1, N'publicado', 1, 1, 0, NULL, CAST(N'2025-10-29T13:04:21.2366667' AS DateTime2), CAST(N'2025-09-28T05:36:00.0000000' AS DateTime2), CAST(N'2025-10-30T12:36:00.0000000' AS DateTime2), N'Bem vindo à Microlopes', N'Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde 1986, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.', N'microlopes, web development, branding, erp, alojamento, design, ecommerce ', CAST(N'2025-10-29T12:39:25.5866667' AS DateTime2), CAST(N'2025-10-29T13:04:21.2366667' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (2, 16, 3, N'Bem vindo à Microlopes (Cópia)', N'bem-vindo-microlopes-2', N'Seja bem vindo ao nosso espaço digital Microlopes!', NULL, N'<h1 style="text-align: justify;"><strong>Sobre Nós</strong></h1><h3><strong>&nbsp;</strong></h3><p>Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde <strong>1986</strong>, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.</p><p>Porém, perante a quantidade de solicitações feitas pelos seus clientes, a Microgaia teve que alargar a sua área de funcionamento, criando outros departamentos, para além da formação de técnicos. Desta forma, o ano que marcou o início do milénio, assinalou também, o começo de uma nova fase na vida desta entidade patronal, mudando o nome de Microgaia para Microlopes.</p><p>Assim, a empresa apresenta, atualmente, um organigrama com secções distintas, desde a formação de pessoal especializado, mas também do departamento Clínica (no qual se faz montagens de computadores, servidores e bastidores, entre outros) e Consultoria. O departamento de Consultoria subdivide-se, entre outras, no sector de Sistemas de Informação Empresarial (onde se oferece uma gama de serviços como a informatização de empresas, na área da Gestão e ERP, Financeira, CRM, etc e, ainda, programas informáticos verticais próprios para clínicas, restaurantes, escolas, farmácias, entre muitos outros).</p><p>A empresa está empenhada com a sua nova política de expansão e divulgação dos respetivos serviços e produtos, apostando, em força - "num crescimento constante e fundamentado em objetivos concretos nas áreas da informática e formação, que são, sem dúvida, a mais-valia da empresa"​, cujo lema é <strong>"compromissos de sucesso"​</strong> demonstra, aos seus clientes, e de uma forma inequívoca, que podem confiar em toda a equipa da empresa.</p><p>Desta maneira, é verdadeiramente assinalável o esforço e tempo despendidos na expansão, evolução e modernização da empresa, que, na maioria dos casos, se afigura extremamente custosa, pois, atualmente, vivemos em plena revolução digital e informática, o que faz com que haja algo de novo praticamente todos os dias.</p>', N'http://localhost:9833/api/uploads/tenant_1003/c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg', 1, N'arquivado', 0, 1, 0, NULL, NULL, CAST(N'2025-09-28T06:36:00.0000000' AS DateTime2), CAST(N'2025-10-30T12:36:00.0000000' AS DateTime2), N'Bem vindo à Microlopes', N'Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde 1986, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.', N'microlopes, web development, branding, erp, alojamento, design, ecommerce ', CAST(N'2025-10-29T12:49:05.0800000' AS DateTime2), CAST(N'2025-10-29T12:55:48.1833333' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (3, 16, 3, N'Bem vindo à Microlopes (Cópia) (Cópia)', N'bem-vindo-microlopes-2-2', N'Seja bem vindo ao nosso espaço digital Microlopes!', NULL, N'<h1 style="text-align: justify;"><strong>Sobre Nós</strong></h1><h3><strong>&nbsp;</strong></h3><p>Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde <strong>1986</strong>, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.</p><p>Porém, perante a quantidade de solicitações feitas pelos seus clientes, a Microgaia teve que alargar a sua área de funcionamento, criando outros departamentos, para além da formação de técnicos. Desta forma, o ano que marcou o início do milénio, assinalou também, o começo de uma nova fase na vida desta entidade patronal, mudando o nome de Microgaia para Microlopes.</p><p>Assim, a empresa apresenta, atualmente, um organigrama com secções distintas, desde a formação de pessoal especializado, mas também do departamento Clínica (no qual se faz montagens de computadores, servidores e bastidores, entre outros) e Consultoria. O departamento de Consultoria subdivide-se, entre outras, no sector de Sistemas de Informação Empresarial (onde se oferece uma gama de serviços como a informatização de empresas, na área da Gestão e ERP, Financeira, CRM, etc e, ainda, programas informáticos verticais próprios para clínicas, restaurantes, escolas, farmácias, entre muitos outros).</p><p>A empresa está empenhada com a sua nova política de expansão e divulgação dos respetivos serviços e produtos, apostando, em força - "num crescimento constante e fundamentado em objetivos concretos nas áreas da informática e formação, que são, sem dúvida, a mais-valia da empresa"​, cujo lema é <strong>"compromissos de sucesso"​</strong> demonstra, aos seus clientes, e de uma forma inequívoca, que podem confiar em toda a equipa da empresa.</p><p>Desta maneira, é verdadeiramente assinalável o esforço e tempo despendidos na expansão, evolução e modernização da empresa, que, na maioria dos casos, se afigura extremamente custosa, pois, atualmente, vivemos em plena revolução digital e informática, o que faz com que haja algo de novo praticamente todos os dias.</p>', N'http://localhost:9833/api/uploads/tenant_1003/c2a5a9d7-3cc5-492e-bf79-a279ef02ab21_medium.jpg', 1, N'arquivado', 0, 1, 0, NULL, NULL, CAST(N'2025-09-28T06:36:00.0000000' AS DateTime2), CAST(N'2025-10-30T12:36:00.0000000' AS DateTime2), N'Bem vindo à Microlopes', N'Sedeada em Crestuma concelho de Vila Nova de Gaia, a Microlopes é a sucessora de outra empresa na área da informática, existente desde 1986, e já consagrada na cidade - a Microgaia - cuja especialidade era a formação de técnicos especializados.', N'microlopes, web development, branding, erp, alojamento, design, ecommerce ', CAST(N'2025-10-29T12:58:06.5933333' AS DateTime2), CAST(N'2025-10-31T15:52:10.3733333' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (4, 19, 13, N'Lar Evangélico - Apoio à Sociedade', N'lar-evangelico-apoio-sociedade', N'Remodelação Digital do Lar Evangélico Português', NULL, N'<p></p>', N'http://localhost:9833/api/uploads/tenant_1003/923daed1-3205-43e6-96e4-f114881c1f7c_medium.jpg', 1, N'publicado', 1, 1, 0, NULL, CAST(N'2025-10-30T23:25:44.1833333' AS DateTime2), CAST(N'2025-08-01T10:04:00.0000000' AS DateTime2), CAST(N'2025-11-01T13:04:00.0000000' AS DateTime2), N'Lar Evangélico Português', N'Remodelação Digital do Lar Evangélico Português', NULL, CAST(N'2025-10-29T13:04:43.7933333' AS DateTime2), CAST(N'2025-10-31T15:52:52.6000000' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, N'["en","es","pt-PT","fr","it","de"]')
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (5, 16, 11, N'Bem vindo à Comunidade Microlopes!', N'comunidade-microlopes', N'Comunidade Microlopes', N'A Comunidade Microlopes', N'<p>A comunidade Microlopes</p>', N'http://localhost:9833/api/uploads/tenant_1003/a76c37d3-34ba-433b-9906-6dbbac28014f_medium.jpg', 1, N'publicado', 1, 1, 0, NULL, CAST(N'2025-10-30T16:41:40.4233333' AS DateTime2), CAST(N'2025-10-14T14:41:00.0000000' AS DateTime2), CAST(N'2025-10-28T16:41:00.0000000' AS DateTime2), N'lsias', N'comunidade', NULL, CAST(N'2025-10-30T16:41:24.3433333' AS DateTime2), CAST(N'2025-10-31T15:52:07.9200000' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (6, 20, NULL, N'', N'', NULL, NULL, NULL, N'http://localhost:9833/api/uploads/tenant_1003/714d9b1b-7732-463a-92b5-aea357512f13_medium.jpg', 1, N'publicado', 0, 1, 0, NULL, CAST(N'2025-10-31T22:54:30.8466667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-31T22:54:21.2266667' AS DateTime2), CAST(N'2025-10-31T22:54:30.8466667' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade], [variants], [idiomas]) VALUES (7, 20, NULL, N'Microlopes CEO', N'microlopes-ceo', NULL, NULL, N'<p>Bem vindo ao Microlopes CEO!</p>', N'http://localhost:9833/api/uploads/tenant_1003/6d967095-7c10-45cf-b523-4b9f6ba4d73c_medium.jpg', 1, N'publicado', 0, 1, 0, NULL, CAST(N'2025-10-31T22:55:44.9166667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-31T22:55:44.2733333' AS DateTime2), CAST(N'2025-10-31T22:55:44.2733333' AS DateTime2), NULL, NULL, NULL, N'privada', NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[conteudos] OFF
GO
SET IDENTITY_INSERT [dbo].[conteudos_valores_personalizados] ON 
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (32, 5, N'interno', NULL, NULL, NULL, NULL, 1, NULL, CAST(N'2025-10-30T16:41:40.4600000' AS DateTime2), CAST(N'2025-10-30T16:41:40.4600000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (33, 4, N'cliente', N'Lar Evangélico Português', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2233333' AS DateTime2), CAST(N'2025-10-30T23:25:44.2233333' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (34, 4, N'industria', N'Apoio Social', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2333333' AS DateTime2), CAST(N'2025-10-30T23:25:44.2333333' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (35, 4, N'local', N'Maia', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2466667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2466667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (36, 4, N'caso_uso', N'Apoio a elementos carenciados', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2566667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2566667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (37, 4, N'desafio', N'O Lar Evangélico Português, uma instituição de apoio à população mais carenciada, com especial foco em jovens e idosos, necessitava de uma maior presença digital, para que os seus esforços de apoio à comunidade sejam conhecidos a nível nacional.', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2666667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2666667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (38, 4, N'solucao_desc', N'A solução iniciou-se pela remodelação do seu website:', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2766667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2766667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (39, 4, N'solucao_p1', N'Utilização de elementos apelativos', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2866667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2866667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (40, 4, N'solucao_p2', N'Descrição compreensível das suas missões', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.2966667' AS DateTime2), CAST(N'2025-10-30T23:25:44.2966667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (41, 4, N'solucao_p3', N'Acesso rápido a zonas de doação e contacto', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3100000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3100000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (42, 4, N'solucao_p4', N'Demonstração das suas causas e projetos', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3166667' AS DateTime2), CAST(N'2025-10-30T23:25:44.3166667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (43, 4, N'resultados_desc', N'Com este rebranding digital, o Lar Evangélico Português conseguiu expandir o seu alcance:', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3300000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3300000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (44, 4, N'resultados_p1', N'34% maior acolhimento de pessoas carenciadas', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3400000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3400000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (45, 4, N'resultados_p2', N'22% de aumento de doações', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3500000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3500000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (46, 4, N'resultados_p3', N'73% maior alcance entre comunidades locais', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3600000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3600000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (47, 4, N'resultados_p4', N'Reconhecimento a nível nacional', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T23:25:44.3700000' AS DateTime2), CAST(N'2025-10-30T23:25:44.3700000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[conteudos_valores_personalizados] OFF
GO
SET IDENTITY_INSERT [dbo].[empresas] ON 
GO
INSERT [dbo].[empresas] ([id], [codigo], [nome], [nif], [logo_url], [cor], [ativo], [criado_em], [atualizado_em], [nome_comercial], [nome_juridico], [tipo_empresa], [natureza_juridica], [capital_social], [num_matricula], [data_constituicao], [email], [telefone], [telemovel], [fax], [website], [morada_fiscal], [codigo_postal], [localidade], [distrito], [pais], [morada_correspondencia], [codigo_postal_correspondencia], [localidade_correspondencia], [num_cliente], [num_fornecedor], [segmento], [setor_atividade], [codigo_cae], [iban], [swift_bic], [banco], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [tags], [rating], [estado], [ref_externa], [id_phc], [sincronizado_phc], [ultima_sincronizacao], [criado_por], [atualizado_por]) VALUES (1, N'EMP001', N'Softon Solutions', N'509876540', N'https://cdn.example.com/logos/softon.png', N'#0078D7', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), N'Softon', N'Softon Solutions, Lda.', N'Lda', N'Sociedade por Quotas', CAST(50000.00 AS Decimal(15, 2)), N'Lisboa-12345', CAST(N'2015-04-22' AS Date), N'info@softon.pt', N'+351213456789', N'+351912345678', NULL, N'https://softon.pt', N'Av. da República, 45', N'1050-187', N'Lisboa', N'Lisboa', N'Portugal', N'Av. da República, 45', N'1050-187', N'Lisboa', N'CLI001', N'FOR001', N'Corporate', N'Tecnologia', N'62010', N'PT50003501234567890123000', N'CGDIPTPL', N'Caixa Geral de Depósitos', N'30 dias', N'Transferência Bancária', CAST(25000.00 AS Decimal(15, 2)), CAST(5.00 AS Decimal(5, 2)), N'João Martins', N'Gestor de TI', N'joao.martins@softon.pt', N'+351912345678', N'Empresa líder em soluções de software.', N'software,serviços', 5, N'Ativo', N'EXT001', N'PHC001', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), 1, 1)
GO
INSERT [dbo].[empresas] ([id], [codigo], [nome], [nif], [logo_url], [cor], [ativo], [criado_em], [atualizado_em], [nome_comercial], [nome_juridico], [tipo_empresa], [natureza_juridica], [capital_social], [num_matricula], [data_constituicao], [email], [telefone], [telemovel], [fax], [website], [morada_fiscal], [codigo_postal], [localidade], [distrito], [pais], [morada_correspondencia], [codigo_postal_correspondencia], [localidade_correspondencia], [num_cliente], [num_fornecedor], [segmento], [setor_atividade], [codigo_cae], [iban], [swift_bic], [banco], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [tags], [rating], [estado], [ref_externa], [id_phc], [sincronizado_phc], [ultima_sincronizacao], [criado_por], [atualizado_por]) VALUES (2, N'EMP002', N'Nautis Systems', N'509998877', N'https://cdn.example.com/logos/nautis.png', N'#00B294', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), N'Nautis', N'Nautis Systems, SA', N'SA', N'Sociedade Anónima', CAST(250000.00 AS Decimal(15, 2)), N'Porto-45897', CAST(N'2010-09-15' AS Date), N'contact@nautis.pt', N'+351220334455', N'+351913223344', NULL, N'https://nautis.pt', N'Rua do Heroísmo, 120', N'4300-278', N'Porto', N'Porto', N'Portugal', N'Rua do Heroísmo, 120', N'4300-278', N'Porto', N'CLI002', N'FOR002', N'Enterprise', N'Engenharia Naval', N'42910', N'PT50002700000012345678991', N'BESZPTPL', N'Novo Banco', N'60 dias', N'Cheque', CAST(50000.00 AS Decimal(15, 2)), CAST(3.00 AS Decimal(5, 2)), N'Maria Silva', N'Diretora Financeira', N'maria.silva@nautis.pt', N'+351913223344', N'Focada em soluções marítimas integradas.', N'marítimo,engenharia', 4, N'Ativo', N'EXT002', N'PHC002', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), 1, 1)
GO
INSERT [dbo].[empresas] ([id], [codigo], [nome], [nif], [logo_url], [cor], [ativo], [criado_em], [atualizado_em], [nome_comercial], [nome_juridico], [tipo_empresa], [natureza_juridica], [capital_social], [num_matricula], [data_constituicao], [email], [telefone], [telemovel], [fax], [website], [morada_fiscal], [codigo_postal], [localidade], [distrito], [pais], [morada_correspondencia], [codigo_postal_correspondencia], [localidade_correspondencia], [num_cliente], [num_fornecedor], [segmento], [setor_atividade], [codigo_cae], [iban], [swift_bic], [banco], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [tags], [rating], [estado], [ref_externa], [id_phc], [sincronizado_phc], [ultima_sincronizacao], [criado_por], [atualizado_por]) VALUES (3, N'EMP003', N'TechWave', N'507654321', N'https://cdn.example.com/logos/techwave.png', N'#FFB900', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), N'TechWave', N'TechWave Technologies, Lda.', N'Lda', N'Sociedade por Quotas', CAST(100000.00 AS Decimal(15, 2)), N'Braga-23451', CAST(N'2018-02-07' AS Date), N'info@techwave.pt', N'+351253445566', N'+351914445566', NULL, N'https://techwave.pt', N'Av. Liberdade, 250', N'4715-037', N'Braga', N'Braga', N'Portugal', N'Av. Liberdade, 250', N'4715-037', N'Braga', N'CLI003', N'FOR003', N'PME', N'Tecnologia', N'62020', N'PT50004500000034567890123', N'ACTVPTPL', N'ActivoBank', N'30 dias', N'Cartão de Crédito', CAST(15000.00 AS Decimal(15, 2)), CAST(2.50 AS Decimal(5, 2)), N'Rui Costa', N'Administrador', N'rui.costa@techwave.pt', N'+351914445566', N'Empresa jovem focada em desenvolvimento ágil.', N'software,web', 5, N'Ativo', N'EXT003', N'PHC003', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), 1, 1)
GO
INSERT [dbo].[empresas] ([id], [codigo], [nome], [nif], [logo_url], [cor], [ativo], [criado_em], [atualizado_em], [nome_comercial], [nome_juridico], [tipo_empresa], [natureza_juridica], [capital_social], [num_matricula], [data_constituicao], [email], [telefone], [telemovel], [fax], [website], [morada_fiscal], [codigo_postal], [localidade], [distrito], [pais], [morada_correspondencia], [codigo_postal_correspondencia], [localidade_correspondencia], [num_cliente], [num_fornecedor], [segmento], [setor_atividade], [codigo_cae], [iban], [swift_bic], [banco], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [tags], [rating], [estado], [ref_externa], [id_phc], [sincronizado_phc], [ultima_sincronizacao], [criado_por], [atualizado_por]) VALUES (4, N'EMP004', N'DataLogic', N'510223344', N'https://cdn.example.com/logos/datalogic.png', N'#8E8CD8', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), N'DataLogic', N'DataLogic Analytics, Lda.', N'Lda', N'Sociedade por Quotas', CAST(75000.00 AS Decimal(15, 2)), N'Faro-44512', CAST(N'2017-11-12' AS Date), N'geral@datalogic.pt', N'+351289778899', N'+351916778899', NULL, N'https://datalogic.pt', N'Rua das Oliveiras, 78', N'8000-473', N'Faro', N'Faro', N'Portugal', N'Rua das Oliveiras, 78', N'8000-473', N'Faro', N'CLI004', N'FOR004', N'Corporate', N'Análise de Dados', N'63110', N'PT50003600000056789012345', N'BARCPTPL', N'Barclays', N'45 dias', N'Transferência Bancária', CAST(30000.00 AS Decimal(15, 2)), CAST(4.00 AS Decimal(5, 2)), N'Carla Ferreira', N'Gestora Comercial', N'carla.ferreira@datalogic.pt', N'+351916778899', N'Consultoria especializada em data science.', N'dados,consultoria', 4, N'Ativo', N'EXT004', N'PHC004', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), 1, 1)
GO
INSERT [dbo].[empresas] ([id], [codigo], [nome], [nif], [logo_url], [cor], [ativo], [criado_em], [atualizado_em], [nome_comercial], [nome_juridico], [tipo_empresa], [natureza_juridica], [capital_social], [num_matricula], [data_constituicao], [email], [telefone], [telemovel], [fax], [website], [morada_fiscal], [codigo_postal], [localidade], [distrito], [pais], [morada_correspondencia], [codigo_postal_correspondencia], [localidade_correspondencia], [num_cliente], [num_fornecedor], [segmento], [setor_atividade], [codigo_cae], [iban], [swift_bic], [banco], [condicoes_pagamento], [metodo_pagamento_preferido], [limite_credito], [desconto_comercial], [pessoa_contacto], [cargo_contacto], [email_contacto], [telefone_contacto], [observacoes], [tags], [rating], [estado], [ref_externa], [id_phc], [sincronizado_phc], [ultima_sincronizacao], [criado_por], [atualizado_por]) VALUES (5, N'EMP005', N'CloudPrime', N'513334455', N'https://cdn.example.com/logos/cloudprime.png', N'#E74856', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), N'CloudPrime', N'CloudPrime Technologies, SA', N'SA', N'Sociedade Anónima', CAST(400000.00 AS Decimal(15, 2)), N'Coimbra-55661', CAST(N'2012-07-09' AS Date), N'hello@cloudprime.pt', N'+351239667788', N'+351917667788', NULL, N'https://cloudprime.pt', N'Rua Padre António Vieira, 90', N'3000-312', N'Coimbra', N'Coimbra', N'Portugal', N'Rua Padre António Vieira, 90', N'3000-312', N'Coimbra', N'CLI005', N'FOR005', N'Enterprise', N'Cloud & Infraestrutura', N'62090', N'PT50003000000078901234567', N'CGDIPTPL', N'Caixa Geral de Depósitos', N'60 dias', N'Transferência Bancária', CAST(60000.00 AS Decimal(15, 2)), CAST(3.50 AS Decimal(5, 2)), N'André Pinto', N'Diretor de Operações', N'andre.pinto@cloudprime.pt', N'+351917667788', N'Especialistas em soluções cloud escaláveis.', N'cloud,inovação', 5, N'Ativo', N'EXT005', N'PHC005', 1, CAST(N'2025-10-29T17:20:16.4133333' AS DateTime2), 1, 1)
GO
SET IDENTITY_INSERT [dbo].[empresas] OFF
GO
SET IDENTITY_INSERT [dbo].[enderecos] ON 
GO
INSERT [dbo].[enderecos] ([id], [funcionario_id], [tipo], [logradouro], [numero], [complemento], [bairro], [cidade], [estado], [codigo_postal], [pais], [principal], [criado_em], [atualizado_em]) VALUES (1, 1, N'Residencial', N'Rua do Cedro', N'248', NULL, NULL, N'Canelas', N'Porto', N'4324-233', N'Portugal', 1, CAST(N'2025-10-29T13:22:26.4133333' AS DateTime2), CAST(N'2025-10-29T13:22:26.4133333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[enderecos] OFF
GO
SET IDENTITY_INSERT [dbo].[equipamentos] ON 
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (19, NULL, 1, N'SN-TPR-CMP-001-001', N'INT-001', N'Workstation para desenvolvimento de software.', N'Escritório 1 - TI', 1, NULL, N'Operacional', CAST(N'2024-03-10' AS Date), CAST(1899.99 AS Decimal(18, 2)), N'TechPro Distribuição SA', CAST(N'2027-03-10' AS Date), CAST(N'2026-03-10' AS Date), N'Equipamento principal de desenvolvimento.', N'http://localhost:9833/api/uploads/tenant_1003/75ad9d1d-83df-441e-89ba-0247b02234b7_medium.jpg', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-31T23:43:21.6900000' AS DateTime2), N'EQP-001', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (20, NULL, 2, N'SN-IVT-PRT-002-003', N'INT-002', N'Portátil para trabalho remoto.', N'Home Office - David Vieira', 1, 3, N'Operacional', CAST(N'2024-06-15' AS Date), CAST(1399.00 AS Decimal(18, 2)), N'InovaTech Lda', CAST(N'2026-06-15' AS Date), CAST(N'2025-12-15' AS Date), N'Bom estado, bateria substituída recentemente.', N'https://cdn.example.com/equipamentos/flexbook14.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-002', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (21, NULL, 3, N'SN-PED-SRV-003-009', N'INT-003', N'Servidor principal de virtualização.', N'Data Center - Rack 2', NULL, NULL, N'Operacional', CAST(N'2023-11-20' AS Date), CAST(4999.00 AS Decimal(18, 2)), N'PowerEdge Portugal', CAST(N'2028-11-20' AS Date), CAST(N'2026-11-20' AS Date), N'Monitorizar temperatura e consumo.', N'https://cdn.example.com/equipamentos/server-r540.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-003', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (22, NULL, 4, N'SN-BWV-MON-004-012', N'INT-004', N'Monitor de alta resolução para design gráfico.', N'Escritório 1 - Design', 1, 3, N'Operacional', CAST(N'2024-02-05' AS Date), CAST(299.90 AS Decimal(18, 2)), N'BlueWave Distribuição', CAST(N'2026-02-05' AS Date), CAST(N'2026-05-05' AS Date), N'Excelente calibração de cores.', N'https://cdn.example.com/equipamentos/display27q.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-004', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (23, NULL, 5, N'SN-SLK-IMP-005-015', N'INT-005', N'Impressora multifunções de escritório.', N'Secretaria Principal', 1, 3, N'Em Manutenção', CAST(N'2024-04-10' AS Date), CAST(249.99 AS Decimal(18, 2)), N'SmartLink Solutions', CAST(N'2026-04-10' AS Date), CAST(N'2025-10-10' AS Date), N'Requer toner modelo T4500.', N'https://cdn.example.com/equipamentos/printjet4500.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-005', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (24, NULL, 6, N'SN-SLK-SCN-006-018', N'INT-006', N'Scanner de documentos para digitalização de contratos.', N'Secretaria Principal', NULL, NULL, N'Operacional', CAST(N'2024-04-10' AS Date), CAST(129.99 AS Decimal(18, 2)), N'SmartLink Solutions', CAST(N'2026-04-10' AS Date), CAST(N'2026-01-15' AS Date), N'Usado semanalmente.', N'https://cdn.example.com/equipamentos/scanmate220.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-006', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (25, NULL, 7, N'SN-CNV-RT-007-020', N'INT-007', N'Router principal de rede Wi-Fi 6.', N'Sala de Servidores', NULL, NULL, N'Operacional', CAST(N'2024-01-10' AS Date), CAST(229.90 AS Decimal(18, 2)), N'CloudNova', CAST(N'2026-01-10' AS Date), CAST(N'2025-12-10' AS Date), N'Firmware atualizado em 2025-06.', N'https://cdn.example.com/equipamentos/router-ax6000.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-007', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (26, NULL, 8, N'SN-CNV-SW-008-025', N'INT-008', N'Switch PoE para dispositivos de rede e câmaras.', N'Armário Técnico 1', NULL, NULL, N'Operacional', CAST(N'2023-10-01' AS Date), CAST(349.00 AS Decimal(18, 2)), N'CloudNova', CAST(N'2026-10-01' AS Date), CAST(N'2025-11-01' AS Date), N'Usado com 60% de carga PoE.', N'https://cdn.example.com/equipamentos/switch24gpro.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-008', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (27, NULL, 9, N'SN-BWV-CAM-009-030', N'INT-009', N'Câmara IP exterior para vigilância.', N'Entrada Principal', NULL, NULL, N'Operacional', CAST(N'2024-05-22' AS Date), CAST(179.00 AS Decimal(18, 2)), N'BlueWave Security', CAST(N'2026-05-22' AS Date), CAST(N'2026-05-01' AS Date), N'Boa qualidade noturna.', N'https://cdn.example.com/equipamentos/camguard360.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-009', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (28, NULL, 10, N'SN-BWV-ALM-010-034', N'INT-010', N'Central de alarme e sensores sem fios.', N'Sala de Segurança', NULL, NULL, N'Operacional', CAST(N'2024-02-10' AS Date), CAST(299.00 AS Decimal(18, 2)), N'BlueWave Security', CAST(N'2026-02-10' AS Date), CAST(N'2026-02-01' AS Date), N'Testar bateria trimestralmente.', N'https://cdn.example.com/equipamentos/securealarmx1.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-010', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (29, NULL, 11, N'SN-IVT-ACC-011-039', N'INT-011', N'Terminal biométrico de acesso.', N'Entrada Principal', NULL, NULL, N'Operacional', CAST(N'2024-03-05' AS Date), CAST(599.00 AS Decimal(18, 2)), N'InovaTech Systems', CAST(N'2026-03-05' AS Date), CAST(N'2026-04-05' AS Date), N'Configuração facial e RFID ativa.', N'https://cdn.example.com/equipamentos/bioaccess500.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-011', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (30, NULL, 12, N'SN-PED-TEL-012-042', N'INT-012', N'Telefone VoIP da receção.', N'Secretaria Principal', 1, 3, N'Operacional', CAST(N'2023-12-01' AS Date), CAST(89.90 AS Decimal(18, 2)), N'PowerEdge Portugal', CAST(N'2026-12-01' AS Date), CAST(N'2025-12-01' AS Date), N'Em perfeito estado.', N'https://cdn.example.com/equipamentos/voip210.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-012', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (31, NULL, 13, N'SN-SLK-PRJ-013-045', N'INT-013', N'Projetor multimédia para reuniões.', N'Sala de Reuniões 2', NULL, NULL, N'Em Manutenção', CAST(N'2024-01-15' AS Date), CAST(499.00 AS Decimal(18, 2)), N'SmartLink Lda', CAST(N'2026-01-15' AS Date), CAST(N'2025-11-15' AS Date), N'Lâmpada substituída em 2025-06.', N'https://cdn.example.com/equipamentos/visionpro3000.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-013', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (32, NULL, 14, N'SN-TPR-CMP-014-050', N'INT-014', N'SSD NVMe usado em servidor principal.', N'Data Center - Rack 2', NULL, NULL, N'Operacional', CAST(N'2024-06-01' AS Date), CAST(119.00 AS Decimal(18, 2)), N'TechPro Distribuição SA', CAST(N'2027-06-01' AS Date), CAST(N'2026-06-01' AS Date), N'Montado em RAID 10.', N'https://cdn.example.com/equipamentos/ssd-nvx1tb.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-014', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (33, NULL, 15, N'SN-IVT-PRF-015-055', N'INT-015', N'Rato ergonómico sem fios.', N'Escritório 1 - TI', 1, 3, N'Operacional', CAST(N'2024-08-10' AS Date), CAST(39.99 AS Decimal(18, 2)), N'InovaTech Lda', CAST(N'2026-08-10' AS Date), NULL, N'Sem sinais de desgaste.', N'https://cdn.example.com/equipamentos/ergomousem50.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-015', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (34, NULL, 16, N'SN-CNV-ARM-016-060', N'INT-016', N'Servidor NAS para backups automáticos.', N'Data Center - Rack 3', NULL, NULL, N'Operacional', CAST(N'2024-02-22' AS Date), CAST(899.00 AS Decimal(18, 2)), N'CloudNova', CAST(N'2027-02-22' AS Date), CAST(N'2026-02-01' AS Date), N'RAID 5 configurado.', N'https://cdn.example.com/equipamentos/nas4baypro.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-016', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (35, NULL, 17, N'SN-BWV-SFW-017-065', N'INT-017', N'Licença de sistema operativo SecureOS 12.', N'Servidor Virtual', NULL, NULL, N'Inativo', CAST(N'2024-05-01' AS Date), CAST(249.00 AS Decimal(18, 2)), N'BlueWave Software', CAST(N'2029-05-01' AS Date), NULL, N'Licença perpétua empresarial.', N'https://cdn.example.com/equipamentos/secureos12.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-017', N'QRCode')
GO
INSERT [dbo].[equipamentos] ([id], [empresa_id], [modelo_id], [numero_serie], [numero_interno], [descricao], [localizacao], [responsavel_id], [utilizador_id], [estado], [data_aquisicao], [valor_aquisicao], [fornecedor], [data_garantia], [data_proxima_manutencao], [observacoes], [foto_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (36, NULL, 18, N'SN-PED-UPS-018-070', N'INT-018', N'UPS de 1500VA para servidores e switches.', N'Data Center - Rack 1', NULL, NULL, N'Operacional', CAST(N'2024-03-10' AS Date), CAST(329.00 AS Decimal(18, 2)), N'PowerEdge Portugal', CAST(N'2027-03-10' AS Date), CAST(N'2026-03-01' AS Date), N'Verificar baterias anualmente.', N'https://cdn.example.com/equipamentos/ups1500va.png', 1, CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:40:00.0000000' AS DateTime2), N'EQP-018', N'QRCode')
GO
SET IDENTITY_INSERT [dbo].[equipamentos] OFF
GO
SET IDENTITY_INSERT [dbo].[formacoes] ON 
GO
INSERT [dbo].[formacoes] ([id], [titulo], [descricao], [categoria], [nivel], [duracao_minutos], [autor_id], [publicado], [ativo], [criado_em], [atualizado_em], [capa_url]) VALUES (1, N'PHC CS ENTERPRISE  - PT ', N'Curso de Introdução ao PHC ', N'Tutoriais', N'Intermédio', NULL, 1, 1, 1, CAST(N'2025-10-29T17:15:55.867' AS DateTime), CAST(N'2025-10-29T17:48:43.920' AS DateTime), N'https://sigmacode.pt/wp-content/uploads/2023/09/phc-cs-enterprise-software-de-gestao-para-medias-e-grandes-empresas-sigma-code-software-phc-1.jpg')
GO
SET IDENTITY_INSERT [dbo].[formacoes] OFF
GO
SET IDENTITY_INSERT [dbo].[formacoes_clientes] ON 
GO
INSERT [dbo].[formacoes_clientes] ([id], [formacao_id], [cliente_id], [data_inscricao], [progresso], [horas_estudo], [nota_final], [certificado_url], [data_conclusao], [ativo], [criado_em], [atualizado_em]) VALUES (1, 1, 15, CAST(N'2025-10-29T18:05:47.987' AS DateTime), CAST(0.00 AS Decimal(5, 2)), CAST(0.00 AS Decimal(6, 2)), NULL, NULL, NULL, 1, CAST(N'2025-10-29T18:05:47.987' AS DateTime), NULL)
GO
INSERT [dbo].[formacoes_clientes] ([id], [formacao_id], [cliente_id], [data_inscricao], [progresso], [horas_estudo], [nota_final], [certificado_url], [data_conclusao], [ativo], [criado_em], [atualizado_em]) VALUES (2, 1, 18, CAST(N'2025-10-29T18:05:48.043' AS DateTime), CAST(0.00 AS Decimal(5, 2)), CAST(0.00 AS Decimal(6, 2)), NULL, NULL, NULL, 1, CAST(N'2025-10-29T18:05:48.043' AS DateTime), NULL)
GO
INSERT [dbo].[formacoes_clientes] ([id], [formacao_id], [cliente_id], [data_inscricao], [progresso], [horas_estudo], [nota_final], [certificado_url], [data_conclusao], [ativo], [criado_em], [atualizado_em]) VALUES (3, 1, 17, CAST(N'2025-10-29T18:05:48.100' AS DateTime), CAST(0.00 AS Decimal(5, 2)), CAST(0.00 AS Decimal(6, 2)), NULL, NULL, NULL, 1, CAST(N'2025-10-29T18:05:48.100' AS DateTime), NULL)
GO
INSERT [dbo].[formacoes_clientes] ([id], [formacao_id], [cliente_id], [data_inscricao], [progresso], [horas_estudo], [nota_final], [certificado_url], [data_conclusao], [ativo], [criado_em], [atualizado_em]) VALUES (4, 1, 12, CAST(N'2025-10-29T18:05:48.157' AS DateTime), CAST(0.00 AS Decimal(5, 2)), CAST(0.00 AS Decimal(6, 2)), NULL, NULL, NULL, 1, CAST(N'2025-10-29T18:05:48.157' AS DateTime), NULL)
GO
INSERT [dbo].[formacoes_clientes] ([id], [formacao_id], [cliente_id], [data_inscricao], [progresso], [horas_estudo], [nota_final], [certificado_url], [data_conclusao], [ativo], [criado_em], [atualizado_em]) VALUES (5, 1, 11, CAST(N'2025-10-29T18:05:48.210' AS DateTime), CAST(0.00 AS Decimal(5, 2)), CAST(0.00 AS Decimal(6, 2)), NULL, NULL, NULL, 1, CAST(N'2025-10-29T18:05:48.210' AS DateTime), NULL)
GO
SET IDENTITY_INSERT [dbo].[formacoes_clientes] OFF
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz] ON 
GO
INSERT [dbo].[formacoes_quiz] ([id], [formacao_id], [titulo], [descricao], [tempo_limite_minutos], [nota_minima_aprovacao], [mostrar_resultados], [permitir_tentativas_multiplas], [max_tentativas], [ativo], [criado_em], [atualizado_em]) VALUES (1, 1, N'Teste Final Módulo 1', NULL, NULL, 70, 1, 1, 3, 1, CAST(N'2025-10-29T17:44:14.580' AS DateTime), CAST(N'2025-10-29T17:44:14.580' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz] OFF
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz_opcoes] ON 
GO
INSERT [dbo].[formacoes_quiz_opcoes] ([id], [pergunta_id], [texto], [correta], [ordem]) VALUES (1, 1, N'Ferramenta de gestão', 1, 1)
GO
INSERT [dbo].[formacoes_quiz_opcoes] ([id], [pergunta_id], [texto], [correta], [ordem]) VALUES (2, 1, N'Ferramenta de marketing', 0, 2)
GO
INSERT [dbo].[formacoes_quiz_opcoes] ([id], [pergunta_id], [texto], [correta], [ordem]) VALUES (3, 1, N'Rede Social', 0, 3)
GO
INSERT [dbo].[formacoes_quiz_opcoes] ([id], [pergunta_id], [texto], [correta], [ordem]) VALUES (4, 1, N'Plataforma de comunicação', 0, 4)
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz_opcoes] OFF
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz_perguntas] ON 
GO
INSERT [dbo].[formacoes_quiz_perguntas] ([id], [quiz_id], [tipo], [enunciado], [pontuacao], [ordem], [criado_em], [atualizado_em]) VALUES (1, 1, N'multipla', N'O que é o phc?', 3, 1, CAST(N'2025-10-29T18:04:22.610' AS DateTime), CAST(N'2025-10-29T18:04:22.610' AS DateTime))
GO
INSERT [dbo].[formacoes_quiz_perguntas] ([id], [quiz_id], [tipo], [enunciado], [pontuacao], [ordem], [criado_em], [atualizado_em]) VALUES (2, 1, N'aberta', N'Quem comprou o PHC?', 5, 2, CAST(N'2025-10-29T18:05:00.997' AS DateTime), CAST(N'2025-10-29T18:05:00.997' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[formacoes_quiz_perguntas] OFF
GO
SET IDENTITY_INSERT [dbo].[funcionarios] ON 
GO
INSERT [dbo].[funcionarios] ([id], [numero], [tipo_funcionario_id], [nome_completo], [nome_abreviado], [sexo], [data_nascimento], [naturalidade], [nacionalidade], [estado_civil], [foto_url], [observacoes], [ativo], [criado_em], [atualizado_em], [empresa_id]) VALUES (1, 10, 1, N'David Vieira', N'David', N'M', CAST(N'2025-07-28' AS Date), N'Vila Nova de Gaia', N'Portugal', N'União de Facto', N'http://localhost:9833/api/uploads/tenant_1003/ed550e45-6879-40ef-8756-d0a692abbbe5_medium.jpg', N'Desenvolvedor', 1, CAST(N'2025-10-29T13:13:57.0200000' AS DateTime2), CAST(N'2025-10-29T15:48:15.1033333' AS DateTime2), NULL)
GO
SET IDENTITY_INSERT [dbo].[funcionarios] OFF
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 43, CAST(N'2025-10-31T17:43:38.4800000' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 44, CAST(N'2025-10-31T17:43:38.5200000' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 45, CAST(N'2025-10-31T17:43:38.5500000' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 46, CAST(N'2025-10-31T17:43:38.5033333' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 47, CAST(N'2025-10-31T17:43:38.5333333' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 48, CAST(N'2025-10-31T17:43:38.3666667' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 49, CAST(N'2025-10-31T17:43:38.4100000' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 50, CAST(N'2025-10-31T17:43:38.4666667' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 51, CAST(N'2025-10-31T17:43:38.3800000' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 52, CAST(N'2025-10-31T17:43:38.3366667' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 53, CAST(N'2025-10-31T17:43:38.4466667' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 54, CAST(N'2025-10-31T17:43:38.3533333' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 55, CAST(N'2025-10-31T17:43:38.4266667' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 56, CAST(N'2025-10-31T17:43:38.3233333' AS DateTime2))
GO
INSERT [dbo].[grupo_permissao] ([grupo_id], [permissao_id], [criado_em]) VALUES (1, 57, CAST(N'2025-10-31T17:43:38.3966667' AS DateTime2))
GO
INSERT [dbo].[grupo_utilizador] ([grupo_id], [utilizador_id], [criado_em]) VALUES (1, 2, CAST(N'2025-10-31T17:42:55.0900000' AS DateTime2))
GO
INSERT [dbo].[grupo_utilizador] ([grupo_id], [utilizador_id], [criado_em]) VALUES (1, 11, CAST(N'2025-10-31T17:42:55.0766667' AS DateTime2))
GO
INSERT [dbo].[grupo_utilizador] ([grupo_id], [utilizador_id], [criado_em]) VALUES (1, 16, CAST(N'2025-10-31T18:14:20.2200000' AS DateTime2))
GO
INSERT [dbo].[grupo_utilizador] ([grupo_id], [utilizador_id], [criado_em]) VALUES (1, 19, CAST(N'2025-11-01T00:08:07.5366667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[grupos] ON 
GO
INSERT [dbo].[grupos] ([id], [nome], [descricao], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'PROFESSOR', N'professores da escoler

', 0, CAST(N'2025-10-31T15:15:55.7766667' AS DateTime2), CAST(N'2025-10-31T15:16:39.9800000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[grupos] OFF
GO
SET IDENTITY_INSERT [dbo].[intervencoes] ON 
GO
INSERT [dbo].[intervencoes] ([id], [ticket_id], [equipamento_id], [tipo], [numero_intervencao], [titulo], [descricao], [diagnostico], [solucao], [tecnico_id], [data_inicio], [data_fim], [duracao_minutos], [custo_mao_obra], [custo_pecas], [custo_total], [fornecedor_externo], [numero_fatura], [garantia], [observacoes], [status], [criado_em], [atualizado_em], [anexo_url], [cliente_id], [precisa_aprovacao_cliente], [aprovacao_cliente], [data_aprovacao], [equipamento_sn], [equipamento_descritivo]) VALUES (2, 5, NULL, N'corretiva', N'INT000001', N'safsfafas', NULL, NULL, NULL, 1, CAST(N'2025-10-13T15:12:00.0000000' AS DateTime2), NULL, NULL, CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(110.00 AS Decimal(18, 2)), NULL, NULL, 0, NULL, N'em_progresso', CAST(N'2025-10-30T16:13:00.4366667' AS DateTime2), CAST(N'2025-10-30T16:13:00.4366667' AS DateTime2), NULL, NULL, 0, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[intervencoes] ([id], [ticket_id], [equipamento_id], [tipo], [numero_intervencao], [titulo], [descricao], [diagnostico], [solucao], [tecnico_id], [data_inicio], [data_fim], [duracao_minutos], [custo_mao_obra], [custo_pecas], [custo_total], [fornecedor_externo], [numero_fatura], [garantia], [observacoes], [status], [criado_em], [atualizado_em], [anexo_url], [cliente_id], [precisa_aprovacao_cliente], [aprovacao_cliente], [data_aprovacao], [equipamento_sn], [equipamento_descritivo]) VALUES (3, 5, NULL, N'corretiva', N'INT000002', N'z<cz<c<z', NULL, NULL, NULL, 1, CAST(N'2025-10-31T00:07:00.0000000' AS DateTime2), NULL, NULL, CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), NULL, NULL, 0, NULL, N'agendada', CAST(N'2025-10-31T00:08:28.1533333' AS DateTime2), CAST(N'2025-10-31T00:08:28.1533333' AS DateTime2), NULL, NULL, 0, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[intervencoes] ([id], [ticket_id], [equipamento_id], [tipo], [numero_intervencao], [titulo], [descricao], [diagnostico], [solucao], [tecnico_id], [data_inicio], [data_fim], [duracao_minutos], [custo_mao_obra], [custo_pecas], [custo_total], [fornecedor_externo], [numero_fatura], [garantia], [observacoes], [status], [criado_em], [atualizado_em], [anexo_url], [cliente_id], [precisa_aprovacao_cliente], [aprovacao_cliente], [data_aprovacao], [equipamento_sn], [equipamento_descritivo]) VALUES (4, 5, NULL, N'corretiva', N'INT000003', N'z<cz<c<z', NULL, NULL, NULL, 1, CAST(N'2025-10-31T00:07:00.0000000' AS DateTime2), NULL, NULL, CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), NULL, NULL, 0, NULL, N'agendada', CAST(N'2025-10-31T00:10:10.9000000' AS DateTime2), CAST(N'2025-10-31T00:10:10.9000000' AS DateTime2), NULL, NULL, 0, 0, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[intervencoes] OFF
GO
SET IDENTITY_INSERT [dbo].[intervencoes_anexos] ON 
GO
INSERT [dbo].[intervencoes_anexos] ([id], [intervencao_id], [anexo_id], [tipo_documento], [descricao], [criado_em]) VALUES (1, 4, 12, NULL, NULL, CAST(N'2025-10-31T00:10:10.9266667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[intervencoes_anexos] OFF
GO
SET IDENTITY_INSERT [dbo].[intervencoes_custos] ON 
GO
INSERT [dbo].[intervencoes_custos] ([id], [intervencao_id], [descricao], [codigo], [quantidade], [valor_unitario], [valor_total], [criado_em], [anexo_url], [fornecedor_id]) VALUES (0, 2, N'1242142', N'Portugal', 1, CAST(110.00 AS Decimal(18, 2)), CAST(110.00 AS Decimal(18, 2)), CAST(N'2025-10-30T16:15:09.2933333' AS DateTime2), NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[intervencoes_custos] OFF
GO
SET IDENTITY_INSERT [dbo].[m_formacoes] ON 
GO
INSERT [dbo].[m_formacoes] ([id], [titulo], [descricao], [categoria], [nivel], [duracao_total], [ativo], [criado_por], [criado_em], [atualizado_em], [formacao_id], [capa_url]) VALUES (1, N'Módulo 1 - Introdução ao PHC', N'O que é o phc?', N'Tutoriais', N'Iniciante', NULL, 1, 1, CAST(N'2025-10-29T17:21:47.337' AS DateTime), CAST(N'2025-10-29T17:21:47.337' AS DateTime), 1, NULL)
GO
INSERT [dbo].[m_formacoes] ([id], [titulo], [descricao], [categoria], [nivel], [duracao_total], [ativo], [criado_por], [criado_em], [atualizado_em], [formacao_id], [capa_url]) VALUES (2, N'Módulo 2 - Módulos e Funcionalidades PHC', NULL, N'Documentos', N'Iniciante', NULL, 1, 1, CAST(N'2025-10-29T17:55:25.713' AS DateTime), CAST(N'2025-10-29T17:55:25.713' AS DateTime), 1, NULL)
GO
SET IDENTITY_INSERT [dbo].[m_formacoes] OFF
GO
SET IDENTITY_INSERT [dbo].[marcas] ON 
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (1, N'TechPro', N'https://cdn.example.com/logos/techpro.png', N'https://www.techpro.pt', 1, CAST(N'2025-10-29T18:37:22.6633333' AS DateTime2), CAST(N'2025-10-29T18:37:22.6633333' AS DateTime2), N'TPR-001', N'QRCode', N'suporte@techpro.pt', N'+351912345678', N'https://www.techpro.pt/suporte')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (2, N'InovaTech', N'https://cdn.example.com/logos/inovatech.png', N'https://www.inovatech.pt', 1, CAST(N'2025-10-29T18:40:12.1122333' AS DateTime2), CAST(N'2025-10-29T18:40:12.1122333' AS DateTime2), N'IVT-002', N'QRCode', N'suporte@inovatech.pt', N'+351913456789', N'https://www.inovatech.pt/suporte')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (3, N'BlueWave', N'https://cdn.example.com/logos/bluewave.png', N'https://www.bluewave.pt', 1, CAST(N'2025-10-29T18:41:55.4455666' AS DateTime2), CAST(N'2025-10-29T18:41:55.4455666' AS DateTime2), N'BWV-003', N'QRCode', N'ajuda@bluewave.pt', N'+351914567890', N'https://www.bluewave.pt/suporte')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (4, N'SmartLink', N'https://cdn.example.com/logos/smartlink.png', N'https://www.smartlink.pt', 1, CAST(N'2025-10-29T18:43:21.7788999' AS DateTime2), CAST(N'2025-10-29T18:43:21.7788999' AS DateTime2), N'SLK-004', N'QRCode', N'suporte@smartlink.pt', N'+351915678901', N'https://www.smartlink.pt/suporte')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (5, N'DataFusion', N'https://cdn.example.com/logos/datafusion.png', N'https://www.datafusion.pt', 1, CAST(N'2025-10-29T18:44:30.5566777' AS DateTime2), CAST(N'2025-10-29T18:44:30.5566777' AS DateTime2), N'DFS-005', N'QRCode', N'help@datafusion.pt', N'+351916789012', N'https://www.datafusion.pt/ajuda')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (6, N'NextGen', N'https://cdn.example.com/logos/nextgen.png', N'https://www.nextgen.pt', 1, CAST(N'2025-10-29T18:45:42.3344555' AS DateTime2), CAST(N'2025-10-29T18:45:42.3344555' AS DateTime2), N'NGN-006', N'QRCode', N'suporte@nextgen.pt', N'+351917890123', N'https://www.nextgen.pt/suporte')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (7, N'PowerEdge', N'https://cdn.example.com/logos/poweredge.png', N'https://www.poweredge.pt', 1, CAST(N'2025-10-29T18:46:58.9988777' AS DateTime2), CAST(N'2025-10-29T18:46:58.9988777' AS DateTime2), N'PED-007', N'QRCode', N'apoio@poweredge.pt', N'+351918901234', N'https://www.poweredge.pt/apoio')
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura], [email_suporte], [telefone_suporte], [link_suporte]) VALUES (8, N'CloudNova', N'https://cdn.example.com/logos/cloudnova.png', N'https://www.cloudnova.pt', 1, CAST(N'2025-10-29T18:48:11.2211333' AS DateTime2), CAST(N'2025-10-29T18:48:11.2211333' AS DateTime2), N'CNV-008', N'QRCode', N'suporte@cloudnova.pt', N'+351919012345', N'https://www.cloudnova.pt/suporte')
GO
SET IDENTITY_INSERT [dbo].[marcas] OFF
GO
SET IDENTITY_INSERT [dbo].[modelos_equipamento] ON 
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (1, 1, 1, N'TechPro Workstation X200', N'TPR-CMP-001', N'Computador desktop de alto desempenho para tarefas profissionais exigentes.', N'Intel i9, 32GB RAM, SSD 1TB, Windows 11 Pro', N'https://cdn.example.com/equipamentos/workstation-x200.png', N'https://www.techpro.pt/manuals/workstation-x200.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'TPR-CMP-001', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (2, 2, 2, N'InovaTech FlexBook 14', N'IVT-PRT-002', N'Portátil ultrafino com ecrã dobrável e bateria de longa duração.', N'Intel i7, 16GB RAM, SSD 512GB, 14" FHD Touch', N'https://cdn.example.com/equipamentos/flexbook14.png', N'https://www.inovatech.pt/manuals/flexbook14.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'IVT-PRT-002', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (3, 5, 3, N'PowerEdge Server R540', N'PED-SRV-003', N'Servidor rack para aplicações empresariais e virtualização.', N'Xeon Silver, 64GB ECC RAM, RAID 10, 8x HDD 2TB', N'https://cdn.example.com/equipamentos/server-r540.png', N'https://www.poweredge.pt/manuals/r540.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'PED-SRV-003', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (4, 3, 4, N'BlueWave Display 27Q', N'BWV-MON-004', N'Monitor QHD de 27 polegadas com tecnologia IPS e suporte ajustável.', N'2560x1440, 75Hz, HDMI/DP, suporte ergonómico', N'https://cdn.example.com/equipamentos/display27q.png', N'https://www.bluewave.pt/manuals/display27q.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'BWV-MON-004', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (5, 4, 5, N'SmartLink PrintJet 4500', N'SLK-IMP-005', N'Impressora multifunções a jato de tinta com conectividade Wi-Fi.', N'Impressão frente e verso, scanner integrado, Wi-Fi Direct', N'https://cdn.example.com/equipamentos/printjet4500.png', N'https://www.smartlink.pt/manuals/printjet4500.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'SLK-IMP-005', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (6, 4, 6, N'SmartLink ScanMate 220', N'SLK-SCN-006', N'Scanner rápido e compacto para documentos A4.', N'600dpi, USB 3.0, OCR integrado', N'https://cdn.example.com/equipamentos/scanmate220.png', N'https://www.smartlink.pt/manuals/scanmate220.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'SLK-SCN-006', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (7, 6, 8, N'CloudNova Router AX6000', N'CNV-RT-007', N'Router Wi-Fi 6 de alto desempenho com gestão na cloud.', N'Dual-band AX6000, 4xLAN Gigabit, WPA3, App móvel', N'https://cdn.example.com/equipamentos/router-ax6000.png', N'https://www.cloudnova.pt/manuals/router-ax6000.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'CNV-RT-007', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (8, 6, 9, N'CloudNova Switch 24G Pro', N'CNV-SW-008', N'Switch de 24 portas Gigabit com suporte a VLAN e PoE.', N'24x RJ45 Gigabit, 4x SFP, VLAN, PoE 370W', N'https://cdn.example.com/equipamentos/switch24gpro.png', N'https://www.cloudnova.pt/manuals/switch24gpro.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'CNV-SW-008', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (9, 3, 10, N'BlueWave CamGuard IP360', N'BWV-CAM-009', N'Câmara IP de vigilância com visão noturna e gravação na nuvem.', N'1080p, IR 30m, deteção de movimento, microSD', N'https://cdn.example.com/equipamentos/camguard360.png', N'https://www.bluewave.pt/manuals/camguard360.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'BWV-CAM-009', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (10, 3, 11, N'BlueWave SecureAlarm X1', N'BWV-ALM-010', N'Sistema de alarme sem fios com sensores de movimento e app móvel.', N'Central GSM/Wi-Fi, 5 sensores, sirene 110dB', N'https://cdn.example.com/equipamentos/securealarmx1.png', N'https://www.bluewave.pt/manuals/securealarmx1.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'BWV-ALM-010', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (11, 2, 12, N'InovaTech BioAccess 500', N'IVT-ACC-011', N'Terminal biométrico com reconhecimento facial e RFID.', N'Reconhecimento facial, RFID, TCP/IP, software incluído', N'https://cdn.example.com/equipamentos/bioaccess500.png', N'https://www.inovatech.pt/manuals/bioaccess500.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'IVT-ACC-011', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (12, 5, 13, N'PowerEdge VoIP 210', N'PED-TEL-012', N'Telefone IP com suporte a PoE e ecrã LCD.', N'2 linhas SIP, PoE, HD Voice, suporte mural', N'https://cdn.example.com/equipamentos/voip210.png', N'https://www.poweredge.pt/manuals/voip210.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'PED-TEL-012', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (13, 4, 14, N'SmartLink VisionPro 3000', N'SLK-PRJ-013', N'Projetor Full HD para apresentações e uso multimédia.', N'3000 lumens, HDMI/VGA, correção keystone', N'https://cdn.example.com/equipamentos/visionpro3000.png', N'https://www.smartlink.pt/manuals/visionpro3000.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'SLK-PRJ-013', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (14, 1, 16, N'TechPro SSD NVX 1TB', N'TPR-CMP-014', N'Unidade SSD NVMe PCIe 1TB para alto desempenho.', N'Leitura 3500MB/s, Gravação 3200MB/s, NVMe 1.4', N'https://cdn.example.com/equipamentos/ssd-nvx1tb.png', N'https://www.techpro.pt/manuals/ssd-nvx1tb.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'TPR-CMP-014', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (15, 2, 17, N'InovaTech ErgoMouse M50', N'IVT-PRF-015', N'Rato ergonómico sem fios com sensor de alta precisão.', N'Sensor óptico 3200DPI, recarregável via USB-C', N'https://cdn.example.com/equipamentos/ergomousem50.png', N'https://www.inovatech.pt/manuals/ergomousem50.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'IVT-PRF-015', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (16, 6, 18, N'CloudNova NAS 4BAY Pro', N'CNV-ARM-016', N'Servidor NAS com 4 baias para discos e suporte RAID.', N'4x SATA3, RAID 0/1/5/10, 2x Gigabit LAN', N'https://cdn.example.com/equipamentos/nas4baypro.png', N'https://www.cloudnova.pt/manuals/nas4baypro.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'CNV-ARM-016', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (17, 3, 19, N'BlueWave SecureOS 12', N'BWV-SFW-017', N'Sistema operativo seguro otimizado para servidores.', N'Kernel Linux, encriptação AES-256, suporte LTS 5 anos', N'https://cdn.example.com/equipamentos/secureos12.png', N'https://www.bluewave.pt/manuals/secureos12.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'BWV-SFW-017', N'QRCode')
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em], [codigo_leitura], [tipo_leitura]) VALUES (18, 5, 15, N'PowerEdge UPS 1500VA', N'PED-UPS-018', N'UPS interativa com visor LCD e proteção contra sobretensão.', N'1500VA/900W, 6 tomadas Schuko, USB', N'https://cdn.example.com/equipamentos/ups1500va.png', N'https://www.poweredge.pt/manuals/ups1500va.pdf', 1, CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), CAST(N'2025-10-30T23:35:00.0000000' AS DateTime2), N'PED-UPS-018', N'QRCode')
GO
SET IDENTITY_INSERT [dbo].[modelos_equipamento] OFF
GO
SET IDENTITY_INSERT [dbo].[permissoes] ON 
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (21, N'EQUIPAMENTOS:Criar', N'Criar Equipamentos', N'Permite cadastrar novos equipamentos', N'EQUIPAMENTOS', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (22, N'EQUIPAMENTOS:Listar', N'Listar Equipamentos', N'Permite visualizar lista de equipamentos', N'EQUIPAMENTOS', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (23, N'EQUIPAMENTOS:Visualizar', N'Visualizar Equipamentos', N'Permite ver detalhes de equipamentos', N'EQUIPAMENTOS', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (24, N'EQUIPAMENTOS:Editar', N'Editar Equipamentos', N'Permite editar equipamentos', N'EQUIPAMENTOS', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (25, N'EQUIPAMENTOS:Apagar', N'Apagar Equipamentos', N'Permite excluir equipamentos', N'EQUIPAMENTOS', N'Apagar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (26, N'TICKETS:Criar', N'Criar Tickets', N'Permite abrir novos tickets', N'SUPORTE', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (27, N'TICKETS:Listar', N'Listar Tickets', N'Permite visualizar lista de tickets', N'SUPORTE', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (28, N'TICKETS:Visualizar', N'Visualizar Tickets', N'Permite ver detalhes de tickets', N'SUPORTE', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (29, N'TICKETS:Editar', N'Editar Tickets', N'Permite editar tickets', N'SUPORTE', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (30, N'TICKETS:Atribuir', N'Atribuir Tickets', N'Permite atribuir tickets a técnicos', N'SUPORTE', N'Atribuir', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (31, N'TICKETS:Fechar', N'Fechar Tickets', N'Permite fechar tickets', N'SUPORTE', N'Concluir', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (32, N'INTERVENCOES:Criar', N'Criar Intervenções', N'Permite registrar intervenções', N'SUPORTE', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (33, N'INTERVENCOES:Listar', N'Listar Intervenções', N'Permite visualizar lista de intervenções', N'SUPORTE', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (34, N'INTERVENCOES:Visualizar', N'Visualizar Intervenções', N'Permite ver detalhes de intervenções', N'SUPORTE', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (35, N'INTERVENCOES:Editar', N'Editar Intervenções', N'Permite editar intervenções', N'SUPORTE', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (36, N'SUPORTE:Relatorios', N'Relatórios de Suporte', N'Permite visualizar relatórios e estatísticas', N'SUPORTE', N'Exportar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (37, N'RH:Criar', N'Criar Funcionários', N'Permite criar funcionários', N'RH', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (38, N'RH:Listar', N'Listar Funcionários', N'Permite listar funcionários', N'RH', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (39, N'RH:Visualizar', N'Visualizar Funcionários', N'Permite visualizar detalhes de funcionários', N'RH', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (40, N'RH:Editar', N'Editar Funcionários', N'Permite editar informações de funcionários', N'RH', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (41, N'RH:Apagar', N'Apagar Funcionários', N'Permite apagar funcionários', N'RH', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (42, N'RH:Exportar', N'Exportar Dados RH', N'Permite exportar dados de RH', N'RH', N'Exportar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (43, N'EMPRESAS:Criar', N'Criar Empresas', N'Permite criar empresas', N'EMPRESAS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (44, N'EMPRESAS:Listar', N'Listar Empresas', N'Permite listar empresas', N'EMPRESAS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (45, N'EMPRESAS:Visualizar', N'Visualizar Empresas', N'Permite visualizar detalhes de empresas', N'EMPRESAS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (46, N'EMPRESAS:Editar', N'Editar Empresas', N'Permite editar informações de empresas', N'EMPRESAS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (47, N'EMPRESAS:Admin', N'Administrar Empresas', N'Permite administrar configurações e dados de empresas', N'EMPRESAS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (48, N'CONTEUDOS:Criar', N'Criar Conteúdos', N'Permite criar novos conteúdos', N'CONTEUDOS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (49, N'CONTEUDOS:Listar', N'Listar Conteúdos', N'Permite listar conteúdos', N'CONTEUDOS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (50, N'CONTEUDOS:Visualizar', N'Visualizar Conteúdos', N'Permite visualizar conteúdos', N'CONTEUDOS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (51, N'CONTEUDOS:Editar', N'Editar Conteúdos', N'Permite editar conteúdos existentes', N'CONTEUDOS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (52, N'CONTEUDOS:Apagar', N'Apagar Conteúdos', N'Permite apagar conteúdos', N'CONTEUDOS', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (53, N'CONTEUDOS:Publicar', N'Publicar Conteúdos', N'Permite aprovar e publicar conteúdos', N'CONTEUDOS', N'Aprovar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (54, N'CONTEUDOS:Arquivar', N'Arquivar Conteúdos', N'Permite arquivar conteúdos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (55, N'CONTEUDOS:Moderar', N'Moderar Comentários', N'Permite moderar comentários em conteúdos', N'CONTEUDOS', N'Aprovar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (56, N'CONTEUDOS:Admin', N'Administrar Conteúdos', N'Permite administrar todos os conteúdos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (57, N'CONTEUDOS:Favoritar', N'Favoritar Conteúdos', N'Permite marcar conteúdos como favoritos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (58, N'VEICULOS:Criar', N'Criar Veículos', N'Permite cadastrar veículos', N'VEICULOS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (59, N'VEICULOS:Listar', N'Listar Veículos', N'Permite listar veículos', N'VEICULOS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (60, N'VEICULOS:Visualizar', N'Visualizar Veículos', N'Permite visualizar detalhes de veículos', N'VEICULOS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (61, N'VEICULOS:Editar', N'Editar Veículos', N'Permite editar informações de veículos', N'VEICULOS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (62, N'VEICULOS:Apagar', N'Apagar Veículos', N'Permite apagar veículos', N'VEICULOS', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (65, N'UTILIZADORES:Listar', N'Listar Utilizadores', N'Permite visualizar lista de utilizadores', N'UTILIZADORES', N'Listar', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (66, N'UTILIZADORES:Gestao', N'Gestão de Utilizadores', N'Permite criar, editar e apagar utilizadores', N'UTILIZADORES', N'Outro', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (67, N'UTILIZADORES:GruposListar', N'Listar Grupos / Roles', N'Permite visualizar lista de grupos e roles', N'UTILIZADORES', N'Listar', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (68, N'UTILIZADORES:GruposGestao', N'Gestão de Grupos / Roles', N'Permite criar, editar e apagar grupos e roles', N'UTILIZADORES', N'Outro', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (69, N'UTILIZADORES:PermissoesListar', N'Listar Permissões', N'Permite visualizar lista de permissões do sistema', N'UTILIZADORES', N'Listar', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (70, N'UTILIZADORES:PermissoesGestao', N'Gestão de Permissões', N'Permite criar, editar e apagar permissões', N'UTILIZADORES', N'Outro', CAST(N'2025-10-24T00:00:00.0000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[permissoes] OFF
GO
SET IDENTITY_INSERT [dbo].[tags] ON 
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (1, N'Microlopes', N'microlopes', NULL, CAST(N'2025-10-29T12:39:25.6033333' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (2, N'Informações', N'informacoes', NULL, CAST(N'2025-10-29T12:39:25.6333333' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (3, N'UI/UX Design', N'uiux-design', NULL, CAST(N'2025-10-29T12:39:25.6566667' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (4, N'Desenvolvimento Web', N'desenvolvimento-web', NULL, CAST(N'2025-10-29T12:39:25.6800000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (5, N'Estratégia Digital & Consultoria', N'estrategia-digital-consultoria', NULL, CAST(N'2025-10-29T12:39:25.7033333' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (6, N'Alojamento & Manutenção Técnica', N'alojamento-manutencao-tecnica', NULL, CAST(N'2025-10-29T12:39:25.7300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (7, N'Gestão de Redes Sociais & Website', N'gestao-de-redes-sociais-website', NULL, CAST(N'2025-10-29T12:39:25.7533333' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (8, N'Integração E‑commerce & ERP', N'integracao-ecommerce-erp', NULL, CAST(N'2025-10-29T12:39:25.7733333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tags] OFF
GO
SET IDENTITY_INSERT [dbo].[tickets] ON 
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (1, N'TKT000001', 1, 20, N'Problema no computadoro', N'O computador não liga e', N'alta', N'aberto', 12, 1, N'Sala A04', CAST(N'2025-10-29T17:49:00.8233333' AS DateTime2), NULL, CAST(N'2025-10-29T20:08:52.6633333' AS DateTime2), NULL, NULL, NULL, CAST(N'2025-10-29T17:49:00.8233333' AS DateTime2), CAST(N'2025-10-30T23:53:51.4166667' AS DateTime2), 8, NULL, NULL, NULL)
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (2, N'TKT000002', 1, 20, N'Problema no computadoro (Cópia)', N'O computador não liga e', N'alta', N'fechado', 12, NULL, N'Sala A04', CAST(N'2025-10-29T17:54:46.9666667' AS DateTime2), NULL, CAST(N'2025-10-31T01:00:26.5566667' AS DateTime2), NULL, NULL, NULL, CAST(N'2025-10-29T17:54:46.9666667' AS DateTime2), CAST(N'2025-10-31T01:00:26.5566667' AS DateTime2), NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (3, N'TKT000003', 0, NULL, N'Ben', N'testeste', N'media', N'fechado', 1, NULL, NULL, CAST(N'2025-10-30T15:50:59.6500000' AS DateTime2), NULL, CAST(N'2025-10-31T10:38:12.2433333' AS DateTime2), NULL, NULL, NULL, CAST(N'2025-10-30T15:50:59.6500000' AS DateTime2), CAST(N'2025-10-31T10:38:12.2433333' AS DateTime2), NULL, N'32h352', N'sgdgsdgsd', NULL)
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (4, N'TKT000004', 0, 30, N'dsadas', N'dasdsa', N'media', N'aberto', 1, NULL, NULL, CAST(N'2025-10-30T15:51:18.4633333' AS DateTime2), NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T15:51:18.4633333' AS DateTime2), CAST(N'2025-10-30T23:54:00.9900000' AS DateTime2), NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (5, N'TKT000005', 0, NULL, N'dsada', N'dasda', N'media', N'aberto', 1, 1, NULL, CAST(N'2025-10-30T15:51:25.2766667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-30T15:51:25.2766667' AS DateTime2), CAST(N'2025-10-30T23:53:03.5366667' AS DateTime2), NULL, N'NB-2024-01', N'Notebook Dell Inspiron 10', N'tongay')
GO
INSERT [dbo].[tickets] ([id], [numero_ticket], [tipo_ticket_id], [equipamento_id], [titulo], [descricao], [prioridade], [status], [solicitante_id], [atribuido_id], [localizacao], [data_abertura], [data_prevista], [data_conclusao], [tempo_resolucao_minutos], [avaliacao], [comentario_avaliacao], [criado_em], [atualizado_em], [cliente_id], [equipamento_sn], [equipamento_descritivo], [codigo_unico]) VALUES (6, N'TKT000006', 9, NULL, N'problema', N'houve um problema ', N'alta', N'fechado', 13, NULL, NULL, CAST(N'2025-10-31T10:39:16.7933333' AS DateTime2), NULL, CAST(N'2025-10-31T10:40:48.3200000' AS DateTime2), NULL, NULL, NULL, CAST(N'2025-10-31T10:39:16.7933333' AS DateTime2), CAST(N'2025-10-31T10:40:48.3200000' AS DateTime2), NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[tickets] OFF
GO
SET IDENTITY_INSERT [dbo].[tickets_historico] ON 
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (1, 2, 1, N'status_alterado', N'Ticket marcado como fechado', N'aberto', N'fechado', 1, CAST(N'2025-10-29T20:08:44.6066667' AS DateTime2))
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (2, 2, 1, N'status_alterado', N'Ticket marcado como fechado', N'fechado', N'fechado', 1, CAST(N'2025-10-29T20:08:47.4966667' AS DateTime2))
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (3, 1, 1, N'status_alterado', N'Ticket marcado como fechado', N'aguardando', N'fechado', 1, CAST(N'2025-10-29T20:08:52.6833333' AS DateTime2))
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (4, 2, 1, N'status_alterado', N'Ticket marcado como fechado', N'aberto', N'fechado', 1, CAST(N'2025-10-31T01:00:26.5833333' AS DateTime2))
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (5, 3, 1, N'status_alterado', N'Ticket marcado como fechado', N'aberto', N'fechado', 1, CAST(N'2025-10-31T10:38:12.2600000' AS DateTime2))
GO
INSERT [dbo].[tickets_historico] ([id], [ticket_id], [utilizador_id], [tipo_acao], [descricao], [valor_anterior], [valor_novo], [visivel_cliente], [criado_em]) VALUES (6, 6, 1, N'status_alterado', N'Ticket marcado como fechado', N'aberto', N'fechado', 1, CAST(N'2025-10-31T10:40:48.3433333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tickets_historico] OFF
GO
SET IDENTITY_INSERT [dbo].[tipos_conteudo] ON 
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em], [cor]) VALUES (16, N'NOTICIA', N'Notícia', N'Tipo de conteúdo para notícias simples, sem campos adicionais, até 4 anexos e sem comentários.', N'tabler-news', 0, 0, 0, 0, 1, N'noticia', N'{
    "campos_personalizados": [
        {
            "codigo": "interno",
            "nome": "Interno",
            "tipo": "boolean",
            "obrigatorio": false,
            "grupo": "Interno"
        }
    ]
}', 1, CAST(N'2025-10-24T08:55:22.9266667' AS DateTime2), CAST(N'2025-10-24T08:55:22.9266667' AS DateTime2), N'#FFCC00')
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em], [cor]) VALUES (19, N'CASO_ESTUDO', N'Caso de Estudo', N'Tipo de conteúdo destinado a apresentar casos de estudo detalhados com seções de cliente, solução e resultados.', N'tabler-book', 0, 0, 0, 0, 0, N'caso-estudo', N'{
    "campos_personalizados": [
        {"codigo": "cliente", "nome": "Cliente", "tipo": "text", "obrigatorio": false, "grupo": "Cliente"},
        {"codigo": "industria", "nome": "Indústria", "tipo": "text", "obrigatorio": false, "grupo": "Cliente"},
        {"codigo": "local", "nome": "Local", "tipo": "text", "obrigatorio": false, "grupo": "Cliente"},
        {"codigo": "caso_uso", "nome": "Caso de Uso", "tipo": "text", "obrigatorio": false, "grupo": "Cliente"},
        {"codigo": "desafio", "nome": "Desafio", "tipo": "textarea", "obrigatorio": false, "grupo": "Cliente"},
        {"codigo": "solucao_desc", "nome": "Descrição Solução", "tipo": "textarea", "obrigatorio": false, "grupo": "Solução"},
        {"codigo": "solucao_p1", "nome": "Solução Ponto 1", "tipo": "textarea", "obrigatorio": false, "grupo": "Solução"},
        {"codigo": "solucao_p2", "nome": "Solução Ponto 2", "tipo": "textarea", "obrigatorio": false, "grupo": "Solução"},
        {"codigo": "solucao_p3", "nome": "Solução Ponto 3", "tipo": "textarea", "obrigatorio": false, "grupo": "Solução"},
        {"codigo": "solucao_p4", "nome": "Solução Ponto 4", "tipo": "textarea", "obrigatorio": false, "grupo": "Solução"},
        {"codigo": "resultados_desc", "nome": "Descrição Resultados", "tipo": "textarea", "obrigatorio": false, "grupo": "Resultados"},
        {"codigo": "resultados_p1", "nome": "Resultados Ponto 1", "tipo": "textarea", "obrigatorio": false, "grupo": "Resultados"},
        {"codigo": "resultados_p2", "nome": "Resultados Ponto 2", "tipo": "textarea", "obrigatorio": false, "grupo": "Resultados"},
        {"codigo": "resultados_p3", "nome": "Resultados Ponto 3", "tipo": "textarea", "obrigatorio": false, "grupo": "Resultados"},
        {"codigo": "resultados_p4", "nome": "Resultados Ponto 4", "tipo": "textarea", "obrigatorio": false, "grupo": "Resultados"}
    ]
}', 1, CAST(N'2025-10-24T09:29:40.0266667' AS DateTime2), CAST(N'2025-10-24T09:29:40.0266667' AS DateTime2), N'#00BFFF')
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em], [cor]) VALUES (20, N'BANNER_ENTRADA', N'Banner de Entrada', N'Tipo de conteúdo destinado a gerir os banners da página inicial, permitindo definir imagem, texto e link de destino.', N'tabler-photo', 0, 1, 1, 1, 0, N'banner-entrada', N'{}', 1, CAST(N'2025-10-31T17:35:37.5833333' AS DateTime2), CAST(N'2025-10-31T17:35:37.5833333' AS DateTime2), N'#00A3E0')
GO
SET IDENTITY_INSERT [dbo].[tipos_conteudo] OFF
GO
SET IDENTITY_INSERT [dbo].[tipos_funcionarios] ON 
GO
INSERT [dbo].[tipos_funcionarios] ([id], [codigo], [nome], [descricao], [cor], [ativo], [criado_em], [atualizado_em], [icone]) VALUES (1, N'DEV', N'Desenvolvedor', N'Responsável pelo desenvolvimento de software, aplicações e sistemas internos.', N'#0078D7', 1, CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), N'tabler-code')
GO
INSERT [dbo].[tipos_funcionarios] ([id], [codigo], [nome], [descricao], [cor], [ativo], [criado_em], [atualizado_em], [icone]) VALUES (2, N'SUP', N'Suporte Técnico', N'Atua na resolução de problemas técnicos e atendimento ao cliente.', N'#00B294', 1, CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), N'tabler-headphones')
GO
INSERT [dbo].[tipos_funcionarios] ([id], [codigo], [nome], [descricao], [cor], [ativo], [criado_em], [atualizado_em], [icone]) VALUES (3, N'ADM', N'Administrador de Sistemas', N'Gere servidores, infraestrutura e segurança da informação.', N'#8E8CD8', 1, CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), N'tabler-server')
GO
INSERT [dbo].[tipos_funcionarios] ([id], [codigo], [nome], [descricao], [cor], [ativo], [criado_em], [atualizado_em], [icone]) VALUES (4, N'PM', N'Gestor de Projetos', N'Coordena equipas e garante a entrega de projetos dentro dos prazos.', N'#FFB900', 1, CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), N'tabler-clipboard-list')
GO
INSERT [dbo].[tipos_funcionarios] ([id], [codigo], [nome], [descricao], [cor], [ativo], [criado_em], [atualizado_em], [icone]) VALUES (5, N'COM', N'Comercial / Vendas', N'Responsável pela prospeção de clientes e apresentação de soluções tecnológicas.', N'#E74856', 1, CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), CAST(N'2025-10-29T13:11:09.7566667' AS DateTime2), N'tabler-briefcase')
GO
SET IDENTITY_INSERT [dbo].[tipos_funcionarios] OFF
GO
SET IDENTITY_INSERT [dbo].[tipos_ticket] ON 
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'Incidente', N'Problema técnico que afeta o funcionamento normal de um serviço.', N'#E74856', N'tabler-alert-triangle', 8, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (2, N'Pedido de Suporte', N'Solicitação geral de ajuda ou esclarecimento técnico.', N'#0078D7', N'tabler-help-circle', 24, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (3, N'Manutenção Preventiva', N'Ações planejadas para evitar falhas futuras em sistemas.', N'#00B294', N'tabler-tools', 48, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (4, N'Atualização de Software', N'Solicitação para atualizar aplicações, sistemas ou firmwares.', N'#FFB900', N'tabler-refresh', 24, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (5, N'Instalação', N'Pedido de instalação de hardware, software ou periféricos.', N'#8E8CD8', N'tabler-device-desktop', 12, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (6, N'Configuração', N'Ajustes e parametrizações de sistemas ou equipamentos.', N'#0099BC', N'tabler-settings', 12, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (7, N'Acesso / Permissões', N'Solicitação de criação, alteração ou remoção de acessos.', N'#B91D47', N'tabler-key', 4, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (8, N'Erro de Sistema', N'Falha crítica que impede o uso de um sistema ou aplicação.', N'#D13438', N'tabler-bug', 2, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (9, N'Backup / Recuperação', N'Solicitação de restauração de dados ou configuração de backups.', N'#498205', N'tabler-database', 24, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (10, N'Outros', N'Pedidos que não se enquadram nas categorias anteriores.', N'#515C6B', N'tabler-dots', 72, 1, CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2), CAST(N'2025-10-29T15:54:15.3333333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (11, N'Elétrico', N'Intervenções ou falhas relacionadas com circuitos, energia ou instalações elétricas.', N'#F7630C', N'tabler-bolt', 8, 1, CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2), CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (12, N'Hardware', N'Problemas físicos em equipamentos como computadores, servidores, impressoras ou periféricos.', N'#107C10', N'tabler-cpu', 12, 1, CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2), CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (13, N'Software', N'Erros, bugs ou necessidades de instalação/configuração de programas e sistemas operativos.', N'#005FB8', N'tabler-code', 16, 1, CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2), CAST(N'2025-10-30T17:25:12.0533333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tipos_ticket] OFF
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 21, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 22, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 23, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 24, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 25, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 26, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 27, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 28, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 29, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 30, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 31, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 32, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 33, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 34, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 35, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 36, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 37, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 38, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 39, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 40, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 41, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 42, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 43, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 44, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 45, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 46, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 47, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 48, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 49, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 50, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 51, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 52, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 53, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 54, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 55, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 56, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 57, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 58, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 59, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 60, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 61, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 62, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 65, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 66, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 67, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 68, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 69, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 70, CAST(N'2025-10-29T12:11:27.3150815' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[utilizadores] ON 
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (1, N'geral', N'geral@microlopes.pt', N'$2a$12$0BgiCsMEjuFrOoTDpTgSr.1JLVpAoYbbEaHxGTEELHXdIZ0D4YA0a', NULL, 1, 1, CAST(N'2025-10-29T12:09:00.8233333' AS DateTime2), NULL, NULL, NULL, NULL, CAST(N'2025-10-31T23:21:13.9200000' AS DateTime2), NULL, N'pt-PT', N'light', CAST(N'2025-10-29T12:09:00.8233333' AS DateTime2), CAST(N'2025-10-29T12:09:00.8233333' AS DateTime2), NULL, NULL, N'interno')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (2, N'guilherme.ferreira', N'guilhermeferreira@microlopes.pt', N'$2a$12$0BgiCsMEjuFrOoTDpTgSr.1JLVpAoYbbEaHxGTEELHXdIZ0D4YA0a', NULL, 1, 1, CAST(N'2025-10-29T12:10:37.5966667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'dark', CAST(N'2025-10-29T12:10:37.5966667' AS DateTime2), CAST(N'2025-10-29T12:10:37.5966667' AS DateTime2), NULL, NULL, N'interno')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (3, N'dasvieira07', N'dasvieira07@gmail.com', N'$2b$10$b0ATRTEiT4roXJhzj0jd6.RBqfnjdBDz4t9dUonsIAQyGvTsqn68G', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-29T18:11:27.1166667' AS DateTime2), NULL, N'pt', N'light', CAST(N'2025-10-29T13:13:57.0333333' AS DateTime2), CAST(N'2025-10-29T13:13:57.0333333' AS DateTime2), 1, NULL, N'interno')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (11, N'softon.user', N'contact@softon.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351912345678', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'light', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 1, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (12, N'nautis.user', N'contact@nautis.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351913223344', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'dark', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 2, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (13, N'techwave.user', N'info@techwave.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351914445566', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'light', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 3, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (14, N'datalogic.user', N'geral@datalogic.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351916778899', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'light', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 4, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (15, N'cloudprime.user', N'hello@cloudprime.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351917667788', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'dark', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 5, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (16, N'consumidor.final', N'consumidor.final@microlopes.pt', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'light', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-31T18:19:34.0166667' AS DateTime2), NULL, 6, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (17, N'luis.pereira', N'luis.pereira@gmail.com', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351917112233', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, CAST(N'2025-10-30T20:04:25.6500000' AS DateTime2), NULL, N'pt-PT', N'light', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 8, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (18, N'ines.carvalho', N'ines.carvalho@hotmail.com', N'$2a$12$Un2DCOyc3AbY3d9O2dUmme/RCoXMBWRgMu5hDqkzoI4kJyF4xdruK', N'+351918556677', 1, 1, CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, N'pt-PT', N'dark', CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), CAST(N'2025-10-29T17:30:38.9566667' AS DateTime2), NULL, 9, N'cliente')
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id], [cliente_id], [tipo_utilizador]) VALUES (19, N'joaomangalhao', N'joaomangalhao@example.com', N'$2b$10$4RVqJhq23GjAaidsyuw3hOoEGFzEoZLVnHGLGFexiPZwELwZ/Cb7q', N'930293022', 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'pt', N'light', CAST(N'2025-10-31T15:49:15.6700000' AS DateTime2), CAST(N'2025-11-01T00:08:07.2633333' AS DateTime2), NULL, NULL, N'interno')
GO
SET IDENTITY_INSERT [dbo].[utilizadores] OFF
GO
/****** Object:  Index [UQ__a_formac__E2B9312FC8D2586F]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[a_formacoes_progresso] ADD UNIQUE NONCLUSTERED 
(
	[aluno_id] ASC,
	[a_formacao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_beneficios_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [UQ_beneficios_valores] UNIQUE NONCLUSTERED 
(
	[beneficio_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_categorias_conteudo_slug]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [UQ_categorias_conteudo_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_categorias_conteudo_pai]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_pai] ON [dbo].[categorias_conteudo]
(
	[categoria_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_categorias_conteudo_slug]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_slug] ON [dbo].[categorias_conteudo]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_clientes_num_cliente]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[clientes] ADD  CONSTRAINT [UQ_clientes_num_cliente] UNIQUE NONCLUSTERED 
(
	[num_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_clientes_num_cliente]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_clientes_num_cliente] ON [dbo].[clientes]
(
	[num_cliente] ASC
)
WHERE ([num_cliente] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_aprovado]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_aprovado] ON [dbo].[comentarios]
(
	[aprovado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_conteudo] ON [dbo].[comentarios]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_pai]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_pai] ON [dbo].[comentarios]
(
	[comentario_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__configur__40F9A206E7F5789A]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[configuracoes] ADD UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_configuracoes_codigo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_configuracoes_codigo] ON [dbo].[configuracoes]
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudo_anexo_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_conteudo] ON [dbo].[conteudo_anexo]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudo_anexo_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_tipo] ON [dbo].[conteudo_anexo]
(
	[tipo_anexo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_conteudos_slug]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [UQ_conteudos_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_autor]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_autor] ON [dbo].[conteudos]
(
	[autor_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_categoria]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_categoria] ON [dbo].[conteudos]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_empresa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_empresa] ON [dbo].[conteudos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_idiomas]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_idiomas] ON [dbo].[conteudos]
(
	[idiomas] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_publicado]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_publicado] ON [dbo].[conteudos]
(
	[publicado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_slug]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_slug] ON [dbo].[conteudos]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_status]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_status] ON [dbo].[conteudos]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_tipo] ON [dbo].[conteudos]
(
	[tipo_conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_visibilidade]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visibilidade] ON [dbo].[conteudos]
(
	[visibilidade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_conteudos_favoritos]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[conteudos_favoritos] ADD  CONSTRAINT [UQ_conteudos_favoritos] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_conteudos_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [UQ_conteudos_valores] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_valores_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_valores_conteudo] ON [dbo].[conteudos_valores_personalizados]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_conteudo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_conteudo] ON [dbo].[conteudos_visualizacoes]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_data]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_data] ON [dbo].[conteudos_visualizacoes]
(
	[visualizado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_documentos_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [UQ_documentos_valores] UNIQUE NONCLUSTERED 
(
	[documento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empregos_funcionario]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_funcionario] ON [dbo].[empregos]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empregos_situacao]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_situacao] ON [dbo].[empregos]
(
	[situacao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_empregos_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [UQ_empregos_valores] UNIQUE NONCLUSTERED 
(
	[emprego_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_empresas_codigo]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [UQ_empresas_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empresas_ativo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_ativo] ON [dbo].[empresas]
(
	[ativo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_codigo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_codigo] ON [dbo].[empresas]
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_email]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_email] ON [dbo].[empresas]
(
	[email] ASC
)
WHERE ([email] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_estado]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_estado] ON [dbo].[empresas]
(
	[estado] ASC
)
WHERE ([estado] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_nif]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_nif] ON [dbo].[empresas]
(
	[nif] ASC
)
WHERE ([nif] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_num_cliente]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_num_cliente] ON [dbo].[empresas]
(
	[num_cliente] ASC
)
WHERE ([num_cliente] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_ref_externa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_ref_externa] ON [dbo].[empresas]
(
	[ref_externa] ASC
)
WHERE ([ref_externa] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_tipo] ON [dbo].[empresas]
(
	[tipo_empresa] ASC
)
WHERE ([tipo_empresa] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_equipamentos_numero_interno]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [UQ_equipamentos_numero_interno] UNIQUE NONCLUSTERED 
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_empresa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_empresa] ON [dbo].[equipamentos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_estado]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_estado] ON [dbo].[equipamentos]
(
	[estado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_modelo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_modelo] ON [dbo].[equipamentos]
(
	[modelo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_numero_serie]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_numero_serie] ON [dbo].[equipamentos]
(
	[numero_serie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_equipamentos_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [UQ_equipamentos_valores] UNIQUE NONCLUSTERED 
(
	[equipamento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__formacoe__0C57C3AC04A09106]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[formacoes_clientes] ADD UNIQUE NONCLUSTERED 
(
	[formacao_id] ASC,
	[cliente_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_quiz_formacao]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_quiz_formacao] ON [dbo].[formacoes_quiz]
(
	[formacao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_opcoes_pergunta]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_opcoes_pergunta] ON [dbo].[formacoes_quiz_opcoes]
(
	[pergunta_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_perguntas_quiz]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_perguntas_quiz] ON [dbo].[formacoes_quiz_perguntas]
(
	[quiz_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_respostas_pergunta]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_respostas_pergunta] ON [dbo].[formacoes_quiz_respostas]
(
	[pergunta_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_respostas_tentativa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_respostas_tentativa] ON [dbo].[formacoes_quiz_respostas]
(
	[tentativa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tentativas_quiz]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tentativas_quiz] ON [dbo].[formacoes_quiz_tentativas]
(
	[quiz_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tentativas_utilizador]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tentativas_utilizador] ON [dbo].[formacoes_quiz_tentativas]
(
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_fornecedores_empresa_id]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[fornecedores] ADD  CONSTRAINT [UQ_fornecedores_empresa_id] UNIQUE NONCLUSTERED 
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_fornecedores_num_fornecedor]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[fornecedores] ADD  CONSTRAINT [UQ_fornecedores_num_fornecedor] UNIQUE NONCLUSTERED 
(
	[num_fornecedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_fornecedores_comprador]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_comprador] ON [dbo].[fornecedores]
(
	[comprador_responsavel_id] ASC
)
WHERE ([comprador_responsavel_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_estado]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_estado] ON [dbo].[fornecedores]
(
	[estado] ASC
)
WHERE ([estado] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_id_phc]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_id_phc] ON [dbo].[fornecedores]
(
	[id_phc] ASC
)
WHERE ([id_phc] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_num_fornecedor]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_num_fornecedor] ON [dbo].[fornecedores]
(
	[num_fornecedor] ASC
)
WHERE ([num_fornecedor] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_tipo] ON [dbo].[fornecedores]
(
	[tipo_fornecedor] ASC
)
WHERE ([tipo_fornecedor] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_empresa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_empresa] ON [dbo].[funcionarios]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_nome]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_nome] ON [dbo].[funcionarios]
(
	[nome_completo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_numero]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_numero] ON [dbo].[funcionarios]
(
	[numero] ASC
)
WHERE ([numero] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_tipo] ON [dbo].[funcionarios]
(
	[tipo_funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_funcionarios_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [UQ_funcionarios_valores] UNIQUE NONCLUSTERED 
(
	[funcionario_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_valores_campo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_campo] ON [dbo].[funcionarios_valores_personalizados]
(
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_valores_funcionario]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_funcionario] ON [dbo].[funcionarios_valores_personalizados]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_intervencoes_numero]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [UQ_intervencoes_numero] UNIQUE NONCLUSTERED 
(
	[numero_intervencao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_data_inicio]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_data_inicio] ON [dbo].[intervencoes]
(
	[data_inicio] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_equipamento]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_equipamento] ON [dbo].[intervencoes]
(
	[equipamento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_status]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_status] ON [dbo].[intervencoes]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_ticket]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_ticket] ON [dbo].[intervencoes]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_tipo] ON [dbo].[intervencoes]
(
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_anexos_intervencao]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_intervencao] ON [dbo].[intervencoes_anexos]
(
	[intervencao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_anexos_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_tipo] ON [dbo].[intervencoes_anexos]
(
	[tipo_documento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_marcas_nome]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [UQ_marcas_nome] UNIQUE NONCLUSTERED 
(
	[nome] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_categoria]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_categoria] ON [dbo].[modelos_equipamento]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_marca]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_marca] ON [dbo].[modelos_equipamento]
(
	[marca_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__newslett__AB6E616456B3178F]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[newsletter_inscritos] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_permissoes_codigo]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[permissoes] ADD  CONSTRAINT [UQ_permissoes_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tags_slug]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[tags] ADD  CONSTRAINT [UQ_tags_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tickets_numero]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [UQ_tickets_numero] UNIQUE NONCLUSTERED 
(
	[numero_ticket] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_atribuido]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_atribuido] ON [dbo].[tickets]
(
	[atribuido_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_data_abertura]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_data_abertura] ON [dbo].[tickets]
(
	[data_abertura] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_prioridade]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_prioridade] ON [dbo].[tickets]
(
	[prioridade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_solicitante]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_solicitante] ON [dbo].[tickets]
(
	[solicitante_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_status]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_status] ON [dbo].[tickets]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_historico_ticket]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_historico_ticket] ON [dbo].[tickets_historico]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tipos_conteudo_codigo]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [UQ_tipos_conteudo_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tipos_funcionarios_codigo]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [UQ_tipos_funcionarios_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_transacoes_itens_item]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_transacoes_itens_item] ON [dbo].[transacoes_itens]
(
	[item_tipo] ASC,
	[item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_transacoes_itens_transacao]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_transacoes_itens_transacao] ON [dbo].[transacoes_itens]
(
	[transacao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_utilizador_empresa]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [UQ_utilizador_empresa] UNIQUE NONCLUSTERED 
(
	[utilizador_id] ASC,
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_utilizadores_email]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [UQ_utilizadores_email] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_utilizadores_username]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [UQ_utilizadores_username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utilizadores_email]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_email] ON [dbo].[utilizadores]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_utilizadores_funcionario]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_funcionario] ON [dbo].[utilizadores]
(
	[funcionario_id] ASC
)
WHERE ([funcionario_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utilizadores_tipo]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_tipo] ON [dbo].[utilizadores]
(
	[tipo_utilizador] ASC
)
INCLUDE([cliente_id],[funcionario_id]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_veiculos_empresa]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_empresa] ON [dbo].[veiculos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_matricula]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_matricula] ON [dbo].[veiculos]
(
	[matricula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_numero_interno]    Script Date: 01/11/2025 11:40:38 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_numero_interno] ON [dbo].[veiculos]
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_veiculos_valores]    Script Date: 01/11/2025 11:40:38 ******/
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [UQ_veiculos_valores] UNIQUE NONCLUSTERED 
(
	[veiculo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[a_formacoes] ADD  DEFAULT ((1)) FOR [publicado]
GO
ALTER TABLE [dbo].[a_formacoes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[a_formacoes_blocos] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[a_formacoes_blocos_anexos] ADD  DEFAULT ((1)) FOR [ordem]
GO
ALTER TABLE [dbo].[a_formacoes_blocos_anexos] ADD  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[a_formacoes_blocos_anexos] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[a_formacoes_comentarios] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[a_formacoes_progresso] ADD  DEFAULT ((0)) FOR [visto]
GO
ALTER TABLE [dbo].[a_formacoes_progresso] ADD  DEFAULT ((0)) FOR [tempo_assistido]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [DF_beneficios_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [DF_beneficios_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((0)) FOR [total_compras]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((0)) FOR [num_encomendas]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ('Consumidor Final') FOR [nome_cliente]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_aprovado]  DEFAULT ((0)) FOR [aprovado]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_denuncias]  DEFAULT ((0)) FOR [denuncias]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_likes]  DEFAULT ((0)) FOR [likes]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[configuracoes] ADD  CONSTRAINT [DF_configuracoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[configuracoes] ADD  DEFAULT ((0)) FOR [encriptado]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudo_tag] ADD  CONSTRAINT [DF_conteudo_tag_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_status]  DEFAULT ('rascunho') FOR [status]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_destaque]  DEFAULT ((0)) FOR [destaque]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_permite_comentarios]  DEFAULT ((1)) FOR [permite_comentarios]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_visualizacoes]  DEFAULT ((0)) FOR [visualizacoes]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  DEFAULT ('privada') FOR [visibilidade]
GO
ALTER TABLE [dbo].[conteudos_favoritos] ADD  CONSTRAINT [DF_conteudos_favoritos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [DF_conteudos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [DF_conteudos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] ADD  CONSTRAINT [DF_conteudos_visualizacoes_data]  DEFAULT (getdate()) FOR [visualizado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_tem_condicao]  DEFAULT ((0)) FOR [tem_condicao_medica]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_dep_ir]  DEFAULT ((0)) FOR [dependente_ir]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_dep_saude]  DEFAULT ((0)) FOR [dependente_saude]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_documentos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_documentos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [DF_documentos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [DF_documentos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_empregos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_empregos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [DF_empregos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [DF_empregos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ('Portugal') FOR [pais]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ('ativo') FOR [estado]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ((0)) FOR [sincronizado_phc]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_estado]  DEFAULT ('operacional') FOR [estado]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [DF_equipamentos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [DF_equipamentos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[formacoes] ADD  DEFAULT ((0)) FOR [publicado]
GO
ALTER TABLE [dbo].[formacoes] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[formacoes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[formacoes_clientes] ADD  DEFAULT (getdate()) FOR [data_inscricao]
GO
ALTER TABLE [dbo].[formacoes_clientes] ADD  DEFAULT ((0)) FOR [progresso]
GO
ALTER TABLE [dbo].[formacoes_clientes] ADD  DEFAULT ((0)) FOR [horas_estudo]
GO
ALTER TABLE [dbo].[formacoes_clientes] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[formacoes_clientes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[formacoes_quiz] ADD  DEFAULT ((1)) FOR [mostrar_resultados]
GO
ALTER TABLE [dbo].[formacoes_quiz] ADD  DEFAULT ((1)) FOR [permitir_tentativas_multiplas]
GO
ALTER TABLE [dbo].[formacoes_quiz] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[formacoes_quiz] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[formacoes_quiz] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[formacoes_quiz_opcoes] ADD  DEFAULT ((0)) FOR [correta]
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas] ADD  DEFAULT ((1)) FOR [pontuacao]
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas] ADD  DEFAULT (getdate()) FOR [respondida_em]
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas] ADD  DEFAULT ((1)) FOR [numero_tentativa]
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas] ADD  DEFAULT (getdate()) FOR [data_inicio]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ('ativo') FOR [estado]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [requer_aprovacao]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [total_compras]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [num_encomendas]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [num_reclamacoes]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [sincronizado_phc]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [DF_funcionarios_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [DF_funcionarios_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[grupo_permissao] ADD  CONSTRAINT [DF_grupo_permissao_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupo_utilizador] ADD  CONSTRAINT [DF_grupo_utilizador_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_garantia]  DEFAULT ((0)) FOR [garantia]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_status]  DEFAULT ('agendada') FOR [status]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[intervencoes_anexos] ADD  CONSTRAINT [DF_intervencoes_anexos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[intervencoes_custos] ADD  CONSTRAINT [DF_intervencoes_pecas_quantidade]  DEFAULT ((1)) FOR [quantidade]
GO
ALTER TABLE [dbo].[intervencoes_custos] ADD  CONSTRAINT [DF_intervencoes_pecas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[m_formacoes] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[m_formacoes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[newsletter_inscritos] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[newsletter_inscritos] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[permissoes] ADD  CONSTRAINT [DF_permissoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tags] ADD  CONSTRAINT [DF_tags_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_prioridade]  DEFAULT ('media') FOR [prioridade]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_status]  DEFAULT ('aberto') FOR [status]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_data_abertura]  DEFAULT (getdate()) FOR [data_abertura]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tickets_historico] ADD  CONSTRAINT [DF_tickets_historico_visivel_cliente]  DEFAULT ((1)) FOR [visivel_cliente]
GO
ALTER TABLE [dbo].[tickets_historico] ADD  CONSTRAINT [DF_tickets_historico_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_comentarios]  DEFAULT ((1)) FOR [permite_comentarios]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_anexos]  DEFAULT ((1)) FOR [permite_anexos]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_galeria]  DEFAULT ((0)) FOR [permite_galeria]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_requer_aprovacao]  DEFAULT ((0)) FOR [requer_aprovacao]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[transacoes] ADD  DEFAULT (getdate()) FOR [data_transacao]
GO
ALTER TABLE [dbo].[transacoes] ADD  DEFAULT ('EUR') FOR [moeda]
GO
ALTER TABLE [dbo].[transacoes] ADD  DEFAULT ('pendente') FOR [estado]
GO
ALTER TABLE [dbo].[transacoes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[transacoes_itens] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [DF_utilizador_empresa_principal]  DEFAULT ((0)) FOR [empresa_principal]
GO
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [DF_utilizador_empresa_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizador_permissao] ADD  CONSTRAINT [DF_utilizador_permissao_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_email_verificado]  DEFAULT ((0)) FOR [email_verificado]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_idioma]  DEFAULT ('pt') FOR [idioma]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_tema]  DEFAULT ('light') FOR [tema]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  DEFAULT ('interno') FOR [tipo_utilizador]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_em_circulacao]  DEFAULT ((1)) FOR [em_circulacao]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [DF_veiculos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [DF_veiculos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[a_formacoes]  WITH CHECK ADD FOREIGN KEY([m_formacao_id])
REFERENCES [dbo].[m_formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[a_formacoes_blocos]  WITH CHECK ADD FOREIGN KEY([a_formacao_id])
REFERENCES [dbo].[a_formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[a_formacoes_blocos_anexos]  WITH CHECK ADD FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
GO
ALTER TABLE [dbo].[a_formacoes_blocos_anexos]  WITH CHECK ADD FOREIGN KEY([bloco_id])
REFERENCES [dbo].[a_formacoes_blocos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[a_formacoes_comentarios]  WITH CHECK ADD FOREIGN KEY([a_formacao_id])
REFERENCES [dbo].[a_formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[a_formacoes_comentarios]  WITH CHECK ADD FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[a_formacoes_progresso]  WITH CHECK ADD FOREIGN KEY([a_formacao_id])
REFERENCES [dbo].[a_formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[a_formacoes_progresso]  WITH CHECK ADD FOREIGN KEY([aluno_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[anexos]  WITH CHECK ADD  CONSTRAINT [FK_anexos_utilizador] FOREIGN KEY([upload_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[anexos] CHECK CONSTRAINT [FK_anexos_utilizador]
GO
ALTER TABLE [dbo].[beneficios]  WITH CHECK ADD  CONSTRAINT [FK_beneficios_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[beneficios] CHECK CONSTRAINT [FK_beneficios_funcionario]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_beneficios_valores_beneficio] FOREIGN KEY([beneficio_id])
REFERENCES [dbo].[beneficios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] CHECK CONSTRAINT [FK_beneficios_valores_beneficio]
GO
ALTER TABLE [dbo].[categorias_conteudo]  WITH CHECK ADD  CONSTRAINT [FK_categorias_conteudo_pai] FOREIGN KEY([categoria_pai_id])
REFERENCES [dbo].[categorias_conteudo] ([id])
GO
ALTER TABLE [dbo].[categorias_conteudo] CHECK CONSTRAINT [FK_categorias_conteudo_pai]
GO
ALTER TABLE [dbo].[categorias_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_categorias_equipamento_pai] FOREIGN KEY([categoria_pai_id])
REFERENCES [dbo].[categorias_equipamento] ([id])
GO
ALTER TABLE [dbo].[categorias_equipamento] CHECK CONSTRAINT [FK_categorias_equipamento_pai]
GO
ALTER TABLE [dbo].[clientes]  WITH CHECK ADD  CONSTRAINT [FK_clientes_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[clientes] CHECK CONSTRAINT [FK_clientes_empresa]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_aprovador] FOREIGN KEY([aprovado_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_aprovador]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_conteudo]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_pai] FOREIGN KEY([comentario_pai_id])
REFERENCES [dbo].[comentarios] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_pai]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_utilizador]
GO
ALTER TABLE [dbo].[contatos]  WITH CHECK ADD  CONSTRAINT [FK_contatos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[contatos] CHECK CONSTRAINT [FK_contatos_funcionario]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_anexo_anexo] FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [FK_conteudo_anexo_anexo]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_anexo_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [FK_conteudo_anexo_conteudo]
GO
ALTER TABLE [dbo].[conteudo_tag]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_tag_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_tag] CHECK CONSTRAINT [FK_conteudo_tag_conteudo]
GO
ALTER TABLE [dbo].[conteudo_tag]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_tag_tag] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tags] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_tag] CHECK CONSTRAINT [FK_conteudo_tag_tag]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_aprovador] FOREIGN KEY([aprovado_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_aprovador]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_autor] FOREIGN KEY([autor_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_autor]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_categoria] FOREIGN KEY([categoria_id])
REFERENCES [dbo].[categorias_conteudo] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_categoria]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_empresa]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_tipo] FOREIGN KEY([tipo_conteudo_id])
REFERENCES [dbo].[tipos_conteudo] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_tipo]
GO
ALTER TABLE [dbo].[conteudos_favoritos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_favoritos_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_favoritos] CHECK CONSTRAINT [FK_conteudos_favoritos_conteudo]
GO
ALTER TABLE [dbo].[conteudos_favoritos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_favoritos_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_favoritos] CHECK CONSTRAINT [FK_conteudos_favoritos_utilizador]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_valores_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] CHECK CONSTRAINT [FK_conteudos_valores_conteudo]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_visualizacoes_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] CHECK CONSTRAINT [FK_conteudos_visualizacoes_conteudo]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_visualizacoes_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] CHECK CONSTRAINT [FK_conteudos_visualizacoes_utilizador]
GO
ALTER TABLE [dbo].[dependentes]  WITH CHECK ADD  CONSTRAINT [FK_dependentes_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[dependentes] CHECK CONSTRAINT [FK_dependentes_funcionario]
GO
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [FK_documentos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [FK_documentos_funcionario]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_documentos_valores_documento] FOREIGN KEY([documento_id])
REFERENCES [dbo].[documentos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] CHECK CONSTRAINT [FK_documentos_valores_documento]
GO
ALTER TABLE [dbo].[empregos]  WITH CHECK ADD  CONSTRAINT [FK_empregos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[empregos] CHECK CONSTRAINT [FK_empregos_funcionario]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_empregos_valores_emprego] FOREIGN KEY([emprego_id])
REFERENCES [dbo].[empregos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] CHECK CONSTRAINT [FK_empregos_valores_emprego]
GO
ALTER TABLE [dbo].[enderecos]  WITH CHECK ADD  CONSTRAINT [FK_enderecos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[enderecos] CHECK CONSTRAINT [FK_enderecos_funcionario]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_equipamentos_valores_equipamento] FOREIGN KEY([equipamento_id])
REFERENCES [dbo].[equipamentos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] CHECK CONSTRAINT [FK_equipamentos_valores_equipamento]
GO
ALTER TABLE [dbo].[formacoes]  WITH CHECK ADD FOREIGN KEY([autor_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[formacoes_clientes]  WITH CHECK ADD FOREIGN KEY([cliente_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[formacoes_clientes]  WITH CHECK ADD FOREIGN KEY([formacao_id])
REFERENCES [dbo].[formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz]  WITH CHECK ADD  CONSTRAINT [FK_quiz_formacao] FOREIGN KEY([formacao_id])
REFERENCES [dbo].[formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz] CHECK CONSTRAINT [FK_quiz_formacao]
GO
ALTER TABLE [dbo].[formacoes_quiz_opcoes]  WITH CHECK ADD  CONSTRAINT [FK_opcoes_pergunta] FOREIGN KEY([pergunta_id])
REFERENCES [dbo].[formacoes_quiz_perguntas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz_opcoes] CHECK CONSTRAINT [FK_opcoes_pergunta]
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas]  WITH CHECK ADD  CONSTRAINT [FK_perguntas_quiz] FOREIGN KEY([quiz_id])
REFERENCES [dbo].[formacoes_quiz] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas] CHECK CONSTRAINT [FK_perguntas_quiz]
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas]  WITH CHECK ADD  CONSTRAINT [FK_respostas_opcao] FOREIGN KEY([opcao_id])
REFERENCES [dbo].[formacoes_quiz_opcoes] ([id])
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas] CHECK CONSTRAINT [FK_respostas_opcao]
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas]  WITH CHECK ADD  CONSTRAINT [FK_respostas_pergunta] FOREIGN KEY([pergunta_id])
REFERENCES [dbo].[formacoes_quiz_perguntas] ([id])
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas] CHECK CONSTRAINT [FK_respostas_pergunta]
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas]  WITH CHECK ADD  CONSTRAINT [FK_respostas_tentativa] FOREIGN KEY([tentativa_id])
REFERENCES [dbo].[formacoes_quiz_tentativas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz_respostas] CHECK CONSTRAINT [FK_respostas_tentativa]
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas]  WITH CHECK ADD  CONSTRAINT [FK_tentativas_quiz] FOREIGN KEY([quiz_id])
REFERENCES [dbo].[formacoes_quiz] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas] CHECK CONSTRAINT [FK_tentativas_quiz]
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas]  WITH CHECK ADD  CONSTRAINT [FK_tentativas_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[formacoes_quiz_tentativas] CHECK CONSTRAINT [FK_tentativas_utilizador]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD  CONSTRAINT [FK_fornecedores_comprador] FOREIGN KEY([comprador_responsavel_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[fornecedores] CHECK CONSTRAINT [FK_fornecedores_comprador]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD  CONSTRAINT [FK_fornecedores_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[fornecedores] CHECK CONSTRAINT [FK_fornecedores_empresa]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [FK_funcionarios_empresa]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_tipo] FOREIGN KEY([tipo_funcionario_id])
REFERENCES [dbo].[tipos_funcionarios] ([id])
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [FK_funcionarios_tipo]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_valores_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] CHECK CONSTRAINT [FK_funcionarios_valores_funcionario]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_grupo_permissao_grupo] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_grupo_permissao_grupo]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_grupo_permissao_permissao] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_grupo_permissao_permissao]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_grupo_utilizador_grupo] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_grupo_utilizador_grupo]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_grupo_utilizador_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_grupo_utilizador_utilizador]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_equipamento] FOREIGN KEY([equipamento_id])
REFERENCES [dbo].[equipamentos] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_equipamento]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_tecnico] FOREIGN KEY([tecnico_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_tecnico]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_ticket] FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_ticket]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_anexos_anexo] FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [FK_intervencoes_anexos_anexo]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_anexos_intervencao] FOREIGN KEY([intervencao_id])
REFERENCES [dbo].[intervencoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [FK_intervencoes_anexos_intervencao]
GO
ALTER TABLE [dbo].[intervencoes_custos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_pecas_intervencao] FOREIGN KEY([intervencao_id])
REFERENCES [dbo].[intervencoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[intervencoes_custos] CHECK CONSTRAINT [FK_intervencoes_pecas_intervencao]
GO
ALTER TABLE [dbo].[m_formacoes]  WITH CHECK ADD FOREIGN KEY([criado_por])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[m_formacoes]  WITH CHECK ADD  CONSTRAINT [FK_m_formacoes_formacoes] FOREIGN KEY([formacao_id])
REFERENCES [dbo].[formacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[m_formacoes] CHECK CONSTRAINT [FK_m_formacoes_formacoes]
GO
ALTER TABLE [dbo].[modelos_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_modelos_equipamento_categoria] FOREIGN KEY([categoria_id])
REFERENCES [dbo].[categorias_equipamento] ([id])
GO
ALTER TABLE [dbo].[modelos_equipamento] CHECK CONSTRAINT [FK_modelos_equipamento_categoria]
GO
ALTER TABLE [dbo].[modelos_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_modelos_equipamento_marca] FOREIGN KEY([marca_id])
REFERENCES [dbo].[marcas] ([id])
GO
ALTER TABLE [dbo].[modelos_equipamento] CHECK CONSTRAINT [FK_modelos_equipamento_marca]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [FK_tickets_historico_ticket] FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [FK_tickets_historico_ticket]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [FK_tickets_historico_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [FK_tickets_historico_utilizador]
GO
ALTER TABLE [dbo].[transacoes]  WITH CHECK ADD FOREIGN KEY([criado_por])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[transacoes]  WITH CHECK ADD FOREIGN KEY([documento_id])
REFERENCES [dbo].[documentos] ([id])
GO
ALTER TABLE [dbo].[transacoes_itens]  WITH CHECK ADD  CONSTRAINT [FK_transacoes_itens_transacao] FOREIGN KEY([transacao_id])
REFERENCES [dbo].[transacoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[transacoes_itens] CHECK CONSTRAINT [FK_transacoes_itens_transacao]
GO
ALTER TABLE [dbo].[utilizador_empresa]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_empresa_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_empresa] CHECK CONSTRAINT [FK_utilizador_empresa_empresa]
GO
ALTER TABLE [dbo].[utilizador_empresa]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_empresa_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_empresa] CHECK CONSTRAINT [FK_utilizador_empresa_utilizador]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_permissao_permissao] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_utilizador_permissao_permissao]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_permissao_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_utilizador_permissao_utilizador]
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD  CONSTRAINT [FK_utilizadores_cliente] FOREIGN KEY([cliente_id])
REFERENCES [dbo].[clientes] ([id])
GO
ALTER TABLE [dbo].[utilizadores] CHECK CONSTRAINT [FK_utilizadores_cliente]
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD  CONSTRAINT [FK_utilizadores_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[utilizadores] CHECK CONSTRAINT [FK_utilizadores_funcionario]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [FK_veiculos_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [FK_veiculos_empresa]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_veiculos_valores_veiculo] FOREIGN KEY([veiculo_id])
REFERENCES [dbo].[veiculos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] CHECK CONSTRAINT [FK_veiculos_valores_veiculo]
GO
ALTER TABLE [dbo].[a_formacoes]  WITH CHECK ADD CHECK  (([tipo]='outro' OR [tipo]='audio' OR [tipo]='imagem' OR [tipo]='pdf' OR [tipo]='texto' OR [tipo]='video'))
GO
ALTER TABLE [dbo].[a_formacoes_blocos]  WITH CHECK ADD CHECK  (([tipo]='outro' OR [tipo]='audio' OR [tipo]='pdf' OR [tipo]='imagem' OR [tipo]='video' OR [tipo]='texto'))
GO
ALTER TABLE [dbo].[a_formacoes_comentarios]  WITH CHECK ADD CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO
ALTER TABLE [dbo].[anexos]  WITH CHECK ADD  CONSTRAINT [CHK_anexos_tipo] CHECK  (([tipo]='zip' OR [tipo]='csv' OR [tipo]='txt' OR [tipo]='xlsx' OR [tipo]='xls' OR [tipo]='docx' OR [tipo]='doc' OR [tipo]='pdf' OR [tipo]='png' OR [tipo]='jpeg' OR [tipo]='jpg'))
GO
ALTER TABLE [dbo].[anexos] CHECK CONSTRAINT [CHK_anexos_tipo]
GO
ALTER TABLE [dbo].[contatos]  WITH CHECK ADD  CONSTRAINT [CHK_contatos_tipo] CHECK  (([tipo]='whatsapp' OR [tipo]='email' OR [tipo]='celular' OR [tipo]='telefone'))
GO
ALTER TABLE [dbo].[contatos] CHECK CONSTRAINT [CHK_contatos_tipo]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [CHK_conteudo_anexo_tipo] CHECK  (([tipo_anexo]='outro' OR [tipo_anexo]='audio' OR [tipo_anexo]='documento' OR [tipo_anexo]='video' OR [tipo_anexo]='imagem'))
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [CHK_conteudo_anexo_tipo]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [CHK_conteudos_status] CHECK  (([status]='em_revisao' OR [status]='agendado' OR [status]='arquivado' OR [status]='publicado' OR [status]='rascunho'))
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [CHK_conteudos_status]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [CHK_conteudos_visibilidade] CHECK  (([visibilidade]='grupo_empresas' OR [visibilidade]='publica' OR [visibilidade]='privada'))
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [CHK_conteudos_visibilidade]
GO
ALTER TABLE [dbo].[dependentes]  WITH CHECK ADD  CONSTRAINT [CHK_dependentes_parentesco] CHECK  (([parentesco]='Outro' OR [parentesco]='Irmã' OR [parentesco]='Irmão' OR [parentesco]='Mãe' OR [parentesco]='Pai' OR [parentesco]='Cônjuge' OR [parentesco]='Filha' OR [parentesco]='Filho'))
GO
ALTER TABLE [dbo].[dependentes] CHECK CONSTRAINT [CHK_dependentes_parentesco]
GO
ALTER TABLE [dbo].[empresas]  WITH CHECK ADD CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO
ALTER TABLE [dbo].[enderecos]  WITH CHECK ADD  CONSTRAINT [CHK_enderecos_tipo] CHECK  (([tipo]='correspondencia' OR [tipo]='comercial' OR [tipo]='residencial'))
GO
ALTER TABLE [dbo].[enderecos] CHECK CONSTRAINT [CHK_enderecos_tipo]
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas]  WITH CHECK ADD  CONSTRAINT [CHK_tipo_pergunta] CHECK  (([tipo]='aberta' OR [tipo]='multipla'))
GO
ALTER TABLE [dbo].[formacoes_quiz_perguntas] CHECK CONSTRAINT [CHK_tipo_pergunta]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_qualidade]>=(1) AND [rating_qualidade]<=(5)))
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_pontualidade]>=(1) AND [rating_pontualidade]<=(5)))
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_preco]>=(1) AND [rating_preco]<=(5)))
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_estado_civil] CHECK  (([estado_civil]='União de Facto' OR [estado_civil]='Viúvo(a)' OR [estado_civil]='Divorciado(a)' OR [estado_civil]='Casado(a)' OR [estado_civil]='Solteiro(a)'))
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [CHK_funcionarios_estado_civil]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_sexo] CHECK  (([sexo]='O' OR [sexo]='F' OR [sexo]='M'))
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [CHK_funcionarios_sexo]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [CHK_intervencoes_tipo] CHECK  (([tipo]='upgrade' OR [tipo]='configuracao' OR [tipo]='instalacao' OR [tipo]='preditiva' OR [tipo]='preventiva' OR [tipo]='corretiva'))
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [CHK_intervencoes_tipo]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [CHK_intervencoes_anexos_tipo] CHECK  (([tipo_documento]='outro' OR [tipo_documento]='manual' OR [tipo_documento]='foto_depois' OR [tipo_documento]='foto_antes' OR [tipo_documento]='relatorio' OR [tipo_documento]='certificado' OR [tipo_documento]='orcamento' OR [tipo_documento]='fatura'))
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [CHK_intervencoes_anexos_tipo]
GO
ALTER TABLE [dbo].[permissoes]  WITH CHECK ADD  CONSTRAINT [CHK_permissoes_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Concluir' OR [tipo]='Atribuir' OR [tipo]='Aprovar' OR [tipo]='Importar' OR [tipo]='Exportar' OR [tipo]='Apagar' OR [tipo]='Editar' OR [tipo]='Visualizar' OR [tipo]='Listar' OR [tipo]='Criar'))
GO
ALTER TABLE [dbo].[permissoes] CHECK CONSTRAINT [CHK_permissoes_tipo]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_avaliacao] CHECK  (([avaliacao] IS NULL OR [avaliacao]>=(1) AND [avaliacao]<=(5)))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_tickets_avaliacao]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_prioridade] CHECK  (([prioridade]='urgente' OR [prioridade]='alta' OR [prioridade]='media' OR [prioridade]='baixa'))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_tickets_prioridade]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_historico_tipo] CHECK  (([tipo_acao]='avaliacao' OR [tipo_acao]='anexo_adicionado' OR [tipo_acao]='atribuicao' OR [tipo_acao]='prioridade_alterada' OR [tipo_acao]='status_alterado' OR [tipo_acao]='comentario'))
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [CHK_tickets_historico_tipo]
GO
ALTER TABLE [dbo].[transacoes]  WITH CHECK ADD CHECK  (([tipo_transacao]='ajuste' OR [tipo_transacao]='compra' OR [tipo_transacao]='venda' OR [tipo_transacao]='pagamento' OR [tipo_transacao]='transferencia'))
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD CHECK  (([tipo_utilizador]='fornecedor' OR [tipo_utilizador]='cliente' OR [tipo_utilizador]='interno'))
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_combustivel] CHECK  (([combustivel]='Outro' OR [combustivel]='GPL' OR [combustivel]='GNC' OR [combustivel]='Híbrido' OR [combustivel]='Elétrico' OR [combustivel]='Diesel' OR [combustivel]='Gasolina'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_combustivel]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Moto' OR [tipo]='Ligeiro' OR [tipo]='Autocarro'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_tipo]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Armazena os quizzes/testes das formações com configurações de tempo, nota mínima e tentativas' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'formacoes_quiz'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Opções de resposta para perguntas de múltipla escolha (4 opções)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'formacoes_quiz_opcoes'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Perguntas do quiz - podem ser de múltipla escolha ou abertas' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'formacoes_quiz_perguntas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Armazena as respostas individuais de cada pergunta numa tentativa' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'formacoes_quiz_respostas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Regista cada tentativa de um aluno em realizar um quiz' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'formacoes_quiz_tentativas'
GO
USE [master]
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  READ_WRITE 
GO
