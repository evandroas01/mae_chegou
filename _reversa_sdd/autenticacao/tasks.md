# Autenticação — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Pré-requisitos
- [ ] Tabela `users` criada (ver `backend/src/database/migrate.ts:12-34`)
- [ ] Variáveis de ambiente configuradas: `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_*`
- [ ] Pacotes `jsonwebtoken`, `bcryptjs`, `express-validator` instalados

## Tarefas

- [ ] T-01: Implementar `UserModel` com queries SQL para `users`
  - Origem no legado: `backend/src/models/UserModel.ts:1-132`
  - Critério de pronto: CRUD completo (create, findByEmail, findById, findByTenant, findByMotorista, update, verifyPassword)
  - Confiança: 🟢

- [ ] T-02: Implementar utilitários de senha (hash + compare)
  - Origem no legado: `backend/src/utils/password.ts`
  - Critério de pronto: `hashPassword` gera hash bcrypt; `comparePassword` valida corretamente
  - Confiança: 🟢

- [ ] T-03: Implementar utilitário JWT (geração de token)
  - Origem no legado: `backend/src/utils/jwt.ts`
  - Critério de pronto: `generateToken({userId, userRole, tenantId})` retorna JWT válido com expiração de 7 dias
  - Confiança: 🟢

- [ ] T-04: Implementar middleware `authenticate`
  - Origem no legado: `backend/src/middleware/auth.ts:12-41`
  - Critério de pronto: Decodifica JWT do header Authorization, injeta userId/userRole/tenantId no request, retorna 401 se ausente/inválido
  - Confiança: 🟢

- [ ] T-05: Implementar middleware `authorize`
  - Origem no legado: `backend/src/middleware/auth.ts:43-57`
  - Critério de pronto: Aceita lista de roles, retorna 403 se role do usuário não está na lista
  - Confiança: 🟢

- [ ] T-06: Implementar middleware `requireTenant`
  - Origem no legado: `backend/src/middleware/tenant.ts:5-34`
  - Critério de pronto: Busca tenantId do user no DB, fallback para userId, injeta no request
  - Confiança: 🟢

- [ ] T-07: Implementar `AuthController.login`
  - Origem no legado: `backend/src/controllers/AuthController.ts:7-40`
  - Critério de pronto: Valida email+senha, chama verifyPassword, gera token, retorna user sem password
  - Confiança: 🟢

- [ ] T-08: Implementar `AuthController.register`
  - Origem no legado: `backend/src/controllers/AuthController.ts:42-91`
  - Critério de pronto: Verifica email único, cria user com hash, gera token, retorna 201
  - Confiança: 🟢

- [ ] T-09: Implementar `AuthController.me` e `AuthController.update`
  - Origem no legado: `backend/src/controllers/AuthController.ts:93-161`
  - Critério de pronto: GET retorna user sem password; PUT atualiza parcialmente, verifica email duplicado
  - Confiança: 🟢

- [ ] T-10: Implementar `AuthController.getResponsaveisByMotorista`
  - Origem no legado: `backend/src/controllers/AuthController.ts:163-187`
  - Critério de pronto: Apenas motorista acessa, filtra por motoristaId e role responsavel
  - Confiança: 🟢

- [ ] T-11: Implementar validadores de input (`auth.validator.ts`)
  - Origem no legado: `backend/src/validators/auth.validator.ts`
  - Critério de pronto: Validação de email, senha mínima, campos obrigatórios via express-validator
  - Confiança: 🟢

- [ ] T-12: Implementar rotas em `auth.routes.ts`
  - Origem no legado: `backend/src/routes/auth.routes.ts`
  - Critério de pronto: POST /login, POST /register (públicas); GET /me, PUT /me, GET /responsaveis (autenticadas)
  - Confiança: 🟢

- [ ] T-13: Implementar `AuthContext` no frontend
  - Origem no legado: `contexts/AuthContext.tsx:1-144`
  - Critério de pronto: Provider com login, logout, updateUser; persiste token/user em AsyncStorage; verifica token ao carregar
  - Confiança: 🟢

- [ ] T-14: Implementar `ApiService` base
  - Origem no legado: `services/api.ts`
  - Critério de pronto: Fetch com JWT automático, saveToken, clearToken, tratamento de 401
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste login com credenciais válidas → retorna token + user sem password
- [ ] TT-02: Teste login com email inexistente → retorna 401
- [ ] TT-03: Teste login com senha incorreta → retorna 401
- [ ] TT-04: Teste registro com email duplicado → retorna 409
- [ ] TT-05: Teste middleware authenticate com token válido → injeta userId
- [ ] TT-06: Teste middleware authenticate sem header → retorna 401
- [ ] TT-07: Teste middleware authorize com role incorreta → retorna 403
- [ ] TT-08: Teste GET /me com token válido → retorna user
- [ ] TT-09: Teste PUT /me com email duplicado → retorna 409

## Ordem Sugerida
1. T-02, T-03 (utilitários — sem dependências)
2. T-01 (model — depende de utilitários)
3. T-04, T-05, T-06 (middlewares — depende de JWT)
4. T-07, T-08, T-09, T-10, T-11 (controllers + validators)
5. T-12 (rotas — integra tudo)
6. T-13, T-14 (frontend — depende da API pronta)

## Lacunas Pendentes (🔴)
- Decidir se registro deve ser restrito (ex: apenas admin cria contas, ou convite por email)
- Decidir se email deve ser único por tenant (ao invés de global)
- Implementar refresh token ou mecanismo de revogação
- Adicionar rate limiting no login para prevenir brute force
