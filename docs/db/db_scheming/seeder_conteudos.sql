/****************************************************************************/
/* DADOS INICIAIS - MÓDULO CONTEÚDOS                                       */
/* Tipos de conteúdo pré-configurados                                      */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* TIPOS DE CONTEÚDO PADRÃO                                                 */
/******************************************************************************/

-- Limpar dados existentes (cuidado em produção!)
-- DELETE FROM [dbo].[tipos_conteudo];
-- DBCC CHECKIDENT ('[dbo].[tipos_conteudo]', RESEED, 0);

SET IDENTITY_INSERT [dbo].[tipos_conteudo] ON;

INSERT INTO [dbo].[tipos_conteudo] 
    ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], 
     [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo])
VALUES 
-- 1. NOTÍCIA
(1, 'NOTICIA', 'Notícia', 'Notícias e comunicados da empresa', 'newspaper', 1, 1, 10, 1, 0, 'noticia',
'
{
  "campos_personalizados": [
    {"codigo": "fonte", "nome": "Fonte", "tipo": "text", "obrigatorio": false},
    {"codigo": "localizacao", "nome": "Localização", "tipo": "text", "obrigatorio": false},
    {"codigo": "urgente", "nome": "Notícia Urgente", "tipo": "boolean", "obrigatorio": false}
  ]
}
', 1),

-- 2. EVENTO
(2, 'EVENTO', 'Evento', 'Eventos, workshops e atividades', 'calendar', 1, 1, 20, 1, 0, 'evento',
'
{
  "campos_personalizados": [
    {"codigo": "local", "nome": "Local do Evento", "tipo": "text", "obrigatorio": true},
    {"codigo": "endereco", "nome": "Endereço Completo", "tipo": "textarea", "obrigatorio": false},
    {"codigo": "hora_inicio", "nome": "Hora de Início", "tipo": "text", "obrigatorio": true},
    {"codigo": "hora_fim", "nome": "Hora de Término", "tipo": "text", "obrigatorio": false},
    {"codigo": "vagas", "nome": "Número de Vagas", "tipo": "number", "obrigatorio": false},
    {"codigo": "inscricao_link", "nome": "Link de Inscrição", "tipo": "url", "obrigatorio": false},
    {"codigo": "valor", "nome": "Valor da Inscrição", "tipo": "decimal", "obrigatorio": false},
    {"codigo": "gratuito", "nome": "Evento Gratuito", "tipo": "boolean", "obrigatorio": false},
    {"codigo": "organizador", "nome": "Organizador", "tipo": "text", "obrigatorio": false},
    {"codigo": "contato", "nome": "Contato", "tipo": "phone", "obrigatorio": false}
  ]
}
', 1),

-- 3. BANNER
(3, 'BANNER', 'Banner', 'Banners promocionais e destaques', 'image', 0, 1, 5, 0, 0, 'banner',
'
{
  "campos_personalizados": [
    {"codigo": "link_destino", "nome": "Link de Destino", "tipo": "url", "obrigatorio": false},
    {"codigo": "abrir_nova_aba", "nome": "Abrir em Nova Aba", "tipo": "boolean", "obrigatorio": false},
    {"codigo": "posicao", "nome": "Posição", "tipo": "select", "opcoes": ["home_topo", "home_meio", "home_rodape", "lateral"], "obrigatorio": true},
    {"codigo": "largura", "nome": "Largura (px)", "tipo": "number", "obrigatorio": false},
    {"codigo": "altura", "nome": "Altura (px)", "tipo": "number", "obrigatorio": false},
    {"codigo": "botao_texto", "nome": "Texto do Botão", "tipo": "text", "obrigatorio": false},
    {"codigo": "botao_cor", "nome": "Cor do Botão", "tipo": "color", "obrigatorio": false}
  ]
}
', 1),

-- 4. ANÚNCIO
(4, 'ANUNCIO', 'Anúncio', 'Anúncios e classificados internos', 'bullhorn', 1, 1, 10, 1, 1, 'anuncio',
'
{
  "campos_personalizados": [
    {"codigo": "categoria_anuncio", "nome": "Categoria", "tipo": "select", "opcoes": ["venda", "compra", "aluguel", "servicos", "outros"], "obrigatorio": true},
    {"codigo": "preco", "nome": "Preço", "tipo": "decimal", "obrigatorio": false},
    {"codigo": "negociavel", "nome": "Preço Negociável", "tipo": "boolean", "obrigatorio": false},
    {"codigo": "contato_nome", "nome": "Nome para Contato", "tipo": "text", "obrigatorio": true},
    {"codigo": "contato_telefone", "nome": "Telefone", "tipo": "phone", "obrigatorio": true},
    {"codigo": "contato_email", "nome": "Email", "tipo": "email", "obrigatorio": false},
    {"codigo": "localizacao", "nome": "Localização", "tipo": "text", "obrigatorio": false}
  ]
}
', 1),

-- 5. COMUNICADO
(5, 'COMUNICADO', 'Comunicado Interno', 'Comunicados oficiais da empresa', 'megaphone', 0, 1, 5, 0, 1, 'comunicado',
'
{
  "campos_personalizados": [
    {"codigo": "prioridade", "nome": "Prioridade", "tipo": "select", "opcoes": ["baixa", "normal", "alta", "urgente"], "obrigatorio": true},
    {"codigo": "departamento", "nome": "Departamento", "tipo": "text", "obrigatorio": false},
    {"codigo": "destinatarios", "nome": "Destinatários", "tipo": "multiselect", "opcoes": ["todos", "gestores", "rh", "ti", "financeiro"], "obrigatorio": false},
    {"codigo": "requer_confirmacao", "nome": "Requer Confirmação de Leitura", "tipo": "boolean", "obrigatorio": false}
  ]
}
', 1),

-- 6. DOCUMENTO
(6, 'DOCUMENTO', 'Documento', 'Documentos, políticas e procedimentos', 'file-text', 0, 1, 20, 0, 1, 'documento',
'
{
  "campos_personalizados": [
    {"codigo": "tipo_documento", "nome": "Tipo", "tipo": "select", "opcoes": ["politica", "procedimento", "manual", "formulario", "outro"], "obrigatorio": true},