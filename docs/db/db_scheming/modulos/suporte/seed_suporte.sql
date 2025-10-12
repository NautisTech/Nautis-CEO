/****************************************************************************/
/* DADOS INICIAIS - MÓDULO SUPORTE                                         */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* CATEGORIAS DE EQUIPAMENTO                                                */
/******************************************************************************/

SET IDENTITY_INSERT [dbo].[categorias_equipamento] ON;

INSERT INTO [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [ativo])
VALUES 
(1, 'Informática', 'Equipamentos de TI', 'monitor', '#3B82F6', 1),
(2, 'Periféricos', 'Teclados, mouses, impressoras', 'printer', '#10B981', 1),
(3, 'Redes', 'Switches, routers, access points', 'wifi', '#8B5CF6', 1),
(4, 'Telefonia', 'Telefones e sistemas de comunicação', 'phone', '#F59E0B', 1),
(5, 'Audiovisual', 'Projetores, câmeras, microfones', 'video', '#EF4444', 1),
(6, 'Climatização', 'Ar condicionado, ventilação', 'wind', '#06B6D4', 1),
(7, 'Segurança', 'Câmeras, alarmes, controle de acesso', 'shield', '#EC4899', 1),
(8, 'Móveis', 'Mesas, cadeiras, armários', 'home', '#6B7280', 1);

SET IDENTITY_INSERT [dbo].[categorias_equipamento] OFF;
GO

/******************************************************************************/
/* MARCAS                                                                    */
/******************************************************************************/

SET IDENTITY_INSERT [dbo].[marcas] ON;

INSERT INTO [dbo].[marcas] ([id], [nome], [website], [ativo])
VALUES 
(1, 'Dell', 'https://www.dell.com', 1),
(2, 'HP', 'https://www.hp.com', 1),
(3, 'Lenovo', 'https://www.lenovo.com', 1),
(4, 'Apple', 'https://www.apple.com', 1),
(5, 'Samsung', 'https://www.samsung.com', 1),
(6, 'Cisco', 'https://www.cisco.com', 1),
(7, 'TP-Link', 'https://www.tp-link.com', 1),
(8, 'Logitech', 'https://www.logitech.com', 1),
(9, 'Canon', 'https://www.canon.com', 1),
(10, 'Epson', 'https://www.epson.com', 1),
(11, 'LG', 'https://www.lg.com', 1),
(12, 'Sony', 'https://www.sony.com', 1),
(13, 'Hikvision', 'https://www.hikvision.com', 1),
(14, 'Dahua', 'https://www.dahuasecurity.com', 1),
(15, 'Panasonic', 'https://www.panasonic.com', 1);

SET IDENTITY_INSERT [dbo].[marcas] OFF;
GO

/******************************************************************************/
/* TIPOS DE TICKET                                                          */
/******************************************************************************/

SET IDENTITY_INSERT [dbo].[tipos_ticket] ON;

INSERT INTO [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo])
VALUES 
(1, 'Incidente', 'Problema que afeta o serviço', '#EF4444', 'alert-circle', 4, 1),
(2, 'Requisição', 'Solicitação de serviço ou informação', '#3B82F6', 'inbox', 24, 1),
(3, 'Manutenção Preventiva', 'Manutenção agendada', '#10B981', 'tool', 48, 1),
(4, 'Instalação', 'Instalação de novo equipamento', '#F59E0B', 'settings', 48, 1),
(5, 'Configuração', 'Alteração de configuração', '#8B5CF6', 'sliders', 8, 1),
(6, 'Consultoria', 'Dúvidas e orientações', '#06B6D4', 'help-circle', 24, 1),
(7, 'Urgente', 'Problema crítico', '#DC2626', 'zap', 1, 1);

SET IDENTITY_INSERT [dbo].[tipos_ticket] OFF;
GO

/******************************************************************************/
/* MODELOS DE EQUIPAMENTO (EXEMPLOS)                                       */
/******************************************************************************/

SET IDENTITY_INSERT [dbo].[modelos_equipamento] ON;

INSERT INTO [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [ativo])
VALUES 
-- Informática
(1, 1, 1, 'Latitude 7420', 'DELL-LAT7420', 'Notebook Dell Latitude 14" i7', 1),
(2, 1, 1, 'OptiPlex 7090', 'DELL-OPT7090', 'Desktop Dell OptiPlex i7', 1),
(3, 2, 1, 'EliteBook 840 G8', 'HP-EB840G8', 'Notebook HP EliteBook 14" i7', 1),
(4, 3, 1, 'ThinkPad X1 Carbon', 'LEN-X1C', 'Notebook Lenovo ThinkPad 14" i7', 1),
(5, 4, 1, 'MacBook Pro 14"', 'APPLE-MBP14', 'MacBook Pro 14" M3 Pro', 1),

