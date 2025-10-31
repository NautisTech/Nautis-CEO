-- Migration: Add transacoes_itens junction table for many-to-many relationship
-- Allows linking transactions to multiple items (tickets, equipamentos, projetos, etc)

-- Create junction table
CREATE TABLE [dbo].[transacoes_itens](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [transacao_id] [int] NOT NULL,
    [item_tipo] [nvarchar](50) NOT NULL, -- 'ticket', 'equipamento', 'projeto', 'horas_projeto', 'intervencao', etc
    [item_id] [int] NOT NULL,
    [valor] [decimal](18, 2) NOT NULL, -- Valor específico deste item na transação
    [quantidade] [decimal](10, 2) NULL, -- Quantidade (ex: horas)
    [descricao] [nvarchar](500) NULL, -- Descrição específica do item
    [criado_em] [datetime] NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_transacoes_itens] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FK_transacoes_itens_transacao] FOREIGN KEY([transacao_id])
        REFERENCES [dbo].[transacoes] ([id]) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX [IX_transacoes_itens_transacao] ON [dbo].[transacoes_itens]([transacao_id]);
CREATE INDEX [IX_transacoes_itens_item] ON [dbo].[transacoes_itens]([item_tipo], [item_id]);

-- Add saldo (balance) column to transacoes for easier accounting
ALTER TABLE [dbo].[transacoes]
ADD [saldo_apos] [decimal](18, 2) NULL; -- Saldo após esta transação

-- Add metadata column for additional flexible data
ALTER TABLE [dbo].[transacoes]
ADD [metadata] [nvarchar](max) NULL; -- JSON field for additional flexible data

PRINT 'Migration completed: transacoes_itens junction table created successfully';
