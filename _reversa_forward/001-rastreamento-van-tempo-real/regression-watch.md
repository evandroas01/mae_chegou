# Watch de Regressão - Rastreamento Van em Tempo Real

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| W001 | `legacy-impact.md` (Modificadas) | O sistema deve disparar notificação automática (rota_inicio, rota_fim) ao motorista ficar online/offline | presença | `gatilhoTipo` não ser populado com rota_inicio ou notificação não gerada ao iniciar rota. |
| W002 | `legacy-impact.md` (Modificadas) | Heartbeat do motorista deve expirar após 5 minutos sem atualização, constando como offline | presença | Endpoint `/motorista/status` retornar online para motorista sem ping recente |

## Histórico de re-extrações

## Arquivadas
