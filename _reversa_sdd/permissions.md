# Matriz de Permissões (RBAC) — cheguei_mae

> Gerado pelo **Detetive** do Reversa em 2026-05-18
> Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## Mecanismo de Autenticação & Autorização

| Componente | Implementação |
|------------|---------------|
| **Autenticação** | JWT via `Authorization: Bearer <token>` |
| **Middleware `authenticate`** | Decodifica JWT → injeta `userId`, `userRole`, `tenantId` no request |
| **Middleware `authorize(...roles)`** | Verifica se `userRole` está na lista de roles permitidas |
| **Middleware `requireTenant`** | Busca `tenantId` do user no DB; fallback para `userId` se null |
| **Isolamento de dados** | Todas as queries filtram por `tenantId` |

---

## Papéis (Roles)

| Role | Descrição | Confiança |
|------|-----------|-----------|
| `admin` | Administrador do tenant. Acesso total a dados e operações do tenant. | 🟢 |
| `motorista` | Profissional de transporte. Gerencia alunos, rotas, veículos, finanças e notificações. | 🟢 |
| `responsavel` | Pai/mãe/tutor de aluno. Visualiza dados, rastreia motorista, recebe notificações, assina contratos. | 🟢 |
| `aluno` | Aluno transportado. Role prevista no código mas sem funcionalidades dedicadas visíveis. | 🟡 |

---

## Matriz de Permissões por Recurso

### Legenda
- ✅ = Acesso permitido (via `authorize()` ou sem restrição de role após `authenticate`)
- 🔒 = Acesso restrito (via `authorize(...roles)`)
- ❌ = Acesso negado (role não listada em `authorize()`)
- 📋 = Dados filtrados por role (query diferente)
- ⚠️ = Sem restrição explícita de role (apenas `authenticate`)

### Auth (`/api/auth`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/login` | POST | ✅ público | ✅ público | ✅ público | ✅ público |
| `/register` | POST | ✅ público | ✅ público | ✅ público | ✅ público |
| `/me` | GET | ✅ | ✅ | ✅ | ✅ |
| `/me` | PUT | ✅ | ✅ | ✅ | ✅ |
| `/responsaveis` | GET | ❌ | 🔒 ✅ | ❌ | ❌ |

### Alunos (`/api/alunos`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | ❌ | 🔒 ✅ | ❌ | ❌ |
| `/` | GET | ✅ 📋 todos | ✅ 📋 seus alunos ativos | ✅ 📋 seus filhos | ⚠️ |
| `/:id` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/:id` | PUT | ❌ | 🔒 ✅ | ❌ | ❌ |
| `/:id` | DELETE | 🔒 ✅ | ❌ | ❌ | ❌ |

### Financeiro (`/api/financeiro`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/resumo` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/lancamentos` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/lancamentos/:id` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/lancamentos` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/lancamentos/:id` | PUT | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/lancamentos/:id` | DELETE | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |

### Contratos (`/api/contratos`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/` | GET | ✅ 📋 todos | ✅ 📋 todos | ✅ 📋 seus contratos | ⚠️ |
| `/:id` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/:id` | PUT | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/:id` | DELETE | 🔒 ✅ | ❌ | ❌ | ❌ |
| `/:id/assinar` | POST | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| `/:id/cancelar` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |

### Manutenções (`/api/manutencoes`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/` | GET | ✅ | ✅ 📋 seus veículos | ⚠️ | ⚠️ |
| `/veiculos` | GET | ❌ | ✅ | ❌ | ❌ |
| `/:id` | PUT | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |

### Rotas (`/api/rotas`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/` | GET | ✅ | ✅ 📋 suas rotas | ⚠️ | ⚠️ |
| `/:id` | GET | ✅ | ✅ | ⚠️ | ⚠️ |
| `/:id` | PUT | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/:id/iniciar` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/:id/finalizar` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/localizacao/:veiculoId` | GET | ✅ | ✅ | ✅ | ⚠️ |
| `/localizacao-motorista` | GET | ⚠️ | ⚠️ | ✅ 📋 | ⚠️ |
| `/localizacao` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |

### Notificações (`/api/notificacoes`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | 🔒 ✅ | 🔒 ✅ | ❌ | ❌ |
| `/` | GET | ✅ 📋 todas | ✅ 📋 todas | ✅ 📋 destinadas a ele | ⚠️ |
| `/:id/marcar-lida` | POST | ⚠️ | ⚠️ | ✅ | ⚠️ |
| `/responsaveis/disponiveis` | GET | ❌ | 🔒 ✅ | ❌ | ❌ |

### Upload (`/api/upload`)

| Endpoint | Método | admin | motorista | responsavel | aluno |
|----------|--------|-------|-----------|-------------|-------|
| `/` | POST | ✅ | ✅ | ✅ | ⚠️ |
| `/multiple` | POST | ✅ | ✅ | ✅ | ⚠️ |

---

## Observações de Segurança

| # | Observação | Severidade |
|---|-----------|-----------|
| 1 | `register` é público — qualquer um pode criar conta em qualquer role | 🔴 Alta |
| 2 | `assinar contrato` não tem restrição de role — qualquer autenticado pode assinar | 🟡 Média |
| 3 | Role `aluno` não tem nenhuma restrição explícita mas também nenhuma feature dedicada | 🟡 Média |
| 4 | GET em listas (alunos, financeiro, etc.) são permitidos a qualquer autenticado, apenas filtrados por role no controller | 🟡 Média |
| 5 | Tenant ID fallback para userId — se user não tem tenant, seus dados ficam isolados pelo próprio ID | 🟢 Design intencional |
| 6 | Upload não tem restrição de role, tipo de arquivo ou tamanho máximo visível nas rotas | 🟡 Média |
