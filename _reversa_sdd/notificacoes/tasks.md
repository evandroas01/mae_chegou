# Notificações — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Pré-requisitos
- [ ] Tabelas `notificacoes`, `notificacao_destinatarios` criadas
- [ ] Módulo `autenticacao` implementado

## Tarefas

- [ ] T-01: Implementar model de notificações (create, findAll com JOINs, marcarLida)
  - Origem: `backend/src/controllers/NotificacaoController.ts:1-193`
  - Confiança: 🟢

- [ ] T-02: Implementar lógica de broadcast (buscar todos responsáveis do tenant)
  - Origem: `backend/src/controllers/NotificacaoController.ts:54-70`
  - Confiança: 🟢

- [ ] T-03: Implementar controller, validadores e rotas
  - Origem: `NotificacaoController.ts`, `notificacoes.routes.ts`
  - Confiança: 🟢

- [ ] T-04: Implementar tela frontend
  - Origem: `app/notificacoes.tsx`
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste broadcast cria registro para cada responsável
- [ ] TT-02: Teste marcar como lida atualiza destinatário específico
- [ ] TT-03: Teste responsável vê apenas suas notificações

## Lacunas Pendentes (🔴)
- Implementar scheduler para notificações agendadas
- Implementar gatilhos automáticos (rota_inicio, faturamento, etc.)
- Implementar push notifications (Expo Notifications)
