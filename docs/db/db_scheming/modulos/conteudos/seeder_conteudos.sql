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
    {"codigo": "versao", "nome": "Versão", "tipo": "text", "obrigatorio": false},
    {"codigo": "aprovador", "nome": "Aprovado por", "tipo": "text", "obrigatorio": false},
    {"codigo": "data_aprovacao", "nome": "Data de Aprovação", "tipo": "date", "obrigatorio": false},
    {"codigo": "area_responsavel", "nome": "Área Responsável", "tipo": "text", "obrigatorio": false},
    {"codigo": "codigo_documento", "nome": "Código do Documento", "tipo": "text", "obrigatorio": false}
  ]
}
', 1),

-- 7. GALERIA
(7, 'GALERIA', 'Galeria de Fotos', 'Álbuns e galerias de imagens', 'images', 0, 1, 100, 1, 0, 'galeria',
'
{
  "campos_personalizados": [
    {"codigo": "fotografo", "nome": "Fotógrafo", "tipo": "text", "obrigatorio": false},
    {"codigo": "data_evento", "nome": "Data do Evento", "tipo": "date", "obrigatorio": false},
    {"codigo": "local_evento", "nome": "Local", "tipo": "text", "obrigatorio": false},
    {"codigo": "album", "nome": "Álbum", "tipo": "text", "obrigatorio": false}
  ]
}
', 1),

-- 8. VÍDEO
(8, 'VIDEO', 'Vídeo', 'Vídeos institucionais e tutoriais', 'video', 1, 1, 5, 0, 0, 'video',
'
{
  "campos_personalizados": [
    {"codigo": "video_url", "nome": "URL do Vídeo", "tipo": "url", "obrigatorio": true},
    {"codigo": "plataforma", "nome": "Plataforma", "tipo": "select", "opcoes": ["youtube", "vimeo", "proprio"], "obrigatorio": true},
    {"codigo": "duracao", "nome": "Duração", "tipo": "text", "obrigatorio": false},
    {"codigo": "idioma", "nome": "Idioma", "tipo": "select", "opcoes": ["pt", "en", "es", "fr"], "obrigatorio": false},
    {"codigo": "legendas", "nome": "Possui Legendas", "tipo": "boolean", "obrigatorio": false}
  ]
}
', 1),

-- 9. FAQ
(9, 'FAQ', 'Pergunta Frequente', 'Perguntas e respostas frequentes', 'help-circle', 0, 0, 0, 0, 0, 'faq',
'
{
  "campos_personalizados": [
    {"codigo": "pergunta", "nome": "Pergunta", "tipo": "text", "obrigatorio": true},
    {"codigo": "resposta", "nome": "Resposta", "tipo": "textarea", "obrigatorio": true},
    {"codigo": "palavras_chave", "nome": "Palavras-chave", "tipo": "text", "obrigatorio": false},
    {"codigo": "ordem_exibicao", "nome": "Ordem de Exibição", "tipo": "number", "obrigatorio": false}
  ]
}
', 1),

-- 10. BENEFÍCIO
(10, 'BENEFICIO', 'Benefício', 'Benefícios e vantagens para colaboradores', 'gift', 0, 1, 10, 0, 0, 'beneficio',
'
{
  "campos_personalizados": [
    {"codigo": "tipo_beneficio", "nome": "Tipo", "tipo": "select", "opcoes": ["desconto", "parceria", "convenio", "outro"], "obrigatorio": true},
    {"codigo": "empresa_parceira", "nome": "Empresa Parceira", "tipo": "text", "obrigatorio": false},
    {"codigo": "desconto_percentual", "nome": "Desconto (%)", "tipo": "number", "obrigatorio": false},
    {"codigo": "como_usar", "nome": "Como Usar", "tipo": "textarea", "obrigatorio": false},
    {"codigo": "codigo_promocional", "nome": "Código Promocional", "tipo": "text", "obrigatorio": false},
    {"codigo": "site", "nome": "Site", "tipo": "url", "obrigatorio": false},
    {"codigo": "telefone_contato", "nome": "Telefone", "tipo": "phone", "obrigatorio": false}
  ]
}
', 1),

-- 11. VAGA DE EMPREGO
(11, 'VAGA', 'Vaga de Emprego', 'Oportunidades de carreira', 'briefcase', 1, 1, 5, 0, 1, 'vaga',
'
{
  "campos_personalizados": [
    {"codigo": "cargo", "nome": "Cargo", "tipo": "text", "obrigatorio": true},
    {"codigo": "departamento", "nome": "Departamento", "tipo": "text", "obrigatorio": false},
    {"codigo": "tipo_contrato", "nome": "Tipo de Contrato", "tipo": "select", "opcoes": ["CLT", "PJ", "Estagio", "Temporario"], "obrigatorio": true},
    {"codigo": "local_trabalho", "nome": "Local de Trabalho", "tipo": "text", "obrigatorio": true},
    {"codigo": "remoto", "nome": "Trabalho Remoto", "tipo": "select", "opcoes": ["presencial", "hibrido", "remoto"], "obrigatorio": true},
    {"codigo": "salario_min", "nome": "Salário Mínimo", "tipo": "decimal", "obrigatorio": false},
    {"codigo": "salario_max", "nome": "Salário Máximo", "tipo": "decimal", "obrigatorio": false},
    {"codigo": "requisitos", "nome": "Requisitos", "tipo": "textarea", "obrigatorio": true},
    {"codigo": "diferenciais", "nome": "Diferenciais", "tipo": "textarea", "obrigatorio": false},
    {"codigo": "beneficios", "nome": "Benefícios", "tipo": "textarea", "obrigatorio": false},
    {"codigo": "email_candidatura", "nome": "Email para Candidatura", "tipo": "email", "obrigatorio": true},
    {"codigo": "vagas_disponiveis", "nome": "Número de Vagas", "tipo": "number", "obrigatorio": false}
  ]
}
', 1),

-- 12. QUESTIONÁRIOS
(12, 'QUESTIONARIOS', 'Questionários', 'Pesquisas e questionários', 'bar-chart', 0, 0, 0, 0, 0, 'questionarios',
'
{
  "campos_personalizados": [
    {"codigo": "pergunta", "nome": "Pergunta", "tipo": "text", "obrigatorio": true},
    {"codigo": "opcoes", "nome": "Opções de Resposta", "tipo": "json", "obrigatorio": true, "descricao": "Array JSON com as opcoes"},
    {"codigo": "multipla_escolha", "nome": "Permite Múltipla Escolha", "tipo": "boolean", "obrigatorio": false},
    {"codigo": "anonimo", "nome": "Voto Anônimo", "tipo": "boolean", "obrigatorio": false},
    {"codigo": "mostrar_resultados", "nome": "Mostrar Resultados", "tipo": "boolean", "obrigatorio": false}
  ]
}
', 1);