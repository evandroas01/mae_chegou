# Inventário do Projeto — cheguei_mae

> Gerado pelo **Scout** do Reversa em 2026-05-18
> Escala de confiança: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## 1. Visão Geral

| Campo | Valor |
|-------|-------|
| **Nome do projeto** | Mãe, Chegou! (cheguei_mae) |
| **Descrição** | Sistema completo de gestão para transporte escolar |
| **Tipo de aplicação** | Mobile-first (React Native / Expo) + API REST (Node.js / Express) |
| **Linguagem principal** | TypeScript |
| **Arquitetura** | Monorepo — frontend mobile + backend API |
| **Banco de dados** | MySQL 8.0 (via Docker) |
| **Multi-tenant** | Sim (isolamento via `tenantId` em todas as tabelas) |

---

## 2. Estrutura de Pastas (excluindo node_modules, .git, .reversa, _reversa_sdd)

```
cheguei_mae/
├── app/                             # 🟢 Telas e rotas (Expo Router, file-based)
│   ├── (tabs)/                      # Tab navigation (admin/explore)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   ├── _layout.tsx                  # Root layout (Auth + StatusOnline providers)
│   ├── index.tsx                    # Dashboard principal
│   ├── login.tsx                    # Tela de login
│   ├── alunos.tsx                   # Lista de alunos
│   ├── cadastro-aluno.tsx           # Cadastro/edição de aluno
│   ├── aluno-detalhe/[id].tsx       # Detalhe do aluno (rota dinâmica)
│   ├── financeiro.tsx               # Gestão financeira
│   ├── financeiro/[id].tsx          # Detalhe lançamento financeiro
│   ├── financeiro/novo.tsx          # Novo lançamento financeiro
│   ├── contratos.tsx                # Gestão de contratos
│   ├── manutencao.tsx               # Manutenção de veículos
│   ├── rotas.tsx                    # Rotas e localização
│   ├── localizacao.tsx              # Mapa de localização
│   ├── notificacoes.tsx             # Sistema de notificações
│   ├── chat.tsx                     # Chat com responsáveis
│   ├── perfil.tsx                   # Perfil do motorista
│   ├── relatorios.tsx               # Relatórios
│   ├── pagamentos.tsx               # Pagamentos
│   └── modal.tsx                    # Modal genérico
│
├── backend/                         # 🟢 API REST (Express + TypeScript)
│   ├── src/
│   │   ├── server.ts                # Entry point do servidor
│   │   ├── config/
│   │   │   ├── database.ts          # Pool de conexões MySQL
│   │   │   ├── env.ts               # Variáveis de ambiente
│   │   │   └── upload.ts            # Configuração do Multer (upload)
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── AlunoController.ts
│   │   │   ├── ContratoController.ts
│   │   │   ├── FinanceiroController.ts
│   │   │   ├── ManutencaoController.ts
│   │   │   ├── NotificacaoController.ts
│   │   │   ├── RotaController.ts
│   │   │   └── UploadController.ts
│   │   ├── models/
│   │   │   ├── UserModel.ts
│   │   │   ├── AlunoModel.ts
│   │   │   ├── ContratoModel.ts
│   │   │   ├── LancamentoModel.ts
│   │   │   ├── RotaModel.ts
│   │   │   └── VeiculoModel.ts
│   │   ├── routes/
│   │   │   ├── index.ts             # Agregador de rotas (/api)
│   │   │   ├── auth.routes.ts
│   │   │   ├── alunos.routes.ts
│   │   │   ├── contratos.routes.ts
│   │   │   ├── financeiro.routes.ts
│   │   │   ├── manutencoes.routes.ts
│   │   │   ├── notificacoes.routes.ts
│   │   │   ├── rotas.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT authentication + authorization
│   │   │   ├── tenant.ts            # Multi-tenant isolation
│   │   │   └── validation.ts        # Validação express-validator
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── aluno.validator.ts
│   │   │   ├── contrato.validator.ts
│   │   │   ├── financeiro.validator.ts
│   │   │   ├── manutencao.validator.ts
│   │   │   ├── notificacao.validator.ts
│   │   │   └── rota.validator.ts
│   │   ├── database/
│   │   │   ├── migrate.ts           # DDL de todas as tabelas (13 tabelas)
│   │   │   └── seed.ts              # Dados de teste
│   │   ├── services/
│   │   │   └── api.example.ts       # Exemplo de serviço
│   │   ├── types/
│   │   │   └── index.ts             # Tipos compartilhados do backend
│   │   └── utils/
│   │       ├── jwt.ts               # Utilitários JWT
│   │       └── password.ts          # Hash/compare bcrypt
│   ├── .env                         # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
│
├── components/                      # 🟢 Componentes reutilizáveis
│   ├── layout/                      # Layouts por perfil de usuário
│   │   ├── AppLayout.tsx            # Layout genérico
│   │   ├── AdminLayout.tsx          # Layout admin
│   │   ├── MotoristaLayout.tsx      # Layout motorista
│   │   ├── ResponsavelLayout.tsx    # Layout responsável
│   │   ├── AlunoLayout.tsx          # Layout aluno
│   │   ├── Header.tsx               # Cabeçalho
│   │   ├── Sidebar.tsx              # Sidebar admin
│   │   ├── AlunoSidebar.tsx         # Sidebar aluno
│   │   ├── MotoristaSidebar.tsx     # Sidebar motorista
│   │   ├── ResponsavelSidebar.tsx   # Sidebar responsável
│   │   ├── BottomNavigation.tsx     # Navegação inferior mobile
│   │   └── ExpandedMenu.tsx         # Menu expandido
│   ├── ui/                          # Componentes de UI base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── Input.tsx
│   │   ├── SearchBar.tsx
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.tsx
│   │   └── icon-symbol.ios.tsx
│   ├── SplashScreen.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   └── hello-wave.tsx
│
├── contexts/                        # 🟢 Contextos React
│   ├── AuthContext.tsx              # Autenticação (login/logout/token)
│   └── StatusOnlineContext.tsx      # Status online/offline do motorista
│
├── services/                        # 🟢 Serviços do frontend (API clients)
│   ├── api.ts                       # ApiService base (fetch + JWT + timeout)
│   ├── alunoService.ts
│   ├── contratoService.ts
│   ├── financeiroService.ts
│   ├── localizacaoService.ts
│   ├── manutencaoService.ts
│   ├── notificacaoService.ts
│   ├── responsavelService.ts
│   ├── rotaService.ts
│   ├── uploadService.ts
│   ├── userService.ts
│   ├── veiculoService.ts
│   └── mockData.ts                  # Dados mock para desenvolvimento
│
├── types/                           # 🟢 Tipos TypeScript (frontend)
│   ├── user.ts
│   ├── aluno.ts
│   ├── contrato.ts
│   ├── financeiro.ts
│   ├── localizacao.ts
│   ├── manutencao.ts
│   ├── notificacao.ts
│   ├── perfil.ts
│   ├── rota.ts
│   └── chat.ts
│
├── constants/                       # 🟢 Constantes e temas
│   ├── theme.ts                     # Tema principal
│   ├── adminlte-theme.ts           # Tema AdminLTE
│   ├── logo-theme.ts               # Cores do logo
│   └── api.ts                      # Constantes de API (base URL, timeout)
│
├── hooks/                           # 🟢 React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── utils/                           # 🟢 Utilitários
│   └── masks.ts                     # Máscaras (CPF, CNPJ, telefone, etc.)
│
├── assets/images/                   # 🟢 Imagens e ícones
├── logo/                            # 🟢 Logotipo
├── scripts/                         # 🟢 Scripts auxiliares
│   └── reset-project.js
└── teste/mae_chegou/                # 🟡 Pasta de teste (conteúdo a verificar)
```

