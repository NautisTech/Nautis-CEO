# Portal de Cliente - Implementação Completa

## 📋 RESUMO

Sistema de **Portal de Cliente** que permite aos clientes externos da Microlopes (ou qualquer tenant) acederem ao CEO para:
- Ver seus próprios tickets
- Criar novos tickets
- Acompanhar intervenções
- Download de anexos
- Dashboard personalizada

---

## 🏗️ ARQUITETURA

### Conceito Multi-Nível

```
TENANT: Microlopes
├── UTILIZADORES INTERNOS (Funcionários)
│   ├── tipo_utilizador = 'interno'
│   ├── funcionario_id NOT NULL
│   ├── cliente_id NULL
│   └── Acesso: Dashboard completo + todas as funcionalidades
│
└── UTILIZADORES EXTERNOS (Clientes)
    ├── tipo_utilizador = 'cliente'
    ├── cliente_id NOT NULL
    ├── funcionario_id NULL
    └── Acesso: Portal limitado (/portal/*)
```

---

## 🗄️ BASE DE DADOS

### 1. Migration SQL

**Ficheiro**: `db/tenant/migrations/ADD_tipo_utilizador_portal_cliente.sql`

**Alterações:**

#### Tabela `utilizadores`
```sql
ALTER TABLE utilizadores
ADD tipo_utilizador NVARCHAR(50) NOT NULL
    CHECK (tipo_utilizador IN ('interno', 'cliente', 'fornecedor'));

-- Constraint de consistência
ADD CONSTRAINT CK_utilizadores_tipo_consistencia CHECK (
    (tipo_utilizador = 'interno' AND funcionario_id IS NOT NULL AND cliente_id IS NULL) OR
    (tipo_utilizador = 'cliente' AND cliente_id IS NOT NULL AND funcionario_id IS NULL) OR
    (tipo_utilizador = 'fornecedor')
);
```

#### Nova Tabela `anexos`
```sql
CREATE TABLE anexos (
    id INT PRIMARY KEY,
    nome_ficheiro NVARCHAR(255),
    caminho NVARCHAR(500),
    tamanho_bytes BIGINT,
    tipo_mime NVARCHAR(100),

    -- Relação genérica
    entidade_tipo NVARCHAR(50), -- 'ticket', 'intervencao'
    entidade_id INT,

    -- Segurança
    visivel_cliente BIT DEFAULT 0, -- ⭐ IMPORTANTE
    requer_autenticacao BIT DEFAULT 1,

    carregado_por INT,
    criado_em DATETIME2(7)
);
```

#### Views Criadas
- `vw_UtilizadoresCompleto` - Utilizadores com dados completos
- `vw_TicketsCliente` - Tickets criados por clientes

#### Stored Procedures
- `sp_ObterTicketsCliente` - Tickets filtrados por cliente
- `sp_ObterAnexosCliente` - Anexos visíveis por cliente

---

## 🔐 BACKEND (NestJS)

### 1. Guards de Autorização

#### `ClienteGuard`
```typescript
// Uso: @UseGuards(JwtAuthGuard, ClienteGuard)
// Permite APENAS utilizadores tipo 'cliente'
```

#### `InternoGuard`
```typescript
// Uso: @UseGuards(JwtAuthGuard, InternoGuard)
// Permite APENAS utilizadores tipo 'interno'
```

#### `TipoUtilizadorGuard` (Flexível)
```typescript
// Uso:
@TiposPermitidos('interno', 'cliente')
@UseGuards(JwtAuthGuard, TipoUtilizadorGuard)
```

### 2. PortalModule

**Ficheiros criados:**
- `portal.controller.ts` - Controller exclusivo para clientes
- `portal.service.ts` - Lógica de negócio com filtros de segurança
- `portal.module.ts` - Módulo isolado

**Endpoints disponíveis** (`/portal/*`):

#### Dashboard
```
GET /portal/dashboard
→ Estatísticas do cliente (tickets abertos, resolvidos, etc)
```

#### Tickets
```
GET    /portal/tickets          → Listar meus tickets
GET    /portal/tickets/:id      → Ver detalhes
POST   /portal/tickets          → Criar ticket
PUT    /portal/tickets/:id      → Atualizar (apenas descricao/localizacao)
GET    /portal/tickets/:id/historico
```

