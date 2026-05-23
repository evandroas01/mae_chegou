# Autenticação — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

### Endpoints HTTP

| Método | Caminho | Entrada | Saída | Status codes |
|--------|---------|---------|-------|--------------| 
| POST | `/api/auth/login` | `{email, password}` | `{token, user}` | 200, 400, 401, 500 |
| POST | `/api/auth/register` | `{nome, email, password, role, telefone?, cpf?, motoristaId?, tenantId?}` | `{token, user}` | 201, 400, 409, 500 |
| GET | `/api/auth/me` | — (JWT header) | `User` (sem password) | 200, 401, 404, 500 |
| PUT | `/api/auth/me` | `{nome?, email?, telefone?, cpf?, password?}` | `User` (sem password) | 200, 400, 401, 409, 500 |
| GET | `/api/auth/responsaveis` | — (JWT header) | `User[]` (sem password) | 200, 401, 403, 500 |

### Middlewares

| Símbolo | Assinatura | Retorno | Observação |
|---------|-----------|---------|------------|
| `authenticate` | `(req, res, next)` | `void` | Decodifica JWT → injeta `userId`, `userRole`, `tenantId` 🟢 |
| `authorize` | `(...roles: UserRole[])` | `middleware` | Verifica se `userRole` está na lista 🟢 |
| `requireTenant` | `(req, res, next)` | `Promise<void>` | Busca tenantId do user no DB 🟢 |

### Model UserModel

| Símbolo | Assinatura | Retorno | Observação |
|---------|-----------|---------|------------|
| `create` | `(user: Omit<User, 'id'|'createdAt'|'updatedAt'>)` | `Promise<string>` | Retorna insertId, hash bcrypt 🟢 |
| `findByEmail` | `(email: string)` | `Promise<User\|null>` | SELECT * WHERE email = ? 🟢 |
| `findById` | `(id: string)` | `Promise<User\|null>` | SELECT * WHERE id = ? 🟢 |
| `findByTenant` | `(tenantId: string, role?: UserRole)` | `Promise<User[]>` | Filtro opcional por role 🟢 |
| `findByMotorista` | `(motoristaId: string)` | `Promise<User[]>` | SELECT WHERE motoristaId = ? 🟢 |
| `update` | `(id: string, updates: Partial<User>)` | `Promise<void>` | Atualização parcial dinâmica 🟢 |
| `verifyPassword` | `(email: string, password: string)` | `Promise<User\|null>` | findByEmail + comparePassword 🟢 |
| `mapRowToUser` | `(row: any)` | `User` | Converte row MySQL → interface TS 🟢 |

## Fluxo Principal — Login

1. Cliente envia `POST /api/auth/login` com `{email, password}` 🟢
2. Controller valida campos obrigatórios (email, password) 🟢
3. `UserModel.verifyPassword(email, password)` busca user por email 🟢
4. Se user não encontrado → retorna 401 🟢
5. Compara senha via `bcrypt.compare(password, user.password)` 🟢
6. Se inválida → retorna 401 🟢
7. `generateToken({userId, userRole, tenantId})` cria JWT 🟢
8. Destructuring remove `password` do objeto user 🟢
9. Retorna `{token, user}` com status 200 🟢

## Fluxo Principal — Registro

1. Controller extrai campos do body: `{nome, email, password, role, telefone, cpf, motoristaId, tenantId}` 🟢
2. Valida obrigatórios: `nome, email, password, role` 🟢
3. `UserModel.findByEmail(email)` verifica duplicidade 🟢
4. Se existe → retorna 409 🟢
5. `UserModel.create(...)` hasheia senha + insere no DB 🟢
6. `UserModel.findById(insertId)` recarrega user completo 🟢
7. Gera token JWT 🟢
8. Retorna `{token, user}` com status 201 🟢

## Fluxos Alternativos

- **Token ausente:** middleware authenticate retorna 401 "Token não fornecido" 🟢
- **Token malformado:** middleware authenticate retorna 401 "Token inválido ou expirado" 🟢
- **Role não autorizada:** middleware authorize retorna 403 "Acesso negado" 🟢
- **User sem tenantId:** middleware requireTenant usa fallback `req.userId` como tenantId 🟢
- **Update sem campos:** controller retorna 400 "Nenhum campo para atualizar" 🟢
- **Update com email duplicado:** verifica se email pertence a outro user → 409 🟢

## Dependências
- `jsonwebtoken` — geração e verificação de tokens JWT 🟢
- `bcryptjs` — hash e comparação de senhas 🟢
- `mysql2` — pool de conexões para queries SQL 🟢
- Nenhuma dependência de outros módulos do sistema 🟢

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------| 
| Queries SQL manuais (sem ORM) | `backend/src/models/UserModel.ts:9-22` | 🟢 |
| JWT long-lived (7 dias) ao invés de refresh token | `backend/.env` | 🟢 |
| Password removido via destructuring em toda response | `AuthController.ts:30,81,107,154` | 🟢 |
| Tenant fallback para userId (self-tenant) | `tenant.ts:27` | 🟢 |
| Email único global (não por tenant) | `UserModel.findByEmail` sem filtro tenant | 🟢 |
| Registro público sem restrição de role | `auth.routes.ts` — sem middleware authorize | 🟢 |

## Estado Interno

| Campo | Armazenamento | Evolução |
|-------|---------------|----------|
| Token JWT | AsyncStorage (`@token`) no frontend | Criado no login, removido no logout |
| Dados do usuário | AsyncStorage (`@user`) no frontend | Atualizado no login e updateUser |
| `isAuthenticated` | Estado React (Context) | Derivado de `!!user` |
| `isLoading` | Estado React (Context) | `true` durante verificação inicial do token |

## Observabilidade
- `console.error('Erro no login:', error)` — log genérico em catch 🟢
- `console.error('Erro no registro:', error)` — log genérico em catch 🟢
- Sem logs estruturados, métricas ou traces 🔴

## Riscos e Lacunas
- 🔴 Registro público: qualquer pessoa pode criar conta admin — requer restrição
- 🔴 Sem refresh token: JWT de 7 dias sem mecanismo de revogação
- 🔴 Sem rate limiting: login vulnerável a brute force
- 🟡 Email único global pode causar conflito entre tenants diferentes
- 🟡 Token verificado no carregamento do app mas não em background
