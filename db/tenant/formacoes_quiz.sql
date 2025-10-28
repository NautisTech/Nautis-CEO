-- =============================================
-- Tabelas para Sistema de Quiz das Formações
-- =============================================

-- Tabela principal de Quiz
CREATE TABLE formacoes_quiz (
    id INT IDENTITY(1,1) PRIMARY KEY,
    formacao_id INT NOT NULL,
    titulo NVARCHAR(255) NOT NULL,
    descricao NVARCHAR(MAX) NULL,
    tempo_limite_minutos INT NULL,
    nota_minima_aprovacao INT NULL, -- Percentagem (0-100)
    mostrar_resultados BIT NOT NULL DEFAULT 1,
    permitir_tentativas_multiplas BIT NOT NULL DEFAULT 1,
    max_tentativas INT NULL,
    ativo BIT NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT GETDATE(),
    atualizado_em DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_quiz_formacao FOREIGN KEY (formacao_id)
        REFERENCES formacoes(id) ON DELETE CASCADE
);

-- Tabela de Perguntas do Quiz
CREATE TABLE formacoes_quiz_perguntas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    tipo NVARCHAR(50) NOT NULL, -- 'multipla' ou 'aberta'
    enunciado NVARCHAR(MAX) NOT NULL,
    pontuacao INT NOT NULL DEFAULT 1,
    ordem INT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT GETDATE(),
    atualizado_em DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_perguntas_quiz FOREIGN KEY (quiz_id)
        REFERENCES formacoes_quiz(id) ON DELETE CASCADE,
    CONSTRAINT CHK_tipo_pergunta CHECK (tipo IN ('multipla', 'aberta'))
);

-- Tabela de Opções de Resposta (apenas para perguntas de múltipla escolha)
CREATE TABLE formacoes_quiz_opcoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pergunta_id INT NOT NULL,
    texto NVARCHAR(500) NOT NULL,
    correta BIT NOT NULL DEFAULT 0,
    ordem INT NOT NULL,
    CONSTRAINT FK_opcoes_pergunta FOREIGN KEY (pergunta_id)
        REFERENCES formacoes_quiz_perguntas(id) ON DELETE CASCADE
);

-- Tabela de Tentativas dos Alunos (para tracking de respostas)
CREATE TABLE formacoes_quiz_tentativas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    utilizador_id INT NOT NULL,
    numero_tentativa INT NOT NULL DEFAULT 1,
    nota_obtida DECIMAL(5,2) NULL, -- Percentagem com decimais
    data_inicio DATETIME NOT NULL DEFAULT GETDATE(),
    data_conclusao DATETIME NULL,
    tempo_decorrido_minutos INT NULL,
    aprovado BIT NULL,
    CONSTRAINT FK_tentativas_quiz FOREIGN KEY (quiz_id)
        REFERENCES formacoes_quiz(id) ON DELETE CASCADE,
    CONSTRAINT FK_tentativas_utilizador FOREIGN KEY (utilizador_id)
        REFERENCES utilizadores(id)
);

-- Tabela de Respostas dos Alunos
CREATE TABLE formacoes_quiz_respostas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tentativa_id INT NOT NULL,
    pergunta_id INT NOT NULL,
    opcao_id INT NULL, -- Para perguntas de múltipla escolha
    resposta_texto NVARCHAR(MAX) NULL, -- Para perguntas abertas
    correta BIT NULL, -- Calculado automaticamente para múltipla, manual para aberta
    pontos_obtidos DECIMAL(5,2) NULL,
    respondida_em DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_respostas_tentativa FOREIGN KEY (tentativa_id)
        REFERENCES formacoes_quiz_tentativas(id) ON DELETE CASCADE,
    CONSTRAINT FK_respostas_pergunta FOREIGN KEY (pergunta_id)
        REFERENCES formacoes_quiz_perguntas(id),
    CONSTRAINT FK_respostas_opcao FOREIGN KEY (opcao_id)
        REFERENCES formacoes_quiz_opcoes(id)
);

-- Índices para melhor performance
CREATE INDEX IX_quiz_formacao ON formacoes_quiz(formacao_id);
CREATE INDEX IX_perguntas_quiz ON formacoes_quiz_perguntas(quiz_id);
CREATE INDEX IX_opcoes_pergunta ON formacoes_quiz_opcoes(pergunta_id);
CREATE INDEX IX_tentativas_quiz ON formacoes_quiz_tentativas(quiz_id);
CREATE INDEX IX_tentativas_utilizador ON formacoes_quiz_tentativas(utilizador_id);
CREATE INDEX IX_respostas_tentativa ON formacoes_quiz_respostas(tentativa_id);
CREATE INDEX IX_respostas_pergunta ON formacoes_quiz_respostas(pergunta_id);

-- Comentários explicativos
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Armazena os quizzes/testes das formações com configurações de tempo, nota mínima e tentativas',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'formacoes_quiz';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Perguntas do quiz - podem ser de múltipla escolha ou abertas',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'formacoes_quiz_perguntas';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Opções de resposta para perguntas de múltipla escolha (4 opções)',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'formacoes_quiz_opcoes';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Regista cada tentativa de um aluno em realizar um quiz',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'formacoes_quiz_tentativas';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Armazena as respostas individuais de cada pergunta numa tentativa',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'formacoes_quiz_respostas';
