# Dashboard

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Painel principal do app com métricas consolidadas de múltiplos módulos. Exibe cards com totais (vagas, receita, inadimplência, manutenções pendentes) e atalhos rápidos. Sem controller dedicado — agrega dados de outros endpoints.

## Responsabilidades
- Exibir métricas consolidadas no painel principal 🟢
- Consumir resumo financeiro e contagem de alunos 🟢
- Fornecer atalhos de navegação para outros módulos 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Cards de métricas (vagas, receita, inadimplência) | Must | Dados reais dos endpoints |
| RF-02 | Atalhos de navegação para módulos | Should | Links funcionais |
| RF-03 | Lógica de cobrança | Could | 🔴 TODO no código |

## Critérios de Aceitação

```gherkin
Cenário: Dashboard carrega métricas
  Dado um motorista autenticado
  Quando acessar a tela inicial (dashboard)
  Então deve exibir cards com receita do mês, inadimplência e total de alunos
```

## Rastreabilidade de Código

| Arquivo | Cobertura |
|---------|-----------|
| `app/index.tsx` (23KB) | 🟢 Frontend |
| `GET /api/financeiro/resumo` | 🟢 Dados financeiros |
| `GET /api/alunos` | 🟢 Contagem alunos |
