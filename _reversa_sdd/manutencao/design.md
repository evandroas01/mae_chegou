# Manutenção — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| POST | `/api/manutencoes` | `ManutencaoCreate` | `Manutencao` | 201, 400, 403, 500 | admin, motorista |
| GET | `/api/manutencoes` | — | `Manutencao[]` com veículo | 200, 500 | todos autenticados |
| GET | `/api/manutencoes/veiculos` | — | `Veiculo[]` | 200, 500 | motorista |
| PUT | `/api/manutencoes/:id` | `Partial<Manutencao>` | `Manutencao` | 200, 400, 500 | admin, motorista |

## Fluxo Principal — Criação

1. Controller extrai: veiculoId, dataAgendada, tipo, descricao, custo, quilometragem, etc. 🟢
2. Valida veículo: `SELECT * FROM veiculos WHERE id = ? AND motoristaId = ? AND tenantId = ?` 🟢
3. Se veículo não encontrado → 403/404 🟢
4. Calcula status: `dataAgendada ? 'agendada' : 'realizada'` 🟢
5. Se realizada: `dataRealizada = now` 🟢
6. INSERT em `manutencoes` com tenantId 🟢
7. Retorna manutenção criada 🟢

## Dependências
- `auth` — middlewares 🟢
- Tabelas: `manutencoes`, `veiculos`, `documento_veiculos` 🟢

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Validação de propriedade do veículo antes de criar | `ManutencaoController.ts:28-35` | 🟢 |
| Status inferido na criação (não por job) | `ManutencaoController.ts:37` | 🟢 |
| Repetição é metadado (armazena tipo + intervalo mas sem automação) | `ManutencaoController.ts:53-54` | 🟢 |

## Riscos e Lacunas
- 🔴 Sem job para marcar manutenções agendadas como atrasadas
- 🔴 Repetição não automatizada (motorista deve criar manualmente)
- 🟡 Documentos de veículo (seguro, vistoria) sem endpoint de alerta de validade
