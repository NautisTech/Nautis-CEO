Perfeito ⚡ — aqui está um **ficheiro completo em formato Markdown (`README.md`)** que documenta toda a estrutura da base de dados para o teu sistema de formações (e-learning).
Este documento está pronto para colocar no teu repositório (ex: `docs/db-structure.md` ou `README_DB.md`).

---

# 🧠 Estrutura da Base de Dados — Sistema de Formações

## 📘 Visão Geral

O sistema foi projetado para gerir **formações online**, com **cursos**, **módulos**, **aulas**, **blocos multimédia** e **anexos**.
Permite também controlar **alunos inscritos**, **progresso**, **notas** e **certificados**.

---

## 🏗️ Hierarquia Geral

```text
formacoes                  → Formação completa (curso principal)
 ├── m_formacoes            → Módulos ou capítulos dentro da formação
 │    └── a_formacoes       → Aulas pertencentes ao módulo
 │         └── a_formacoes_blocos
 │              └── a_formacoes_blocos_anexos
 └── formacoes_clientes     → Liga alunos (utilizadores) à formação
```

---

## 📚 Tabelas e Relações

### 🧩 1. `formacoes`

Tabela principal de **formações (cursos)**.

| Campo            | Tipo                    | Descrição                           |
| ---------------- | ----------------------- | ----------------------------------- |
| `id`             | INT                     | Identificador único                 |
| `titulo`         | NVARCHAR(255)           | Nome da formação                    |
| `descricao`      | NVARCHAR(MAX)           | Descrição geral                     |
| `categoria`      | NVARCHAR(100)           | Categoria (ex: Design, Programação) |
| `nivel`          | NVARCHAR(50)            | Nível de dificuldade                |
| `duracao_horas`  | DECIMAL(6,2)            | Duração total estimada              |
| `imagem_capa_id` | INT (FK → anexos)       | Capa ilustrativa                    |
| `autor_id`       | INT (FK → utilizadores) | Professor/criador                   |
| `publicado`      | BIT                     | Se está visível aos alunos          |
| `ativo`          | BIT                     | Estado ativo/inativo                |
| `criado_em`      | DATETIME                | Data de criação                     |
| `atualizado_em`  | DATETIME                | Última atualização                  |

---

### 🧱 2. `m_formacoes`

Representa **módulos ou capítulos** dentro de uma formação.

| Campo            | Tipo                    | Descrição               |
| ---------------- | ----------------------- | ----------------------- |
| `id`             | INT                     | Identificador único     |
| `formacao_id`    | INT (FK → formacoes)    | Formação a que pertence |
| `titulo`         | NVARCHAR(255)           | Nome do módulo          |
| `descricao`      | NVARCHAR(MAX)           | Descrição opcional      |
| `categoria`      | NVARCHAR(100)           | Categoria específica    |
| `nivel`          | NVARCHAR(50)            | Nível (ex: Intermédio)  |
| `duracao_total`  | DECIMAL(6,2)            | Duração total (horas)   |
| `imagem_capa_id` | INT (FK → anexos)       | Imagem de capa opcional |
| `ativo`          | BIT                     | Estado ativo/inativo    |
| `criado_por`     | INT (FK → utilizadores) | Criador do módulo       |
| `criado_em`      | DATETIME                | Data de criação         |
| `atualizado_em`  | DATETIME                | Última atualização      |

---

### 🎓 3. `a_formacoes`

Cada **aula** pertencente a um módulo.

| Campo             | Tipo                   | Descrição                              |
| ----------------- | ---------------------- | -------------------------------------- |
| `id`              | INT                    | Identificador único                    |
| `m_formacao_id`   | INT (FK → m_formacoes) | Módulo associado                       |
| `titulo`          | NVARCHAR(255)          | Nome da aula                           |
| `descricao`       | NVARCHAR(MAX)          | Texto explicativo ou introdução        |
| `tipo`            | NVARCHAR(50)           | Tipo (video, texto, pdf, imagem, etc.) |
| `ordem`           | INT                    | Ordem dentro do módulo                 |
| `duracao_minutos` | DECIMAL(5,2)           | Duração média                          |
| `publicado`       | BIT                    | Se está visível                        |
| `criado_em`       | DATETIME               | Data de criação                        |
| `atualizado_em`   | DATETIME               | Última atualização                     |

---

### 🧩 4. `a_formacoes_blocos`

Blocos de conteúdo dentro de uma aula.
Permitem segmentar uma aula em partes menores, como exercícios, vídeos ou materiais complementares.

| Campo           | Tipo                   | Descrição                                          |
| --------------- | ---------------------- | -------------------------------------------------- |
| `id`            | INT                    | Identificador único                                |
| `a_formacao_id` | INT (FK → a_formacoes) | Aula a que pertence                                |
| `titulo`        | NVARCHAR(255)          | Nome do bloco (ex: “Exercício 1”)                  |
| `conteudo`      | NVARCHAR(MAX)          | Texto, HTML ou instruções                          |
| `tipo`          | NVARCHAR(50)           | Tipo de conteúdo (texto, pdf, vídeo, imagem, etc.) |
| `ordem`         | INT                    | Ordem dentro da aula                               |
| `criado_em`     | DATETIME               | Data de criação                                    |
| `atualizado_em` | DATETIME               | Última atualização                                 |

---

### 📎 5. `a_formacoes_blocos_anexos`

Associa **ficheiros multimédia** (PDFs, imagens, vídeos) a cada bloco.

