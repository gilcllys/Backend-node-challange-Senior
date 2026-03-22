# Brain Agriculture API

API REST para gerenciamento de produtores rurais, propriedades, safras e culturas plantadas.

## Tecnologias

- **NestJS** — Framework Node.js
- **TypeORM** — ORM para PostgreSQL
- **PostgreSQL 16** — Banco de dados relacional
- **Docker** — Containerização
- **Swagger/OpenAPI** — Documentação da API
- **Jest** — Testes unitários e e2e
- **class-validator** — Validação de DTOs

## Relação de Tabelas
<img width="6832" height="6257" alt="image" src="https://github.com/user-attachments/assets/3b3e05fb-87e9-4351-80c3-331dd3c3d725" />


## Arquitetura

```
src/
  common/              # BaseEntity, validators, filters, interceptors
  config/              # Configuração do banco de dados
  producers/           # Módulo de produtores rurais
  farms/               # Módulo de fazendas
  safras/              # Módulo de safras
  culture-planted/     # Módulo de culturas plantadas
  plantios/            # Módulo de plantios (fazenda + safra + cultura)
  dashboard/           # Módulo do dashboard com agregações
  database/seeds/      # Script de seed com dados mock
```

## Modelo de Dados

| Entidade | Descrição |
|---|---|
| **Producer** | Produtor rural (CPF/CNPJ, nome) — soft delete |
| **Farm** | Fazenda (nome, cidade, estado, áreas) — soft delete |
| **Safra** | Safra (ex: "Safra 2024") |
| **CulturePlanted** | Cultura plantada (ex: "Soja", "Milho") |
| **Plantio** | Vínculo entre fazenda, safra e cultura |

Todas as entidades herdam de `BaseEntity` (id UUID, created_at, updated_at).

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

## Como Executar

### Com Docker (recomendado)

```bash
# Clonar e entrar no projeto
git clone <repo-url>
cd backend-challeng

# Subir PostgreSQL + aplicação
docker-compose up -d

# A API estará disponível em http://localhost:3000
# Swagger UI em http://localhost:3000/api
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Subir apenas o PostgreSQL via Docker
docker-compose up -d db

# Rodar em modo desenvolvimento
npm run start:dev

# Executar seed (dados mock)
npm run seed
```

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USERNAME` | Usuário do banco | `brain_ag` |
| `DB_PASSWORD` | Senha do banco | `brain_ag_pass` |
| `DB_DATABASE` | Nome do banco | `brain_agriculture` |
| `PORT` | Porta da aplicação | `3000` |

## Endpoints da API

### Produtores (`/producers`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/producers` | Cadastrar produtor |
| GET | `/producers` | Listar produtores (paginado) |
| GET | `/producers/:id` | Buscar produtor por ID |
| PATCH | `/producers/:id` | Atualizar produtor |
| DELETE | `/producers/:id` | Remover produtor (soft delete) |

### Fazendas (`/farms`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/farms` | Cadastrar fazenda |
| GET | `/farms` | Listar fazendas (paginado) |
| GET | `/farms/:id` | Buscar fazenda por ID |
| PATCH | `/farms/:id` | Atualizar fazenda |
| DELETE | `/farms/:id` | Remover fazenda (soft delete) |

### Safras (`/safras`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/safras` | Cadastrar safra |
| GET | `/safras` | Listar safras (paginado) |
| GET | `/safras/:id` | Buscar safra por ID |
| PATCH | `/safras/:id` | Atualizar safra |
| DELETE | `/safras/:id` | Remover safra |

### Culturas Plantadas (`/culture-planted`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/culture-planted` | Cadastrar cultura |
| GET | `/culture-planted` | Listar culturas (paginado) |
| GET | `/culture-planted/:id` | Buscar cultura por ID |
| PATCH | `/culture-planted/:id` | Atualizar cultura |
| DELETE | `/culture-planted/:id` | Remover cultura |

### Plantios (`/plantios`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/plantios` | Registrar plantio |
| GET | `/plantios` | Listar plantios (paginado) |
| GET | `/plantios/:id` | Buscar plantio por ID |
| DELETE | `/plantios/:id` | Remover plantio |

### Dashboard (`/dashboard`)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard` | Dados agregados do dashboard |

**Resposta do Dashboard:**
```json
{
  "totalFarms": 5,
  "totalHectares": 12300,
  "byState": [{ "state": "SP", "count": 2 }],
  "byCulture": [{ "culture": "Soja", "count": 5 }],
  "byLandUse": { "arableArea": 8100, "vegetationArea": 4200 }
}
```

## Regras de Negócio

- **CPF/CNPJ**: Validação de CPF (11 dígitos) e CNPJ (14 dígitos) com verificação de dígitos
- **Áreas**: A soma de `arableArea` + `vegetationArea` não pode ultrapassar `totalArea`
- **Unicidade**: CPF/CNPJ único por produtor; combinação (fazenda, safra, cultura) única em plantios
- **Soft delete**: Produtores e fazendas usam soft delete (`deletedAt`)
- **Paginação**: Todos os endpoints de listagem suportam `?page=1&limit=20`

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e (requer PostgreSQL rodando)
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Documentação OpenAPI

Acesse a documentação Swagger em: `http://localhost:3000/api`

A especificação OpenAPI JSON está disponível em: `http://localhost:3000/api-json`
