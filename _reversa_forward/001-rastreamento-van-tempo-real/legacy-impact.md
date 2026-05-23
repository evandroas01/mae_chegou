# Impacto no Legado - Rastreamento Van em Tempo Real

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `backend/src/database/migrate.ts` | MySQL | delta-de-dados | MEDIUM | Adicionadas colunas statusOnline e lastHeartbeat |
| `backend/src/models/UserModel.ts` | Backend API | regra-alterada | LOW | Inclusão de novas colunas no mapRowToUser |
| `backend/src/types/index.ts` | Backend API | regra-alterada | LOW | Inclusão de novas colunas |
| `backend/src/controllers/RotaController.ts` | Backend API | regra-nova | HIGH | Novos endpoints goOnline, goOffline, getMotoristaStatus |
| `backend/src/routes/rotas.routes.ts` | Backend API | regra-nova | HIGH | Rotas registradas |
| `contexts/StatusOnlineContext.tsx` | Frontend Mobile | regra-alterada | HIGH | Gerenciamento centralizado de localização e chamadas API |
| `services/rotaService.ts` | Frontend Mobile | regra-nova | LOW | Endpoints adicionados |
| `app/localizacao.tsx` | Frontend Mobile | regra-alterada | MEDIUM | Refatorado para exibir de acordo com statusMotorista endpoint |

## Diff Conceitual
A feature de rastreamento adicionou estado efêmero ao banco (`statusOnline` e `lastHeartbeat`).
O `RotaController` foi estendido com 3 rotas para gerenciar esse ciclo e disparar notificações (suprindo RN-53 parcialmente). 
O Frontend passou a usar o Expo Location no contexto global atrelado ao switch, permitindo que a localização continue sendo requisitada para a API, cujas atualizações de coordenada revalidam o heartbeat.

## Preservadas
- RN-43: Localização é append-only (sempre insere novo registro). Mantido intacto, e agora reforçado com renovação de heartbeat.
- RN-50: Envio de notificação para todos os responsáveis do tenant. (Utilizado no goOnline e goOffline para os responsáveis ativos do motorista).

## Modificadas
- RN-53 (Lacuna): Gatilhos automáticos previstos na DDL mas sem implementação. Parcialmente resolvida: agora rota_inicio e rota_fim disparam notificações automáticas no goOnline e goOffline.
