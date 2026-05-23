# Financeiro — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Pré-requisitos
- [ ] Tabela `lancamentos` criada (ver `migrate.ts`)
- [ ] Módulo `autenticacao` implementado
- [ ] Tabelas `alunos` e `contratos` disponíveis (FK opcional)

## Tarefas

- [ ] T-01: Implementar `LancamentoModel` com queries SQL
  - Origem: `backend/src/models/LancamentoModel.ts:1-145`
  - Critério de pronto: create, findAll (com filtros), findById, update, delete, métodos de resumo
  - Confiança: 🟢

- [ ] T-02: Implementar cálculo de status automático na criação
  - Origem: `backend/src/controllers/FinanceiroController.ts:25-32`
  - Critério de pronto: dataVencimento < now → atrasado, senão → pendente
  - Confiança: 🟢

- [ ] T-03: Implementar algoritmo de resumo financeiro
  - Origem: `backend/src/controllers/FinanceiroController.ts:130-207`
  - Critério de pronto: Calcula receitas/despesas do mês, saldo geral (pagos), inadimplência com percentual
  - Confiança: 🟢

- [ ] T-04: Implementar filtros na listagem (tipo, status, período)
  - Origem: `backend/src/controllers/FinanceiroController.ts:53-97`
  - Critério de pronto: Filtros opcionais combinados via WHERE dinâmico
  - Confiança: 🟢

- [ ] T-05: Implementar controller, validadores e rotas
  - Origem: `backend/src/controllers/FinanceiroController.ts`, `financeiro.routes.ts`
  - Critério de pronto: CRUD completo com authorize admin+motorista para escrita
  - Confiança: 🟢

- [ ] T-06: Implementar telas frontend (listagem, criação)
  - Origem: `app/financeiro.tsx`, `app/financeiro/novo.tsx`
  - Critério de pronto: Lista com filtros, formulário de criação, cards de resumo
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste criação com vencimento futuro → status pendente
- [ ] TT-02: Teste criação com vencimento passado → status atrasado
- [ ] TT-03: Teste resumo com mix de receitas pagas e atrasadas → inadimplência correta
- [ ] TT-04: Teste filtros combinados (tipo + status + período)

## Ordem Sugerida
1. T-01 (model)
2. T-02, T-03, T-04 (lógica de negócio)
3. T-05 (controller + rotas)
4. T-06 (frontend)

## Lacunas Pendentes (🔴)
- Implementar job/cron para atualizar status de vencidos automaticamente
- Decidir se recorrência deve materializar lançamentos filhos mensalmente
- Adicionar paginação na listagem de lançamentos
