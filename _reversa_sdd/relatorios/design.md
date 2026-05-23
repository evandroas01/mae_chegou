# Relatórios — Design Técnico

> Spec gerada pelo **Redator** do Reversa

## Interface
🔴 Sem backend dedicado. Consome endpoints de `financeiro`, `alunos` e `manutencao`.

## Frontend
- `app/relatorios.tsx` (4.7KB) — tela com opções de relatório e botões de exportação 🟢
- Exportação PDF/CSV prevista na UI mas sem implementação funcional 🔴

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Sem controller próprio — agrega dados de outros módulos | Ausência de `RelatórioController` | 🟢 |
| Exportação prevista na UI | `relatorios.tsx` botões PDF/CSV | 🟢 |

## Riscos e Lacunas
- 🔴 Sem exportação funcional (PDF/CSV)
- 🟡 Pode necessitar endpoints de agregação dedicados para performance
