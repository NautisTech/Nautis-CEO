# 📊 Explicação do Schema - Multi-Tenant

## 🏢 **CEO_Main** (Base de Dados Principal)

### **Objetivo:** Controlar todos os tenants e suas configurações

```
CEO_Main
│
├─ 🏢 GESTÃO DE TENANTS
│  ├─ tenants                          → Empresas/clientes cadastrados
│  ├─ planos                           → Planos de assinatura (Básico, Pro, etc)
│  ├─ tenant_utilizadores_principais   → Usuários admin de cada tenant
│  └─ tenant_logs                      → Auditoria de ações
│
├─ 🧩 MÓDULOS DO SISTEMA
│  ├─ modulos                          → Módulos disponíveis (RH, Veículos, etc)
│  └─ tenant_modulos                   → Quais módulos cada tenant tem ativo
│
└─ 🔧 CAMPOS DINÂMICOS (A PARTE MALUCA!)
   ├─ entidades_sistema                → Tabelas que podem ter campos custom
   └─ tenant_campos_personalizados       → Configuração de campos por tenant
```

### **Exemplo prático:**

```sql
-- Tenant "Empresa ABC" quer adicionar campo "Matrícula Interna" em funcionários
INSERT INTO tenant_campos_personalizados 
(tenant_id, entidade_sistema_id, codigo_campo, nome_campo, tipo_dados)
VALUES 
(1, 1, 'matricula_interna', 'Matrícula Interna', 'text');
```

---

## 🏪 **CEO_Tenant_{Nome}** (Base de Dados de cada Cliente)

### **Objetivo:** Dados isolados de cada empresa

```
CEO_Tenant_Example
│
├─ 👤 AUTENTICAÇÃO & ACESSO
│  ├─ utilizadores              → Login (email, senha, username)
│  ├─ grupos                    → Perfis (Admin, RH, Gestor, etc)
│  ├─ permissoes                → Permissões granulares
│  ├─ grupo_utilizador          → Usuário ↔ Grupo
│  ├─ grupo_permissao           → Grupo ↔ Permissões
│  └─ utilizador_permissao      → Permissões individuais
│
├─ 👥 MÓDULO RH
│  ├─ tipos_funcionarios        → Categorias (Efetivo, Temporário, etc)
│  ├─ funcionarios              → Dados base (nome, nascimento, sexo)
│  ├─ funcionarios_valores_personalizados  ⭐ CAMPOS DINÂMICOS
│  ├─ contatos                  → Telefone, email, etc
│  ├─ enderecos                 → Endereços do funcionário
│  ├─ dependentes               → Filhos, cônjuge, etc
│  ├─ empregos                  → Vínculos empregatícios
│  ├─ empregos_valores_personalizados      ⭐ CAMPOS DINÂMICOS
│  ├─ beneficios                → Vale alimentação, plano saúde
│  └─ beneficios_valores_personalizados    ⭐ CAMPOS DINÂMICOS
│
├─ 📄 MÓDULO DOCUMENTOS
│  ├─ anexos                    → Arquivos físicos
│  ├─ documentos                → BI, Passaporte, Certificados
│  └─ documentos_valores_personalizados    ⭐ CAMPOS DINÂMICOS
│
├─ 🚗 MÓDULO VEÍCULOS
│  ├─ veiculos                  → Frota da empresa
│  └─ veiculos_valores_personalizados      ⭐ CAMPOS DINÂMICOS
│
└─ 📰 MÓDULO CONTEÚDOS
   ├─ tipos_conteudo            → Templates (Notícia, Evento, Banner)
   ├─ categorias_conteudo       → Categorização
   ├─ tags                      → Tags para filtros
   ├─ conteudos                 → Conteúdo principal
   ├─ conteudos_valores_personalizados    ⭐ CAMPOS DINÂMICOS
   ├─ conteudo_tag              → Conteúdo ↔ Tags
   ├─ conteudo_anexo            → Múltiplos anexos por conteúdo
   ├─ comentarios               → Sistema de comentários
   ├─ conteudos_visualizacoes   → Analytics
   └─ conteudos_favoritos       → Bookmarks dos usuários
```

---

## 🎯 **Como Funciona o Sistema de Campos Dinâmicos (EAV)**

### **Problema que resolve:**
Cada empresa quer guardar informações diferentes nos funcionários. 

**Empresa A** quer: `matricula_interna`, `numero_beneficio`  
**Empresa B** quer: `codigo_ponto`, `nivel_acesso`, `certificacao`

### **Solução:**

#### **1️⃣ No CEO_Main - Configurar o campo:**
```sql
INSERT INTO tenant_campos_personalizados 
(tenant_id, entidade_sistema_id, codigo_campo, nome_campo, tipo_dados, obrigatorio)
VALUES 
(1, 1, 'numero_beneficio', 'Número do Benefício', 'text', 1);
```

