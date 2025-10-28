-- Trigger para sincronizar cliente_id entre tickets e intervenções
-- Quando o cliente_id de um ticket é atualizado, atualiza automaticamente
-- todas as intervenções associadas a esse ticket

-- Primeiro, deletar o trigger se já existir
IF OBJECT_ID('trg_sync_cliente_ticket_intervencoes', 'TR') IS NOT NULL
    DROP TRIGGER trg_sync_cliente_ticket_intervencoes;
GO

-- Criar o trigger
CREATE TRIGGER trg_sync_cliente_ticket_intervencoes
ON tickets
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar se o cliente_id foi alterado
    IF UPDATE(cliente_id)
    BEGIN
        -- Atualizar intervenções quando o cliente_id do ticket muda
        UPDATE i
        SET i.cliente_id = ins.cliente_id,
            i.atualizado_em = GETDATE()
        FROM intervencoes i
        INNER JOIN inserted ins ON i.ticket_id = ins.id
        INNER JOIN deleted del ON i.ticket_id = del.id
        WHERE ins.cliente_id IS NOT NULL
          AND (del.cliente_id IS NULL OR del.cliente_id <> ins.cliente_id);
    END
END;
GO

-- Também atualizar intervenções existentes que têm ticket_id mas não têm cliente_id
UPDATE i
SET i.cliente_id = t.cliente_id,
    i.atualizado_em = GETDATE()
FROM intervencoes i
INNER JOIN tickets t ON i.ticket_id = t.id
WHERE i.cliente_id IS NULL
  AND t.cliente_id IS NOT NULL;
GO

PRINT 'Trigger criado e dados históricos atualizados com sucesso!';
