# Refatoração da Tabela EMPRESAS
## Transformação de Segmentação Interna para Registo Completo de Cliente/Empresa

---

## 📋 RESUMO DAS ALTERAÇÕES

A tabela `empresas` foi transformada de uma simples ferramenta de segmentação interna para um **sistema completo de gestão de clientes, fornecedores e parceiros** (estilo CRM).

### Novos Campos Adicionados: **40 campos**

---

## 🗄️ ALTERAÇÕES NA BASE DE DADOS

### 1. Script de Migração SQL

**Ficheiro**: `c:\Git\Nautis-CEO\db\tenant\migrations\ALTER_empresas_to_full_company.sql`

**Executar em**: Todas as bases de dados tenant (ceo_tenant_*)

```bash
# Exemplo de execução
sqlcmd -S localhost -d ceo_tenant_microlopes -i "db/tenant/migrations/ALTER_empresas_to_full_company.sql"
```

### 2. Novos Campos por Categoria

#### 📝 Informação Fiscal e Legal
- `nome_comercial` (NVARCHAR(255)) - Nome comercial
- `nome_juridico` (NVARCHAR(255)) - Nome jurídico completo
- `tipo_empresa` (NVARCHAR(50)) - 'cliente', 'fornecedor', 'parceiro', 'interno'
- `natureza_juridica` (NVARCHAR(100)) - LDA, SA, Unipessoal, ENI
- `capital_social` (DECIMAL(15,2)) - Capital social
- `num_matricula` (NVARCHAR(50)) - Número de matrícula
- `data_constituicao` (DATE) - Data de constituição

#### 📞 Contactos
- `email` (NVARCHAR(255))
- `telefone` (NVARCHAR(50))
- `telemovel` (NVARCHAR(50))
- `fax` (NVARCHAR(50))
- `website` (NVARCHAR(255))

#### 📍 Moradas
**Morada Fiscal:**
- `morada_fiscal` (NVARCHAR(500))
- `codigo_postal` (NVARCHAR(20))
- `localidade` (NVARCHAR(100))
- `distrito` (NVARCHAR(100))
- `pais` (NVARCHAR(100)) - DEFAULT 'Portugal'

**Morada de Correspondência:**
- `morada_correspondencia` (NVARCHAR(500))
- `codigo_postal_correspondencia` (NVARCHAR(20))
- `localidade_correspondencia` (NVARCHAR(100))

#### 💼 Informação Comercial
- `num_cliente` (NVARCHAR(50)) - Número interno de cliente
- `num_fornecedor` (NVARCHAR(50)) - Número interno de fornecedor
- `segmento` (NVARCHAR(100)) - Segmento de mercado
- `setor_atividade` (NVARCHAR(100)) - Setor/CAE
- `codigo_cae` (NVARCHAR(20))
- `iban` (NVARCHAR(50))
- `swift_bic` (NVARCHAR(20))
- `banco` (NVARCHAR(100))

#### 💰 Condições Comerciais
- `condicoes_pagamento` (NVARCHAR(100)) - Ex: '30 dias', '60 dias'
- `metodo_pagamento_preferido` (NVARCHAR(50)) - Transferência, MB, Cheque
- `limite_credito` (DECIMAL(15,2))
- `desconto_comercial` (DECIMAL(5,2)) - Percentagem

#### 👤 Representantes/Contactos
- `pessoa_contacto` (NVARCHAR(255))
- `cargo_contacto` (NVARCHAR(100))
- `email_contacto` (NVARCHAR(255))
- `telefone_contacto` (NVARCHAR(50))

#### 📊 Informação Adicional
- `observacoes` (NVARCHAR(MAX))
- `tags` (NVARCHAR(500)) - Tags separadas por vírgula
- `rating` (INT) CHECK 1-5 - Classificação
- `estado` (NVARCHAR(50)) - 'ativo', 'inativo', 'pendente', 'suspenso' DEFAULT 'ativo'

#### 🔗 Integração com Sistemas Externos
- `ref_externa` (NVARCHAR(100)) - Referência em sistema externo
- `id_phc` (NVARCHAR(50)) - ID no PHC
- `sincronizado_phc` (BIT) DEFAULT 0
- `ultima_sincronizacao` (DATETIME2(7))

#### 🔐 Auditoria
- `criado_por` (INT) - ID do utilizador que criou
- `atualizado_por` (INT) - ID do utilizador que atualizou

### 3. Novos Índices

```sql
IX_empresas_tipo - Índice no tipo_empresa
IX_empresas_nif - Índice no NIF
IX_empresas_email - Índice no email
IX_empresas_estado - Índice no estado
IX_empresas_num_cliente - Índice no num_cliente
IX_empresas_ref_externa - Índice na ref_externa
```

---

## 🔧 ALTERAÇÕES NA API (NestJS)

### 1. DTO Atualizado

**Ficheiro**: `ceo_api/src/modules/empresas/dto/criar-empresa.dto.ts`

- ✅ Adicionados 40+ campos com validações
- ✅ Decoradores de validação: `@IsEmail()`, `@IsDateString()`, `@IsDecimal()`, `@Min()`, `@Max()`
- ✅ Enums para: `tipo_empresa`, `estado`
- ✅ Documentação Swagger completa com exemplos

