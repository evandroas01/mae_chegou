# Roadmap: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`
> Requirements: `_reversa_forward/001-rastreamento-van-tempo-real/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A feature será implementada como **delta mínimo** sobre a infraestrutura existente. O legado já possui: tabela `localizacao_veiculos` (append-only), endpoints de localização (`POST /api/rotas/localizacao`, `GET /api/rotas/localizacao/:veiculoId`, `GET /api/rotas/localizacao/motorista`), `StatusOnlineContext` no frontend, e sistema de notificações com gatilhos previstos (`rota_inicio`, `rota_fim`) mas não implementados.

A abordagem consiste em: (1) adicionar campo `statusOnline` + `lastHeartbeat` na tabela `users` para persistir o estado do motorista, (2) criar dois novos endpoints no backend para toggle online/offline com disparo automático de notificações in-app, (3) implementar envio contínuo de GPS a cada 10s no frontend via `expo-location` background task, (4) criar tela de rastreamento para o responsável com polling de 10s, (5) implementar mecanismo de timeout no backend para expirar motoristas fantasma.

## 2. Princípios aplicados

> Arquivo `.reversa/principles.md` não encontrado. Nenhum princípio registrado para avaliação.

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Persistir `statusOnline` e `lastHeartbeat` como campos na tabela `users` existente | Evita criar tabela nova para um dado simples; `users` já é carregada em toda autenticação | Criar tabela `motorista_status` separada (overhead desnecessário para 2 campos) | 🟢 |
| D-02 | Notificações in-app via sistema existente (`notificacoes` + `notificacao_destinatarios`) | Reutiliza infraestrutura existente; push notification (FCM/APNs) fica como evolução futura | Implementar push real agora (complexidade alta, fora do escopo) | 🟢 |
| D-03 | GPS contínuo via `expo-location` `startLocationUpdatesAsync` com intervalo de 10s | Expo Location já é dependência do projeto (`^19.0.7`); suporta background nativo | `react-native-background-geolocation` (dependência externa adicional, mais complexa) | 🟢 |
| D-04 | Polling no lado do responsável (10s) ao invés de WebSocket | O legado não usa WebSocket em nenhum ponto; adicionar seria mudança arquitetural grande; polling sobre o endpoint existente é simples e suficiente | WebSocket / SSE (requer infra nova no Express, sem precedente no projeto) | 🟡 |
| D-05 | Timeout de heartbeat no backend (5 minutos) para expirar motorista fantasma | Protege contra app crash ou perda de conectividade; verificação lazy no momento da consulta | Job/cron periódico (complexidade adicional, sem scheduler no legado — DT-07) | 🟡 |
| D-06 | Online independente de rota — sem vínculo com máquina de estados `nao_iniciada → em_andamento → finalizada` | Decisão do stakeholder (clarify 2026-05-23); flexibilidade para o motorista sinalizar operação sem criar rota | Vincular online ao ciclo de rota (limita uso) | 🟢 |
| D-07 | Buscar responsáveis via cadeia `alunos(motoristaId, status='ativo') → responsavelId → users(role='responsavel')` | Reutiliza a cadeia RN-42 já mapeada; filtra por alunos ativos conforme RN-13 | Buscar todos os responsáveis do tenant (notificaria responsáveis sem vínculo ativo) | 🟢 |

## 4. Premissas

> Todas as dúvidas foram resolvidas na sessão de clarify (2026-05-23). Nenhuma premissa pendente.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| **UserModel** | `_reversa_sdd/code-analysis.md#auth` | regra-alterada | Adicionar campos `statusOnline` (boolean) e `lastHeartbeat` (datetime) |
| **RotaController** | `_reversa_sdd/code-analysis.md#rotas` | regra-alterada | Adicionar métodos `goOnline()` e `goOffline()` com disparo de notificação; atualizar `salvarLocalizacao()` para refresh do heartbeat |
| **rotas.routes** | `_reversa_sdd/code-analysis.md#rotas` | contrato-novo | `PUT /api/rotas/online` e `PUT /api/rotas/offline` |
| **NotificacaoController** | `_reversa_sdd/code-analysis.md#notificacoes` | regra-alterada | Implementar lógica de gatilho `rota_inicio` e `rota_fim` |
| **StatusOnlineContext** | `_reversa_sdd/inventory.md#Contexts` | regra-alterada | Integrar com backend (chamada real ao invés de estado local); iniciar/parar GPS background |
| **localizacaoService** | `_reversa_sdd/inventory.md#Services` | regra-alterada | Adicionar `startTracking()` e `stopTracking()` com `expo-location` background |
| **Tela de rastreamento** | `_reversa_sdd/inventory.md#app/localizacao.tsx` | regra-alterada | Implementar mapa com polling de 10s e indicador de status online |
| **Dashboard** | `_reversa_sdd/code-analysis.md#dashboard` | regra-alterada | Integrar toggle online/offline no dashboard do motorista |
| **migrate.ts** | `_reversa_sdd/inventory.md#backend/database` | regra-alterada | ALTER TABLE `users` para adicionar 2 campos |

## 6. Delta no modelo de dados

- Resumo das mudanças: 2 campos novos na tabela `users` (`statusOnline`, `lastHeartbeat`); nenhuma tabela nova; nenhuma tabela removida
- Detalhe completo em: `_reversa_forward/001-rastreamento-van-tempo-real/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|---------------------|
| `PUT /api/rotas/online` | HTTP | `_reversa_forward/001-rastreamento-van-tempo-real/interfaces/rotas-online.md` |
| `PUT /api/rotas/offline` | HTTP | `_reversa_forward/001-rastreamento-van-tempo-real/interfaces/rotas-offline.md` |
| `GET /api/rotas/motorista/status` | HTTP | `_reversa_forward/001-rastreamento-van-tempo-real/interfaces/motorista-status.md` |

## 8. Plano de migração

1. Executar migration: `ALTER TABLE users ADD COLUMN statusOnline BOOLEAN DEFAULT FALSE, ADD COLUMN lastHeartbeat DATETIME NULL`
2. Nenhuma migração de dados — campos novos com defaults seguros (offline, null)
3. Deploy backend antes do frontend — os novos endpoints devem estar disponíveis quando o app atualizado for distribuído

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| GPS contínuo drena bateria do motorista | Alto | Média | Accuracy balanceada (`Accuracy.Balanced`); parar GPS ao ficar offline; monitorar feedback dos motoristas |
| Motorista fantasma (app crash sem desligar) | Médio | Média | Heartbeat refresh a cada envio de GPS; timeout de 5 minutos no backend; verificação lazy na consulta |
| Polling de 10s gera carga no backend com muitos responsáveis simultâneos | Médio | Baixa | Endpoint de leitura é leve (SELECT com LIMIT 1); se necessário, adicionar cache simples em memória |
| Permissão de background location negada pelo OS | Alto | Média | Validar permissão antes de ativar online; exibir instrução clara para o motorista conceder permissão |
| Notificação in-app não vista pelo responsável (app fechado) | Médio | Alta | Aceito como limitação desta versão; push notification planejado como evolução futura |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Motorista consegue ativar/desativar online no dashboard
- [ ] Responsáveis vinculados recebem notificação in-app ao motorista ficar online/offline
- [ ] GPS é enviado a cada 10s enquanto motorista está online
- [ ] Responsável vê posição da van atualizada no mapa a cada 10s
- [ ] Motorista fantasma expira após 5 minutos sem heartbeat
- [ ] `regression-watch.md` gerado

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-plan` | reversa |
