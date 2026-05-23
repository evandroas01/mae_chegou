# Contratos — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Pré-requisitos
- [ ] Tabelas `contratos`, `contrato_alunos`, `contrato_logs` criadas
- [ ] Módulos `autenticacao` e `alunos` implementados

## Tarefas

- [ ] T-01: Implementar `ContratoModel` (CRUD + logs + vinculação de alunos)
  - Origem: `backend/src/models/ContratoModel.ts:1-145`
  - Critério de pronto: create, findAll (com JOINs), findById, update, delete, createLog, addAlunos
  - Confiança: 🟢

- [ ] T-02: Implementar numeração sequencial `CT-ANO-SEQ`
  - Origem: `backend/src/controllers/ContratoController.ts:25-29`
  - Critério de pronto: COUNT do tenant + padStart(3, '0')
  - Confiança: 🟢

- [ ] T-03: Implementar fluxos de assinatura e cancelamento
  - Origem: `backend/src/controllers/ContratoController.ts:165-233`
  - Critério de pronto: Status atualizado, log criado, contrato retornado
  - Confiança: 🟢

- [ ] T-04: Implementar listagem filtrada por role
  - Origem: `backend/src/controllers/ContratoController.ts:72-120`
  - Critério de pronto: Responsável vê apenas seus contratos (via JOIN com contrato_alunos + alunos)
  - Confiança: 🟢

- [ ] T-05: Implementar controller, validadores e rotas
  - Origem: `backend/src/controllers/ContratoController.ts`, `contratos.routes.ts`
  - Critério de pronto: CRUD + assinar + cancelar
  - Confiança: 🟢

- [ ] T-06: Implementar tela frontend
  - Origem: `app/contratos.tsx`
  - Critério de pronto: Listagem, detalhes, ações de assinatura/cancelamento
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste numeração sequencial com múltiplos contratos
- [ ] TT-02: Teste assinatura gera log e atualiza dataAssinatura
- [ ] TT-03: Teste cancelamento com motivo registrado no log
- [ ] TT-04: Teste listagem como responsável filtra por seus contratos

## Ordem Sugerida
1. T-01 (model) → T-02 (numeração) → T-03 (fluxos) → T-04, T-05 → T-06

## Lacunas Pendentes (🔴)
- Decidir se assinatura deve exigir role `responsavel`
- Implementar guard de transição (impedir re-assinatura, cancelar assinado)
- Implementar atualização automática de statusPagamento