---

## 3. Contagem de Arquivos por Extensão

| Extensão | Contagem |
|----------|----------|
| `.ts`    | 149      |
| `.tsx`   | 102      |
| `.json`  | 20       |
| `.md`    | 18       |
| `.js`    | 4        |
| `.yml`   | 2        |
| **Total** | **~295** |

---

## 4. Pontos de Entrada

### Frontend (Mobile)
| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `app/_layout.tsx` | 🟢 app_entry | Root layout — inicializa AuthProvider e StatusOnlineProvider |
| `app/index.tsx` | 🟢 screen_entry | Dashboard principal |
| `app/login.tsx` | 🟢 screen_entry | Tela de login |

### Backend (API)
| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `backend/src/server.ts` | 🟢 server_entry | Express server — escuta em `0.0.0.0:3000` |
| `backend/src/routes/index.ts` | 🟢 routes_entry | Agregador de rotas sob `/api` |
| `backend/src/database/migrate.ts` | 🟢 migration_entry | DDL de 13 tabelas MySQL |
| `backend/src/database/seed.ts` | 🟢 seed_entry | Dados de teste |

---

## 5. Configurações

| Arquivo | Descrição |
|---------|-----------|
| `app.json` | Configuração Expo (iOS, Android, web, plugins) |
| `tsconfig.json` (raiz) | Extends expo/tsconfig.base, strict mode |
| `backend/tsconfig.json` | TypeScript config do backend |
| `backend/.env` | Variáveis: DB, JWT, CORS |
| `docker-compose.yml` | MySQL 8.0 containerizado |
| `eslint.config.js` | ESLint para frontend |
| `backend/.eslintrc.json` | ESLint para backend |

