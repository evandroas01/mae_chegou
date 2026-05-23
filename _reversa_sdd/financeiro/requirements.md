# Financeiro

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de gestão financeira para motoristas. Controla lançamentos de receitas e despesas, calcula resumo mensal com saldo, inadimplência e percentuais. Suporta categorização e filtros temporais.

## Responsabilidades
- Criar lançamentos financeiros (receita/despesa) com cálculo automático de status 🟢
- Listar lançamentos com filtros por tipo, status e período 🟢
- Calcular resumo financeiro: receitas, despesas, saldo e inadimplência 🟢
- Vincular lançamentos a alunos e/ou contratos 🟢
- Atualizar e deletar lançamentos 🟢

## Regras de Negócio
- RN-20: Status auto-calculado na criação: `dataVencimento < hoje ? 'atrasado' : 'pendente'` 🟢
- RN-21: Saldo geral considera apenas lançamentos com `status = 'pago'` 🟢
- RN-22: Inadimplência = soma de receitas atrasadas / receitas do mês × 100 🟢
- RN-23: Recorrência armazenada como metadado mas NÃO materializada 🔴
- RN-24: Categorias: receita_recorrente, receita_extra, despesa_fixa, despesa_variavel 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar lançamento com status automático | Must | Status calculado por vencimento |
| RF-02 | Listar com filtros (tipo, status, período) | Must | Filtros opcionais combinados |
| RF-03 | Calcular resumo mensal | Must | Saldo, receitas, despesas, inadimplência |
| RF-04 | Vincular a aluno e/ou contrato | Should | FK opcional aceita |
| RF-05 | Suportar recorrência | Could | Metadado armazenado (🔴 sem automação) |

## Critérios de Aceitação

```gherkin
Cenário: Criar receita com vencimento futuro
  Dado um motorista autenticado
  Quando enviar POST /api/financeiro/lancamentos com tipo "receita" e dataVencimento futura
  Então deve retornar status 201 com status "pendente"

Cenário: Criar despesa já vencida
  Dado uma dataVencimento no passado
  Quando enviar POST com tipo "despesa"
  Então deve retornar com status "atrasado"

Cenário: Resumo mensal calcula inadimplência
  Dado 3 lançamentos: 2 receitas pagas (R$500 cada) e 1 receita atrasada (R$200)
  Quando acessar GET /api/financeiro/resumo
  Então inadimplência deve ser {valor: 200, percentual: ~16.67, quantidade: 1}
```

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/FinanceiroController.ts` | `FinanceiroController` | 🟢 |
| `backend/src/models/LancamentoModel.ts` | `LancamentoModel` | 🟢 |
| `backend/src/routes/financeiro.routes.ts` | Rotas | 🟢 |
| `backend/src/validators/financeiro.validator.ts` | Validações | 🟢 |
| `app/financeiro.tsx` | Tela listagem | 🟢 |
| `app/financeiro/novo.tsx` | Tela criação | 🟢 |