### 2. Service Atualizado

**Ficheiro**: `ceo_api/src/modules/empresas/empresas.service.ts`

**Novos Métodos:**
- `criar()` - Suporta todos os 50+ campos
- `atualizar()` - Update dinâmico com helper `addField()`
- `listar()` - Filtros por tipo, estado, segmento, search
- `obterEstatisticas()` - Estatísticas de empresas

**Melhorias:**
- Auditoria automática (criado_por, atualizado_por)
- Suporte a filtros avançados
- Validação de dados

### 3. Novos Endpoints

```typescript
GET    /empresas?tipoEmpresa=cliente&estado=ativo&search=micro
GET    /empresas/:id
POST   /empresas  (com 50+ campos opcionais)
PUT    /empresas/:id  (update parcial)
GET    /empresas/estatisticas  (novo)
```

---

## 📊 CASOS DE USO

### 1. Registo de Cliente Completo

```json
{
  "codigo": "CLI001",
  "nome": "Microlopes LDA",
  "nomeComercial": "Microlopes",
  "nomeJuridico": "Microlopes - Comércio e Serviços, LDA",
  "tipoEmpresa": "cliente",
  "naturezaJuridica": "LDA",
  "capitalSocial": 50000.00,
  "nif": "123456789",
  "email": "geral@microlopes.pt",
  "telefone": "252123456",
  "website": "https://www.microlopes.pt",
  "moradaFiscal": "Rua da Empresa, nº 123",
  "codigoPostal": "4900-123",
  "localidade": "Viana do Castelo",
  "pais": "Portugal",
  "numCliente": "CLI001",
  "segmento": "Tecnologia",
  "condicoesPagamento": "30 dias",
  "limiteCredito": 10000.00,
  "pessoaContacto": "João Silva",
  "cargoContacto": "Diretor Comercial",
  "rating": 5,
  "estado": "ativo"
}
```

### 2. Integração com PHC

```typescript
// Sincronizar cliente do PHC
await empresasService.atualizar(tenantId, empresaId, {
  idPhc: 'PHC12345',
  refExterna: 'EXT001',
  sincronizadoPhc: true
}, userId);
```

### 3. Filtrar por Tipo

```typescript
// Listar apenas clientes ativos
const clientes = await empresasService.listar(tenantId, {
  tipoEmpresa: 'cliente',
  estado: 'ativo'
});

// Listar fornecedores por segmento
const fornecedores = await empresasService.listar(tenantId, {
  tipoEmpresa: 'fornecedor',
  segmento: 'Tecnologia'
});
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Base de Dados
- [ ] Executar script de migração `ALTER_empresas_to_full_company.sql` em cada tenant
- [ ] Verificar índices criados
- [ ] Testar queries com novos campos

### Backend (API)
- [x] Atualizar `CriarEmpresaDto`
- [x] Atualizar `AtualizarEmpresaDto` (extends PartialType)
- [x] Atualizar `empresas.service.ts`
- [x] Adicionar novo endpoint `/estatisticas`
- [ ] Atualizar controller com filtros nos query params
- [ ] Testes unitários

### Frontend
- [ ] Criar interface TypeScript com todos os campos
- [ ] Criar formulário completo de empresa (tabs por categoria)
- [ ] Atualizar tabela de empresas com filtros
- [ ] Criar página de detalhes de empresa
- [ ] Implementar tags component
- [ ] Implementar rating component (1-5 estrelas)

### Integração
- [ ] Criar serviço de sincronização com PHC
- [ ] Endpoint webhook para receber atualizações do PHC
- [ ] Mapeamento de campos PHC ↔️ CEO

### Documentação
- [x] Documentar alterações SQL
- [x] Documentar novos endpoints
- [ ] Atualizar Swagger/OpenAPI
- [ ] Manual do utilizador

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **Executar Migration SQL** em ambiente de desenvolvimento
2. **Testar API** com Postman/Insomnia
3. **Criar Frontend** (formulário multi-step com tabs)
4. **Implementar Sincronização PHC** se aplicável
5. **Criar Relatórios** de empresas (clientes, fornecedores, etc)

---

## 🔄 RETROCOMPATIBILIDADE

**IMPORTANTE**: Os campos originais foram mantidos:
- `codigo`
- `nome`
- `nif`
- `logo_url`
- `cor`
- `ativo`

Todos os novos campos são **NULLABLE** (opcionais), garantindo que:
- ✅ Código existente continua a funcionar
- ✅ Registos antigos permanecem válidos
- ✅ Migração gradual possível

---

## 📞 SUPORTE

Para dúvidas sobre esta refatoração, consultar:
- Script SQL: `db/tenant/migrations/ALTER_empresas_to_full_company.sql`
- DTO: `ceo_api/src/modules/empresas/dto/criar-empresa.dto.ts`
- Service: `ceo_api/src/modules/empresas/empresas.service.ts`
- Este documento: `docs/EMPRESAS_REFACTOR_SUMMARY.md`