#### Intervenções
```
GET /portal/tickets/:ticketId/intervencoes
GET /portal/intervencoes/:id
```

#### Anexos
```
GET /portal/anexos?entidade_tipo=ticket&entidade_id=123
GET /portal/anexos/:id/download
```

#### Perfil
```
GET /portal/perfil
PUT /portal/perfil (limitado: apenas email)
```

### 3. Segurança Implementada

**Regras de Negócio:**

1. ✅ Cliente só vê **seus próprios tickets** (`WHERE solicitante_id = userId`)
2. ✅ Cliente só vê **anexos marcados como visíveis** (`WHERE visivel_cliente = 1`)
3. ✅ Cliente **não pode atribuir tickets** a técnicos
4. ✅ Cliente **não pode mudar status** do ticket
5. ✅ Cliente **não pode mudar prioridade**
6. ✅ Ao criar ticket, `solicitante_id` é **forçado** para o utilizador logado

**Exemplo de Query Segura:**
```typescript
// portal.service.ts → obterTicketCliente()
SELECT * FROM tickets t
WHERE t.id = @ticketId
  AND t.solicitante_id = @userId // ⭐ CRÍTICO
```

---

## 🎨 FRONTEND (A IMPLEMENTAR)

### Estrutura de Rotas

```
/apps/*           → Dashboard Interno (funcionários)
  ├── /apps/suporte/tickets
  ├── /apps/suporte/triagem
  └── /apps/equipamentos

/portal/*         → Portal Cliente (clientes externos)
  ├── /portal/dashboard
  ├── /portal/tickets
  ├── /portal/tickets/create
  ├── /portal/tickets/:id
  └── /portal/perfil
```

### Layout Diferenciado

```typescript
// app/[lang]/layout.tsx
const Layout = ({ children }) => {
  const { user } = useAuth();

  if (user.tipo_utilizador === 'cliente') {
    return <PortalClienteLayout>{children}</PortalClienteLayout>
  }

  return <DashboardInternoLayout>{children}</DashboardInternoLayout>
}
```

### Componentes a Criar

1. **PortalClienteLayout**
   - Sidebar simplificada
   - Sem acesso a configurações/gestão
   - Logo do cliente

2. **PortalDashboard**
   - Cards de estatísticas pessoais
   - Tickets recentes
   - Ações rápidas

3. **PortalTickets**
   - Lista de tickets do cliente
   - Filtros (status, prioridade)
   - Botão criar ticket

4. **PortalTicketDetalhes**
   - Informação do ticket
   - Timeline de intervenções
   - Anexos (se visíveis)
   - Histórico

### Proteção de Rotas

```typescript
// middleware.ts ou guard
if (pathname.startsWith('/portal')) {
  if (user.tipo_utilizador !== 'cliente') {
    redirect('/apps/dashboard')
  }
}

if (pathname.startsWith('/apps')) {
  if (user.tipo_utilizador !== 'interno') {
    redirect('/portal/dashboard')
  }
}
```

---

## 📊 FLUXO DE TRABALHO

### Cenário Completo

#### 1. Microlopes cria cliente
```sql
-- Criar empresa
INSERT INTO empresas (codigo, nome, nif, email, ...)
VALUES ('CLI001', 'Empresa XYZ LDA', '123456789', ...);
-- id = 10

-- Criar cliente
INSERT INTO clientes (empresa_id, num_cliente, rating, ...)
VALUES (10, 'CLI001', 5, ...);
-- id = 12
```

#### 2. Microlopes cria utilizador para o cliente
```sql
INSERT INTO utilizadores (
    username,
    email,
    tipo_utilizador,
    cliente_id,
    funcionario_id
)
VALUES (
    'joao.xyz',
    'joao@empresaxyz.pt',
    'cliente',  -- ⭐ TIPO
    12,         -- ⭐ CLIENTE_ID
    NULL        -- Não é funcionário
);
```

#### 3. Cliente faz login
```typescript
// Login normal com JWT
POST /auth/login
{
  "username": "joao.xyz",
  "password": "..."
}

// JWT retorna:
{
  "access_token": "...",
  "user": {
    "id": 25,
    "username": "joao.xyz",
    "tipo_utilizador": "cliente",  // ⭐
    "cliente_id": 12,
    "funcionario_id": null
  }
}
```

