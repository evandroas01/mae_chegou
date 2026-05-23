# Financeiro — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| GET | `/api/financeiro/resumo` | query: `mes?, ano?` | `ResumoFinanceiro` | 200, 500 | todos autenticados |
| GET | `/api/financeiro/lancamentos` | query: `tipo?, status?, dataInicio?, dataFim?` | `Lancamento[]` | 200, 500 | todos autenticados |
| GET | `/api/financeiro/lancamentos/:id` | `id: string` | `Lancamento` | 200, 404, 500 | todos autenticados |
| POST | `/api/financeiro/lancamentos` | `LancamentoCreate` | `Lancamento` | 201, 400, 500 | admin, motorista |
| PUT | `/api/financeiro/lancamentos/:id` | `Partial<Lancamento>` | `Lancamento` | 200, 400, 500 | admin, motorista |
| DELETE | `/api/financeiro/lancamentos/:id` | `id: string` | — | 204, 500 | admin, motorista |

## Fluxo Principal — Criação de Lançamento

1. Controller extrai campos: tipo, categoria, valor, data, dataVencimento, descricao, etc. 🟢
2. Calcula status: `dataVencimento && dataVencimento < now ? 'atrasado' : 'pendente'` 🟢
3. `LancamentoModel.create(...)` → INSERT com tenantId 🟢
4. `LancamentoModel.findById(insertId)` → retorna lançamento criado 🟢

## Fluxo Principal — Resumo Financeiro

1. Calcula mês/ano corrente (ou do query param) 🟢
2. **Receitas do mês:** SUM(valor) WHERE tipo='receita' AND mês corrente 🟢
3. **Despesas do mês:** SUM(valor) WHERE tipo='despesa' AND mês corrente 🟢
4. **Saldo geral:** SUM receitas pagas - SUM despesas pagas (todo o histórico) 🟢
5. **Inadimplência:** SUM receitas atrasadas → valor, quantidade, percentual 🟢
6. Retorna `{saldoAtual, totalReceitasMes, totalDespesasMes, saldoMes, inadimplencia}` 🟢

## Fluxos Alternativos — Filtros
- `tipo`: filtra por `receita` ou `despesa` 🟢
- `status`: filtra por `pago`, `pendente` ou `atrasado` 🟢
- `dataInicio/dataFim`: filtra por intervalo de datas 🟢
- Todos os filtros são opcionais e combináveis 🟢

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Status calculado automaticamente na criação (não há cron/job) | `FinanceiroController.ts:29` | 🟢 |
| Resumo usa queries separadas (não uma única agregação) | `FinanceiroController.ts:136-198` | 🟢 |
| Recorrência é metadado, não gera lançamentos filhos | `LancamentoModel.ts:23-25` | 🟢 |
| Saldo geral inclui todo o histórico (não apenas mês) | `FinanceiroController.ts:169` | 🟢 |

## Riscos e Lacunas
- 🔴 Sem job/cron para atualizar status de lançamentos vencidos (pendente → atrasado)
- 🔴 Recorrência não materializa — lançamentos recorrentes precisam criação manual a cada mês
- 🟡 Resumo executa múltiplas queries separadas (potencial de inconsistência)
- 🟡 Sem paginação na listagem de lançamentos