-- Periféricos
(6, 8, 2, 'MX Master 3S', 'LOG-MXM3S', 'Mouse Logitech MX Master', 1),
(7, 8, 2, 'MX Keys', 'LOG-MXKEYS', 'Teclado Logitech MX Keys', 1),
(8, 9, 2, 'Pixma G3260', 'CAN-G3260', 'Impressora Canon Multifuncional', 1),
(9, 10, 2, 'EcoTank L3250', 'EPS-L3250', 'Impressora Epson EcoTank', 1),

-- Redes
(10, 6, 3, 'Catalyst 2960-X', 'CIS-C2960X', 'Switch Cisco 24 portas', 1),
(11, 7, 3, 'Archer AX73', 'TPL-AX73', 'Router TP-Link WiFi 6', 1),
(12, 7, 3, 'EAP660 HD', 'TPL-EAP660', 'Access Point TP-Link WiFi 6', 1),

-- Audiovisual
(13, 10, 5, 'EB-2250U', 'EPS-EB2250', 'Projetor Epson Full HD', 1),
(14, 8, 5, 'Brio 500', 'LOG-BRIO500', 'Webcam Logitech 4K', 1),

-- Segurança
(15, 13, 7, 'DS-2CD2385G1', 'HIK-2CD2385', 'Câmera IP Hikvision 8MP', 1),
(16, 14, 7, 'IPC-HFW5831E', 'DAH-HFW5831', 'Câmera IP Dahua 8MP', 1),

-- Telefonia
(17, 15, 4, 'KX-UT670', 'PAN-UT670', 'Telefone IP Panasonic', 1),

-- Climatização
(18, 11, 6, 'Split 12000 BTU', 'LG-S12K', 'Ar Condicionado LG Dual Inverter', 1);

SET IDENTITY_INSERT [dbo].[modelos_equipamento] OFF;
GO

/******************************************************************************/
/* PERMISSÕES DO MÓDULO SUPORTE                                            */
/******************************************************************************/

INSERT INTO [dbo].[permissoes] ([codigo], [nome], [descricao], [modulo], [tipo])
VALUES 
-- Equipamentos
('EQUIPAMENTOS:Criar', 'Criar Equipamentos', 'Permite cadastrar novos equipamentos', 'Suporte', 'Criar'),
('EQUIPAMENTOS:Listar', 'Listar Equipamentos', 'Permite visualizar lista de equipamentos', 'Suporte', 'Listar'),
('EQUIPAMENTOS:Visualizar', 'Visualizar Equipamentos', 'Permite ver detalhes de equipamentos', 'Suporte', 'Visualizar'),
('EQUIPAMENTOS:Editar', 'Editar Equipamentos', 'Permite editar equipamentos', 'Suporte', 'Editar'),
('EQUIPAMENTOS:Apagar', 'Apagar Equipamentos', 'Permite excluir equipamentos', 'Suporte', 'Apagar'),

-- Tickets
('TICKETS:Criar', 'Criar Tickets', 'Permite abrir novos tickets', 'Suporte', 'Criar'),
('TICKETS:Listar', 'Listar Tickets', 'Permite visualizar lista de tickets', 'Suporte', 'Listar'),
('TICKETS:Visualizar', 'Visualizar Tickets', 'Permite ver detalhes de tickets', 'Suporte', 'Visualizar'),
('TICKETS:Editar', 'Editar Tickets', 'Permite editar tickets', 'Suporte', 'Editar'),
('TICKETS:Atribuir', 'Atribuir Tickets', 'Permite atribuir tickets a técnicos', 'Suporte', 'Atribuir'),
('TICKETS:Fechar', 'Fechar Tickets', 'Permite fechar tickets', 'Suporte', 'Concluir'),

-- Intervenções
('INTERVENCOES:Criar', 'Criar Intervenções', 'Permite registrar intervenções', 'Suporte', 'Criar'),
('INTERVENCOES:Listar', 'Listar Intervenções', 'Permite visualizar lista de intervenções', 'Suporte', 'Listar'),
('INTERVENCOES:Visualizar', 'Visualizar Intervenções', 'Permite ver detalhes de intervenções', 'Suporte', 'Visualizar'),
('INTERVENCOES:Editar', 'Editar Intervenções', 'Permite editar intervenções', 'Suporte', 'Editar'),

-- Relatórios
('SUPORTE:Relatorios', 'Relatórios de Suporte', 'Permite visualizar relatórios e estatísticas', 'Suporte', 'Exportar');
GO