#### 4. Frontend redireciona
```typescript
// AuthProvider detecta tipo
if (user.tipo_utilizador === 'cliente') {
  router.push('/portal/dashboard')
} else {
  router.push('/apps/dashboard')
}
```

#### 5. Cliente cria ticket
```typescript
POST /portal/tickets
Authorization: Bearer <token>
{
  "tipo_ticket_id": 1,
  "titulo": "Problema com equipamento",
  "descricao": "...",
  "prioridade": "media"
}

// Backend força:
solicitante_id = user.id (25)
status = 'aberto'
```

#### 6. Cliente vê seus tickets
```typescript
GET /portal/tickets

// Retorna APENAS tickets onde:
// solicitante_id = 25 (user logado)
```

---

## ✅ SEGURANÇA

### Camadas de Proteção

1. **JWT Authentication** - Utilizador autenticado
2. **ClienteGuard** - Verificar `tipo_utilizador = 'cliente'`
3. **SQL WHERE Clause** - Filtrar por `solicitante_id = userId`
4. **Anexos** - Apenas `visivel_cliente = 1`
5. **Constraints DB** - `CK_utilizadores_tipo_consistencia`

### Testes de Segurança

```typescript
// ❌ Cliente tenta ver ticket de outro cliente
GET /portal/tickets/999
→ 404 Not Found (não pertence a ele)

// ❌ Cliente tenta aceder endpoint interno
GET /apps/suporte/triagem
→ 403 Forbidden (InternoGuard bloqueia)

// ❌ Funcionário tenta aceder portal
GET /portal/dashboard
→ 403 Forbidden (ClienteGuard bloqueia)

// ✅ Cliente vê apenas seus tickets
GET /portal/tickets
→ 200 OK (filtrados por solicitante_id)
```

---

## 🚀 IMPLEMENTAÇÃO

### Passos para ativar

#### 1. Base de Dados
```bash
sqlcmd -S localhost -d ceo_tenant_microlopes \
  -i "db/tenant/migrations/ADD_tipo_utilizador_portal_cliente.sql"
```

#### 2. Backend
```typescript
// app.module.ts
import { PortalModule } from './modules/portal/portal.module';

@Module({
  imports: [
    // ... outros módulos
    PortalModule,  // ⭐ Adicionar
  ],
})
```

#### 3. AuthProvider (Atualizar JWT)
```typescript
// Incluir tipo_utilizador no payload
const payload = {
  sub: user.id,
  username: user.username,
  tenantId: tenant.id,
  tipo_utilizador: user.tipo_utilizador,  // ⭐ Adicionar
  cliente_id: user.cliente_id,
  funcionario_id: user.funcionario_id
};
```

#### 4. Frontend (Criar rotas)
```
ceo_app/src/app/[lang]/(portal)/
  ├── layout.tsx          (Layout do portal)
  ├── dashboard/page.tsx
  ├── tickets/page.tsx
  ├── tickets/create/page.tsx
  ├── tickets/[id]/page.tsx
  └── perfil/page.tsx
```

---

## 📝 PRÓXIMOS PASSOS

### Funcionalidades Adicionais

1. **Notificações**
   - Email quando ticket é atualizado
   - Notificações in-app

2. **Chat/Mensagens**
   - Cliente pode comentar no ticket
   - Técnico responde

3. **Faturas** (futuro)
   - Cliente vê suas faturas
   - Download de PDFs

4. **Contratos** (futuro)
   - Cliente vê contratos ativos
   - SLAs

5. **Relatórios** (futuro)
   - Estatísticas mensais
   - Gráficos de performance

---

## 🎯 CONCLUSÃO

Sistema completo de **Portal de Cliente** implementado com:

✅ Segurança multi-camada
✅ Separação de responsabilidades
✅ Filtros automáticos por cliente
✅ Guards de autorização
✅ Endpoints RESTful documentados
✅ Stored Procedures otimizadas
✅ Estrutura escalável

**Pronto para produção após:**
1. Executar migration SQL
2. Adicionar PortalModule ao app.module
3. Implementar frontend (/portal/*)
4. Testes de segurança