| Campo       | Tipo                          | Descrição                        |
| ----------- | ----------------------------- | -------------------------------- |
| `id`        | INT                           | Identificador único              |
| `bloco_id`  | INT (FK → a_formacoes_blocos) | Bloco a que pertence             |
| `anexo_id`  | INT (FK → anexos)             | Ficheiro anexo (já existente)    |
| `legenda`   | NVARCHAR(255)                 | Descrição do anexo               |
| `ordem`     | INT                           | Ordem de apresentação            |
| `principal` | BIT                           | Define se é o ficheiro principal |
| `criado_em` | DATETIME                      | Data de associação               |

💡 Isto permite ter **vários PDFs, imagens ou vídeos** associados à mesma aula.

---

### 🧠 6. `formacoes_clientes`

Tabela de inscrição e progresso dos **alunos/clientes** nas formações.

| Campo             | Tipo                    | Descrição                      |
| ----------------- | ----------------------- | ------------------------------ |
| `id`              | INT                     | Identificador único            |
| `formacao_id`     | INT (FK → formacoes)    | Formação inscrita              |
| `cliente_id`      | INT (FK → utilizadores) | Aluno inscrito                 |
| `data_inscricao`  | DATETIME                | Quando se inscreveu            |
| `progresso`       | DECIMAL(5,2)            | Percentagem concluída          |
| `horas_estudo`    | DECIMAL(6,2)            | Horas totais estudadas         |
| `nota_final`      | DECIMAL(5,2)            | Nota média final               |
| `certificado_url` | NVARCHAR(255)           | Caminho do certificado emitido |
| `data_conclusao`  | DATETIME                | Quando terminou a formação     |
| `ativo`           | BIT                     | Estado da inscrição            |
| `criado_em`       | DATETIME                | Data de criação                |
| `atualizado_em`   | DATETIME                | Última atualização             |

🔒 `UNIQUE (formacao_id, cliente_id)` — garante que um aluno não se inscreve duas vezes na mesma formação.

---

## 📈 Fluxo de Dados

1. **Um professor cria** uma `formacao` (curso principal).
2. **Divide** em `m_formacoes` (módulos).
3. Cada módulo contém **aulas (`a_formacoes`)**.
4. As aulas são compostas por **blocos (`a_formacoes_blocos`)** com conteúdo.
5. Cada bloco pode ter **vários anexos (`a_formacoes_blocos_anexos`)**.
6. **Alunos** inscrevem-se via `formacoes_clientes`.
7. O progresso é atualizado conforme assistem às aulas.

---

## 🧩 Exemplo de Estrutura Real

```
Formação: Design Gráfico Completo (formacoes)
├── Módulo 1: Fundamentos de Design (m_formacoes)
│    ├── Aula 1: Introdução ao Design (a_formacoes)
│    │    ├── Bloco 1: Vídeo explicativo (a_formacoes_blocos)
│    │    │    └── video.mp4 (a_formacoes_blocos_anexos)
│    │    ├── Bloco 2: Exercício prático (a_formacoes_blocos)
│    │    │    ├── exercicio1.pdf
│    │    │    └── exemplo_layout.jpg
│    │    └── Bloco 3: Quiz final (a_formacoes_blocos)
│    │         └── quiz.json
│    └── Aula 2: Tipografia e Cores
└── Módulo 2: Projeto Final
```

---

## 📊 Consultas Comuns

### 🔍 Listar todas as formações com autor e total de alunos

```sql
SELECT 
    f.id,
    f.titulo,
    f.categoria,
    f.duracao_horas,
    u.username AS autor,
    COUNT(fc.id) AS total_alunos
FROM formacoes f
LEFT JOIN utilizadores u ON u.id = f.autor_id
LEFT JOIN formacoes_clientes fc ON fc.formacao_id = f.id
GROUP BY f.id, f.titulo, f.categoria, f.duracao_horas, u.username;
```

### 📚 Obter estrutura completa de uma formação

```sql
SELECT 
    f.titulo AS formacao,
    m.titulo AS modulo,
    a.titulo AS aula,
    b.titulo AS bloco,
    ax.nome_original AS ficheiro
FROM formacoes f
JOIN m_formacoes m ON m.formacao_id = f.id
JOIN a_formacoes a ON a.m_formacao_id = m.id
LEFT JOIN a_formacoes_blocos b ON b.a_formacao_id = a.id
LEFT JOIN a_formacoes_blocos_anexos bax ON bax.bloco_id = b.id
LEFT JOIN anexos ax ON ax.id = bax.anexo_id
WHERE f.id = @formacao_id
ORDER BY m.id, a.ordem, b.ordem, bax.ordem;
```

---

## 🧩 Extensões Futuras

* Tabela `a_formacoes_quizzes` (para avaliações automáticas).
* Tabela `formacoes_certificados` (para gestão e emissão de certificados PDF).
* Tabela `formacoes_tags` (para categorização avançada).
* Logs de visualização (`a_formacoes_logs`) para tracking detalhado de vídeos.

---

## 🧠 Benefícios do Modelo

✅ **Altamente flexível** – permite aulas multimédia (texto, vídeo, imagem, PDF).
✅ **Escalável** – suporta grandes formações com múltiplos módulos.
✅ **Reutilizável** – anexos podem ser usados em várias formações.
✅ **Compatível com API REST** – estrutura ideal para backend moderno (NestJS, .NET, etc.).
✅ **Pronta para dashboards** – fácil de calcular progresso, popularidade e estatísticas.

---

## 🧾 Autoria

Desenhado por **ChatGPT (GPT-5)**
📅 Última atualização: **Outubro 2025**
💾 Compatível com **Microsoft SQL Server**

---

Queres que eu te gere este `.md` como ficheiro mesmo (para download)?
Posso criar e enviar o `README_DB.md` formatado e pronto.