/******************************************************************************/
/* EXEMPLO DE DADOS (OPCIONAL)                                             */
/******************************************************************************/

/*
-- Exemplo: Criar um equipamento
INSERT INTO [dbo].[equipamentos] 
    (empresa_id, modelo_id, numero_serie, numero_interno, descricao, localizacao, estado, data_aquisicao, valor_aquisicao)
VALUES 
    (1, 1, 'SN123456789', 'NB-001', 'Notebook Dell Latitude - João Silva', 'Departamento TI - Sala 101', 'operacional', '2024-01-15', 1200.00);

-- Exemplo: Criar um ticket
EXEC [dbo].[sp_CriarTicket]
    @TipoTicketId = 1,
    @EquipamentoId = 1,
    @Titulo = 'Notebook não liga',
    @Descricao = 'O notebook não está ligando. LED de bateria acende mas tela permanece apagada.',
    @Prioridade = 'alta',
    @Localizacao = 'Sala 101',
    @SolicitanteId = 1;

-- Exemplo: Criar uma intervenção
EXEC [dbo].[sp_CriarIntervencao]
    @TicketId = 1,
    @EquipamentoId = 1,
    @Tipo = 'corretiva',
    @Titulo = 'Substituição de fonte de alimentação',
    @Descricao = 'Diagnóstico identificou problema na fonte de alimentação',
    @TecnicoId = 2,
    @DataInicio = '2025-01-10 09:00:00',
    @DataFim = '2025-01-10 10:30:00',
    @CustoMaoObra = 50.00,
    @Pecas = '[
        {
            "descricao": "Fonte de alimentação Dell 65W",
            "codigo_peca": "DELL-PSU-65W",
            "quantidade": 1,
            "valor_unitario": 85.00,
            "fornecedor": "Dell Inc"
        }
    ]';
*/

PRINT 'Dados iniciais do Módulo Suporte inseridos com sucesso!'
PRINT ''
PRINT 'Criados:'
PRINT '  - 8 Categorias de Equipamento'
PRINT '  - 15 Marcas'
PRINT '  - 7 Tipos de Ticket'
PRINT '  - 18 Modelos de Equipamento'
PRINT '  - Permissões do módulo'
GO

/******************************************************************************/
/* ATUALIZAR CEO_MAIN COM NOVA ENTIDADE                                    */
/******************************************************************************/

/*
-- Executar no CEO_Main para registrar as novas entidades

USE [CEO_Main]
GO

-- Adicionar módulo de Suporte
INSERT INTO [dbo].[modulos] ([codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao])
VALUES 
('SUPORTE', 'Suporte e Manutenção', 'Gestão de equipamentos, tickets e intervenções', 'tool', '/suporte', 6, 1, '1.0.0');

-- Adicionar entidade Equipamentos
INSERT INTO [dbo].[entidades_sistema] 
    ([codigo], [nome], [tabela_fisica], [descricao], [modulo_id], [permite_personalizacao], [campos_base], [ativo])
VALUES 
('EQUIPAMENTOS', 'Equipamentos', 'equipamentos', 'Gestão de ativos e equipamentos', 
 (SELECT id FROM modulos WHERE codigo = 'SUPORTE'), 
 1, 
 '{
   "campos": [
     {"codigo": "numero_interno", "nome": "Número Interno", "tipo": "text", "obrigatorio": true},
     {"codigo": "numero_serie", "nome": "Número de Série", "tipo": "text", "obrigatorio": false},
     {"codigo": "localizacao", "nome": "Localização", "tipo": "text", "obrigatorio": false},
     {"codigo": "estado", "nome": "Estado", "tipo": "select", "obrigatorio": true}
   ]
 }', 
 1);

-- Adicionar entidade Intervenções
INSERT INTO [dbo].[entidades_sistema] 
    ([codigo], [nome], [tabela_fisica], [descricao], [modulo_id], [permite_personalizacao], [campos_base], [ativo])
VALUES 
('INTERVENCOES', 'Intervenções', 'intervencoes', 'Intervenções e manutenções em equipamentos', 
 (SELECT id FROM modulos WHERE codigo = 'SUPORTE'), 
 1, 
 '{
   "campos": [
     {"codigo": "tipo", "nome": "Tipo", "tipo": "select", "obrigatorio": true},
     {"codigo": "titulo", "nome": "Título", "tipo": "text", "obrigatorio": true},
     {"codigo": "descricao", "nome": "Descrição", "tipo": "textarea", "obrigatorio": false}
   ]
 }', 
 1);

GO
*/

PRINT ''
PRINT '⚠️  IMPORTANTE: Execute o script comentado acima no CEO_Main'
PRINT '   para registrar o módulo de Suporte na base principal!'
GO