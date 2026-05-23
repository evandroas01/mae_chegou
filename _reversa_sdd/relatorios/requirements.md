# Relatórios

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Tela de relatórios com opções de exportação (PDF/CSV). **Apenas frontend** — sem backend dedicado, consome dados de outros módulos.

## Responsabilidades
- Exibir relatórios consolidados (financeiro, alunos, manutenção) 🟡
- Exportar relatórios em PDF/CSV 🔴 Não implementado

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Tela de relatórios com dados agregados | Should | Dados dos módulos consolidados |
| RF-02 | Exportação PDF/CSV | Could | 🔴 Não implementado |

## Rastreabilidade de Código

| Arquivo | Cobertura |
|---------|-----------|
| `app/relatorios.tsx` (4.7KB) | 🟡 Frontend-only |

## Lacunas Pendentes (🔴)
- Implementar backend de relatórios (endpoints de agregação)
- Implementar exportação PDF/CSV (ex: puppeteer ou jsPDF)