---

## 6. Schema de Banco de Dados (superficial)

🟢 **13 tabelas** identificadas em `backend/src/database/migrate.ts`:

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários (admin, motorista, responsavel, aluno) |
| `escolas` | Escolas cadastradas |
| `enderecos` | Endereços com coordenadas |
| `alunos` | Alunos com vínculo a escola, responsável, motorista |
| `veiculos` | Veículos (placa, modelo, km) |
| `documento_veiculos` | Documentos do veículo (licenciamento, seguro, vistoria) |
| `manutencoes` | Manutenções preventivas e corretivas |
| `contratos` | Contratos com status de assinatura e pagamento |
| `contrato_alunos` | Relação N:N contrato-aluno |
| `contrato_logs` | Logs de ações do contrato |
| `lancamentos` | Lançamentos financeiros (receita/despesa) |
| `notificacoes` | Notificações com gatilhos automáticos |
| `notificacao_destinatarios` | Destinatários de notificações |
| `rotas` | Rotas de transporte |
| `ponto_rotas` | Pontos de uma rota (casa, escola, retorno) |
| `parada_rotas` | Registro de paradas (hora chegada/saída) |
| `localizacao_veiculos` | Tracking GPS de veículos |

---

## 7. Cobertura de Testes

🔴 **Nenhum framework de teste configurado.** Nenhum arquivo `*.test.*` ou `*.spec.*` encontrado. Não há `jest`, `vitest`, `mocha` ou similar nas dependências.

---

## 8. Roles e Autenticação

🟢 **4 roles** definidos: `admin`, `motorista`, `responsavel`, `aluno`

| Mecanismo | Implementação |
|-----------|---------------|
| Autenticação | JWT via `jsonwebtoken` |
| Hash de senha | `bcryptjs` |
| Autorização | Middleware `authorize(...roles)` |
| Multi-tenant | Middleware `requireTenant` — filtra por `tenantId` em todas as queries |

---

## 9. Módulos Identificados

| Módulo | Descrição | Frontend | Backend |
|--------|-----------|----------|---------|
| **auth** | Autenticação e controle de acesso | `AuthContext.tsx`, `login.tsx` | `AuthController`, `auth.routes`, `auth.middleware` |
| **alunos** | Gestão de alunos | `alunos.tsx`, `cadastro-aluno.tsx`, `aluno-detalhe/` | `AlunoController`, `AlunoModel`, `alunos.routes` |
| **financeiro** | Lançamentos financeiros | `financeiro.tsx`, `financeiro/`, `pagamentos.tsx` | `FinanceiroController`, `LancamentoModel`, `financeiro.routes` |
| **contratos** | Gestão de contratos | `contratos.tsx` | `ContratoController`, `ContratoModel`, `contratos.routes` |
| **manutencao** | Manutenção de veículos | `manutencao.tsx` | `ManutencaoController`, `VeiculoModel`, `manutencoes.routes` |
| **rotas** | Rotas e localização | `rotas.tsx`, `localizacao.tsx` | `RotaController`, `RotaModel`, `rotas.routes` |
| **notificacoes** | Sistema de notificações | `notificacoes.tsx` | `NotificacaoController`, `notificacoes.routes` |
| **chat** | Chat motorista ↔ responsável | `chat.tsx` | 🔴 sem controller dedicado |
| **perfil** | Perfil do usuário | `perfil.tsx` | 🟡 via UserModel |
| **upload** | Upload de arquivos | `uploadService.ts` | `UploadController`, `upload.routes` |
| **relatorios** | Relatórios | `relatorios.tsx` | 🔴 sem controller dedicado |
| **dashboard** | Painel principal | `index.tsx` | 🟡 agregação de dados |

---

## 10. CI/CD

🔴 **Nenhuma configuração de CI/CD encontrada.** Não há `.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml` ou similar.

---

## 11. Docker

🟢 `docker-compose.yml` presente — MySQL 8.0 containerizado.

| Campo | Valor |
|-------|-------|
| Imagem | `mysql:8.0` |
| Container | `cheguei_mae_mysql` |
| Porta | `3306:3306` |
| Volume | `mysql_data` persistente |
| Healthcheck | `mysqladmin ping` |
