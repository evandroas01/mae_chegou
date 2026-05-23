# Dashboard — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Tarefas

- [ ] T-01: Implementar tela de dashboard com cards de métricas
  - Origem: `app/index.tsx:1-400`
  - Critério de pronto: Cards para receita, inadimplência, alunos, manutenções
  - Confiança: 🟢

- [ ] T-02: Integrar com endpoints reais (financeiro/resumo, alunos)
  - Origem: `app/index.tsx`
  - Critério de pronto: Dados reais substituem mock
  - Confiança: 🟢

- [ ] T-03: Implementar gráficos (receita mensal, inadimplência)
  - Origem: `app/index.tsx`
  - Critério de pronto: Gráficos com dados reais
  - Confiança: 🟡

## Tarefas de Teste

- [ ] TT-01: Teste dashboard carrega com dados do resumo financeiro

## Lacunas Pendentes (🔴)
- Implementar lógica de cobrança
- Considerar endpoint BFF que agregue todos os dados do dashboard em uma única chamada
