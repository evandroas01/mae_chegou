# Autenticação

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo responsável por autenticação JWT, registro de usuários, gestão de perfil básico e autorização baseada em roles (RBAC). É o gateway de segurança do sistema — todo request autenticado passa pelos middlewares deste módulo.

## Responsabilidades
- Autenticar usuários via email/senha com JWT 🟢
- Registrar novos usuários com hash bcrypt 🟢
- Retornar dados do usuário autenticado (`/me`) 🟢
- Atualizar dados do perfil (nome, email, telefone, cpf, senha) 🟢
- Listar responsáveis vinculados ao motorista 🟢
- Middleware de autenticação (decodificar JWT) 🟢
- Middleware de autorização (verificar role) 🟢
- Middleware de tenant (resolver tenantId do usuário) 🟢

## Regras de Negócio
- RN-01: Email deve ser único em todo o sistema (global, não por tenant) 🟢
- RN-02: Senha é hasheada com bcrypt antes de persistir 🟢
- RN-03: JWT contém `{userId, userRole, tenantId}` e expira em 7 dias 🟢
- RN-04: Token verificado a cada carregamento do app (call to `/auth/me`) 🟢
- RN-05: Token inválido limpa sessão local (AsyncStorage) e redireciona para login 🟢
- RN-06: Tenant ID resolvido via DB lookup; fallback para userId se user não tem tenantId 🟢
- RN-07: Responsáveis são filtrados por `motoristaId` e role `responsavel` 🟢
- RN-08: Registro é público — qualquer pessoa pode criar conta em qualquer role 🔴 Vulnerabilidade

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Login com email e senha retorna JWT + dados do usuário | Must | Token válido gerado, senha não retornada |
| RF-02 | Registro cria usuário com senha hasheada | Must | User persistido, senha bcrypt, token gerado |
| RF-03 | GET /me retorna dados do usuário autenticado | Must | Dados retornados sem campo password |
| RF-04 | PUT /me atualiza campos parciais do perfil | Must | Apenas campos enviados são atualizados |
| RF-05 | Verificação de email duplicado no registro | Must | Retorna 409 se email já existe |
| RF-06 | Verificação de email duplicado na atualização | Must | Retorna 409 se email pertence a outro user |
| RF-07 | Listar responsáveis do motorista | Should | Apenas role motorista acessa, filtra por motoristaId |
| RF-08 | Middleware authenticate decodifica JWT | Must | Injeta userId, userRole, tenantId no request |
| RF-09 | Middleware authorize verifica roles | Must | Retorna 403 se role não permitida |
| RF-10 | Middleware requireTenant resolve tenantId | Must | Busca tenantId no DB, fallback para userId |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------| 
| Segurança | Autenticação JWT obrigatória em todas as rotas exceto login/register | `backend/src/middleware/auth.ts:12-41` | 🟢 |
| Segurança | Senha nunca retornada nas responses (destructuring) | `backend/src/controllers/AuthController.ts:30` | 🟢 |
| Segurança | Hash bcrypt para senhas | `backend/src/utils/password.ts` | 🟢 |
| Performance | Token timeout de 7 dias (long-lived) | `backend/.env` | 🟢 |

## Critérios de Aceitação

```gherkin
Cenário: Login bem-sucedido
  Dado um usuário cadastrado com email "motorista@test.com" e senha "123456"
  Quando enviar POST /api/auth/login com email e senha corretos
  Então deve retornar status 200 com token JWT e dados do usuário sem senha

Cenário: Login com credenciais inválidas
  Dado um email inexistente ou senha incorreta
  Quando enviar POST /api/auth/login
  Então deve retornar status 401 com erro "Credenciais inválidas"

Cenário: Registro com email duplicado
  Dado um usuário já cadastrado com email "existente@test.com"
  Quando enviar POST /api/auth/register com o mesmo email
  Então deve retornar status 409 com erro "Email já cadastrado"

Cenário: Acesso com token expirado
  Dado um token JWT expirado
  Quando enviar qualquer request autenticado
  Então deve retornar status 401 e limpar sessão local

Cenário: Acesso a rota restrita
  Dado um usuário com role "responsavel"
  Quando tentar acessar GET /api/auth/responsaveis (apenas motorista)
  Então deve retornar status 403 "Acesso negado"
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Login/Logout | Must | Gateway de acesso — todo o sistema depende |
| Middleware authenticate | Must | Sem ele, nenhuma rota protegida funciona |
| Middleware authorize | Must | RBAC é central ao sistema |
| Middleware requireTenant | Must | Isolamento de dados depende dele |
| Registro de usuário | Must | Onboarding de novos usuários |
| Atualização de perfil | Should | Importante mas não bloqueia outros módulos |
| Listar responsáveis | Should | Usado apenas pelo módulo de chat/notificações |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/AuthController.ts` | `AuthController` | 🟢 |
| `backend/src/models/UserModel.ts` | `UserModel` | 🟢 |
| `backend/src/middleware/auth.ts` | `authenticate`, `authorize` | 🟢 |
| `backend/src/middleware/tenant.ts` | `requireTenant` | 🟢 |
| `backend/src/utils/jwt.ts` | `generateToken` | 🟢 |
| `backend/src/utils/password.ts` | `hashPassword`, `comparePassword` | 🟢 |
| `backend/src/routes/auth.routes.ts` | Declaração de rotas | 🟢 |
| `backend/src/validators/auth.validator.ts` | Validações de input | 🟢 |
| `contexts/AuthContext.tsx` | `AuthProvider`, `useAuth` | 🟢 |
| `app/login.tsx` | Tela de login | 🟢 |
| `services/api.ts` | `ApiService` | 🟢 |
