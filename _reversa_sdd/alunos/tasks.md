# Alunos — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Pré-requisitos
- [ ] Tabelas `alunos`, `escolas`, `enderecos` criadas (ver `migrate.ts`)
- [ ] Módulo `autenticacao` implementado (middlewares)
- [ ] Tabela `users` com role `responsavel` suportada

## Tarefas

- [ ] T-01: Implementar `AlunoModel` com queries SQL
  - Origem: `backend/src/models/AlunoModel.ts:1-206`
  - Critério de pronto: create, findById (com JOINs), findByMotorista (status ativo), findByResponsavel, findAll, update, delete
  - Confiança: 🟢

- [ ] T-02: Implementar lógica de criação cascata (escola)
  - Origem: `backend/src/controllers/AlunoController.ts:33-48`
  - Critério de pronto: Busca escola por nome+tenant; cria se não existir
  - Confiança: 🟢

- [ ] T-03: Implementar lógica de criação cascata (endereços)
  - Origem: `backend/src/controllers/AlunoController.ts:50-85`
  - Critério de pronto: Cria endereço contratante (obrigatório) e saída (opcional)
  - Confiança: 🟢

- [ ] T-04: Implementar lógica de criação/busca de responsável
  - Origem: `backend/src/controllers/AlunoController.ts:87-128`
  - Critério de pronto: Por ID existente, por CPF existente, ou criação nova com hash bcrypt (corrigir senha não hasheada do legado)
  - Confiança: 🟢

- [ ] T-05: Implementar `AlunoController` completo (CRUD)
  - Origem: `backend/src/controllers/AlunoController.ts:6-241`
  - Critério de pronto: create, findAll (filtro por role), findById, update, delete
  - Confiança: 🟢

- [ ] T-06: Implementar validadores e rotas
  - Origem: `backend/src/validators/aluno.validator.ts`, `backend/src/routes/alunos.routes.ts`
  - Critério de pronto: Validação de campos obrigatórios; rotas com authorize correto
  - Confiança: 🟢

- [ ] T-07: Implementar telas frontend (listagem, cadastro, detalhe)
  - Origem: `app/alunos.tsx`, `app/cadastro-aluno.tsx`, `app/aluno-detalhe/[id].tsx`
  - Critério de pronto: Lista com filtro, formulário de cadastro, tela de detalhe com dados enriquecidos
  - Confiança: 🟢

- [ ] T-08: Implementar `alunoService.ts` no frontend
  - Origem: `services/alunoService.ts`
  - Critério de pronto: getAll, getById, create, update, delete via ApiService
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste criação com responsável novo → escola, endereço, responsável e aluno criados
- [ ] TT-02: Teste criação com responsável existente (por CPF) → reutiliza user
- [ ] TT-03: Teste listagem como motorista → apenas alunos ativos
- [ ] TT-04: Teste listagem como responsável → apenas seus filhos
- [ ] TT-05: Teste delete como admin → 204; como motorista → 403

## Ordem Sugerida
1. T-01 (model base)
2. T-02, T-03, T-04 (lógica cascata)
3. T-05, T-06 (controller + rotas)
4. T-07, T-08 (frontend)

## Lacunas Pendentes (🔴)
- Decidir se senha de responsável criado automaticamente deve usar hash bcrypt (sim)
- Remover hardcode "São Paulo/SP" da criação de escola — usar dados do request ou inferir
- Implementar lógica de status de pagamento por aluno (hoje é sempre `em_dia`)
- Considerar transação para cascata (evitar dados órfãos em falha parcial)
