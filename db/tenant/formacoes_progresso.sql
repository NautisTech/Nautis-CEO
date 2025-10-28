-- Tabela para tracking de progresso de aulas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'formacoes_aulas_progresso')
BEGIN
    CREATE TABLE formacoes_aulas_progresso (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT NOT NULL,
        aula_id INT NOT NULL,
        concluida BIT DEFAULT 0,
        tempo_assistido INT DEFAULT 0, -- em segundos
        ultima_visualizacao DATETIME,
        concluida_em DATETIME,
        criado_em DATETIME DEFAULT GETDATE(),
        atualizado_em DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_formacoes_aulas_progresso_cliente FOREIGN KEY (cliente_id) REFERENCES utilizadores(id),
        CONSTRAINT FK_formacoes_aulas_progresso_aula FOREIGN KEY (aula_id) REFERENCES a_formacoes_aulas(id),
        CONSTRAINT UQ_formacoes_aulas_progresso_cliente_aula UNIQUE (cliente_id, aula_id)
    );

    CREATE INDEX IX_formacoes_aulas_progresso_cliente ON formacoes_aulas_progresso(cliente_id);
    CREATE INDEX IX_formacoes_aulas_progresso_aula ON formacoes_aulas_progresso(aula_id);
END
GO