#### **2️⃣ No Tenant DB - Salvar o valor:**
```sql
INSERT INTO funcionarios_valores_personalizados
(funcionario_id, codigo_campo, valor_texto)
VALUES
(5, 'numero_beneficio', 'BEN-12345');
```

#### **3️⃣ Buscar dados completos:**
```sql
-- Dados base
SELECT * FROM funcionarios WHERE id = 5;

-- Campos personalizados
SELECT * FROM funcionarios_valores_personalizados WHERE funcionario_id = 5;
```

---

## 📊 **Estrutura da Tabela EAV (Entity-Attribute-Value)**

```sql
CREATE TABLE funcionarios_valores_personalizados (
    id BIGINT,
    funcionario_id INT,           -- Qual funcionário
    codigo_campo NVARCHAR(100),   -- Qual campo (ex: "numero_beneficio")
    
    -- Valores em colunas tipadas (performance!)
    valor_texto NVARCHAR(MAX),    -- Para text, email, url
    valor_numero DECIMAL(18,4),   -- Para number, decimal
    valor_data DATE,              -- Para date
    valor_datetime DATETIME2,     -- Para datetime
    valor_boolean BIT,            -- Para boolean
    valor_json NVARCHAR(MAX)      -- Para arrays, objetos
);
```

### **Por que várias colunas de valor?**
✅ **Performance** - Índices funcionam melhor  
✅ **Validação** - SQL valida o tipo  
✅ **Ordenação** - Pode ordenar por números corretamente  
✅ **Filtros** - Queries mais rápidas  

---

## 🔄 **Fluxo Completo de Dados**

### **Cenário: Criar um funcionário com campos personalizados**

```typescript
// 1. Frontend envia
POST /api/funcionarios
{
  "nomeCompleto": "João Silva",
  "dataNascimento": "1990-01-01",
  "sexo": "Masculino",
  "camposPersonalizados": [
    {"codigo": "matricula_interna", "tipo": "text", "valor": "MAT-001"},
    {"codigo": "salario_extra", "tipo": "number", "valor": "500.00"}
  ]
}

// 2. Backend valida campos no CEO_Main
const camposConfigurados = await getCamposConfigTenant(tenantId);
validarCampos(camposConfigurados, dados.camposPersonalizados);

// 3. Backend salva no Tenant DB
EXEC sp_CriarFuncionarioCompleto
    @NomeCompleto = 'João Silva',
    @CamposPersonalizados = '[...]';

// 4. SP processa tudo em transação
BEGIN TRANSACTION
  INSERT INTO funcionarios (...) -- Dados base
  INSERT INTO funcionarios_valores_personalizados (...) -- Campos custom
COMMIT

// 5. Frontend busca e exibe
const func = await api.get('/funcionarios/1');
// func.nomeCompleto = "João Silva"
// func.camposPersonalizados[0].valor = "MAT-001"
```

---

## 🎨 **Relacionamentos Principais**

```
CEO_Main:
  tenants (1) ──→ (N) tenant_modulos
  tenants (1) ──→ (N) tenant_campos_personalizados
  modulos (1) ──→ (N) entidades_sistema

Tenant DB:
  utilizadores (1) ──→ (0..1) funcionarios
  funcionarios (1) ──→ (N) funcionarios_valores_personalizados
  funcionarios (1) ──→ (N) contatos
  funcionarios (1) ──→ (N) enderecos
  funcionarios (1) ──→ (N) dependentes
  funcionarios (1) ──→ (N) empregos
  funcionarios (1) ──→ (N) beneficios
  funcionarios (1) ──→ (N) documentos
  
  conteudos (1) ──→ (N) conteudos_valores_personalizados
  conteudos (N) ──→ (N) tags (via conteudo_tag)
  conteudos (1) ──→ (N) anexos (via conteudo_anexo)
  conteudos (1) ──→ (N) comentarios
```

---

## 💡 **Vantagens desta Arquitetura**

### ✅ **Isolamento Total**
Cada tenant tem sua própria base de dados

### ✅ **Flexibilidade Máxima**
Campos personalizáveis sem alterar estrutura física

### ✅ **Performance**
Dados separados = queries mais rápidas

### ✅ **Segurança**
Impossível acessar dados de outro tenant

### ✅ **Escalabilidade**
Cada tenant pode crescer independentemente

### ✅ **Backups Independentes**
Backup/restore por cliente

---

Resumindo: **CEO_Main controla QUEM e O QUE**, enquanto **Tenant DB guarda OS DADOS**! 🚀