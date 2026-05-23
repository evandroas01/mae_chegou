# Dashboard — Design Técnico

> Spec gerada pelo **Redator** do Reversa

## Interface
Sem backend dedicado. Consome:
- `GET /api/financeiro/resumo` → receitas, despesas, saldo, inadimplência 🟢
- `GET /api/alunos` → contagem de alunos (via `.length`) 🟢
- Dados mock para vagas e manutenções 🟡

## Frontend
- `app/index.tsx` (23KB) — dashboard rico com cards, gráficos e atalhos 🟢
- Layout responsivo com grid de métricas 🟢
- Seções condicionais por role do usuário 🟡

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Sem controller próprio — composição de dados no frontend | Ausência de DashboardController | 🟢 |
| Dados de vagas e manutenção pendente provavelmente mock | `app/index.tsx:84` TODO de cobrança | 🟡 |
| Gráficos renderizados com dados dos endpoints | `app/index.tsx` | 🟡 |

## Riscos e Lacunas
- 🔴 Lógica de cobrança não implementada (TODO)
- 🟡 Múltiplas chamadas API ao carregar (sem endpoint BFF dedicado)
- 🟡 Dados de vagas sem fonte confirmada
