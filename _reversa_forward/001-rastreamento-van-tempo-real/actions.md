# Actions: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`
> Roadmap: `_reversa_forward/001-rastreamento-van-tempo-real/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar migration para adicionar `statusOnline` e `lastHeartbeat` em `users` | - | `[//]` | `backend/src/database/migrate.ts` | 🟢 | `[X]` |
| T002 | Atualizar tipagem e modelo `UserModel` para incluir novos campos `statusOnline` e `lastHeartbeat` | - | `[//]` | `backend/src/models/UserModel.ts` | 🟢 | `[X]` |
| T003 | Adicionar definições dos endpoints de rotas/online/offline no `ApiService` do frontend | - | `[//]` | `src/services/ApiService.ts` | 🟢 | `[X]` |

## Fase 2, Testes

> Equipe não utiliza suite de testes mapeada. Pulado.

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar `PUT /api/rotas/online` e `PUT /api/rotas/offline` com update no banco | T002 | - | `backend/src/controllers/RotaController.ts` | 🟢 | `[X]` |
| T005 | Criar endpoint `GET /api/rotas/motorista/status` com verificação lazy de heartbeat (5min timeout) | T002 | - | `backend/src/controllers/RotaController.ts` | 🟡 | `[X]` |
| T006 | Atualizar `StatusOnlineContext` no frontend para sincronizar toggle com API e gerenciar `expo-location` background | T003 | - | `src/contexts/StatusOnlineContext.tsx` | 🟢 | `[X]` |
| T007 | Implementar tela de Rastreamento (Responsável) com mapa, polling 10s ao endpoint de status | T003, T005 | - | `app/localizacao.tsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Integrar NotificacaoService no `PUT online/offline` para disparar `rota_inicio` e `rota_fim` aos responsáveis vinculados | T004 | - | `backend/src/controllers/RotaController.ts` | 🟢 | `[X]` |
| T009 | Atualizar `POST /api/rotas/localizacao` para renovar `lastHeartbeat` do motorista no banco | T002 | - | `backend/src/controllers/RotaController.ts` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Integrar UI do toggle online/offline no Dashboard do motorista com tratamento de erro de permissão | T006 | - | `app/dashboard.tsx` | 🟢 | `[X]` |

## Notas de execução

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-to-do` | reversa |
