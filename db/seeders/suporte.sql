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
