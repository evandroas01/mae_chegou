# Notificações — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| POST | `/api/notificacoes` | `NotificacaoCreate` | `Notificacao` | 201, 400, 500 | admin, motorista |
| GET | `/api/notificacoes` | — | `Notificacao[]` | 200, 500 | todos autenticados |
| POST | `/api/notificacoes/:id/marcar-lida` | — | — | 200, 500 | todos autenticados |
| GET | `/api/notificacoes/responsaveis/disponiveis` | — | `User[]` | 200, 500 | motorista |

## Fluxo Principal — Criação

1. Controller extrai: tipo, titulo, mensagem, enviarAgora, destinatarioIds?, dataHoraAgendamento? 🟢
2. Define status: `enviarAgora ? 'enviada' : 'agendada'` 🟢
3. INSERT notificação com remetenteId = userId 🟢
4. Se tipo `especifico`: INSERT em `notificacao_destinatarios` para cada ID 🟢
5. Se tipo `todos`: busca todos users com role `responsavel` do tenant → INSERT para cada 🟢
6. Retorna notificação criada 🟢

## Fluxo — Listagem por Role

- **Motorista/Admin:** SELECT com JOIN para incluir contagem de destinatários 🟢
- **Responsável:** SELECT com JOIN `notificacao_destinatarios WHERE destinatarioId = userId` 🟢

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Leitura rastreada por destinatário (não globalmente) | `NotificacaoController.ts:138-160` | 🟢 |
| Broadcast resolve todos os responsáveis no momento da criação | `NotificacaoController.ts:54-70` | 🟢 |
| Sem scheduler para notificações agendadas | `NotificacaoController.ts:23` | 🟢 |

## Riscos e Lacunas
- 🔴 Notificações agendadas nunca são enviadas (sem scheduler/cron)
- 🔴 Gatilhos automáticos (rota_inicio, faturamento, etc.) previstos mas sem implementação
- 🟡 Sem push notification real (apenas in-app)
- 🟡 Sem paginação na listagem
