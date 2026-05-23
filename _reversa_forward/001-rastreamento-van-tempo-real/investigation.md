# Investigation: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`

---

## 1. Pesquisa de fundo

### Background location com Expo

A feature requer envio contínuo de GPS enquanto o motorista está online. O Expo fornece:

- **`expo-location`** (`^19.0.7`, já instalado) — suporta `startLocationUpdatesAsync` para tracking em background
- Requer permissão `ACCESS_FINE_LOCATION` + `ACCESS_BACKGROUND_LOCATION` (Android 10+)
- iOS requer `NSLocationAlwaysAndWhenInUseUsageDescription` em `app.json`
- O intervalo mínimo no background depende do OS, mas 10 segundos é alcançável com `foregroundService` no Android

### Padrão de heartbeat para status online

- Padrão comum em apps de messaging/ride-hailing: atualizar timestamp a cada envio de dados
- Timeout de 5 minutos é conservador e cobriria perda de conectividade temporária
- Verificação lazy (no momento da consulta) evita necessidade de scheduler/cron, que o legado não possui (DT-07)

### Polling vs WebSocket para rastreamento pelo responsável

- **Polling**: simples, sem mudança arquitetural, funciona com o Express existente
- **WebSocket**: mais eficiente, mas requer `ws` ou `socket.io`, mudança no server.ts, e não há precedente no projeto
- **SSE (Server-Sent Events)**: intermediário, mas suporte em React Native é limitado
- Decisão: polling de 10s é adequado para o caso de uso (transporte escolar, não ride-hailing)

---

## 2. Alternativas avaliadas

### 2.1 Tabela separada para status online

| Critério | `users.statusOnline` (escolhido) | Nova tabela `motorista_sessions` |
|----------|-----------------------------------|----------------------------------|
| Complexidade | Baixa (ALTER TABLE) | Média (CREATE TABLE + relação) |
| Performance | Sem JOIN extra | JOIN obrigatório |
| Histórico | Sem histórico de sessões | Permite auditoria de sessões |
| Escalabilidade | Limitada (1 status por user) | Permite sessões múltiplas |

**Decisão:** `users.statusOnline` por simplicidade. Se histórico de sessões for necessário no futuro, uma tabela `motorista_sessions` pode ser adicionada sem conflito.

### 2.2 Notificação push real vs in-app

| Critério | In-app (escolhido) | Push real (FCM/APNs) |
|----------|---------------------|----------------------|
| Complexidade | Baixa (reutiliza sistema existente) | Alta (nova dependência, config por plataforma) |
| UX | Responsável precisa abrir o app | Alerta mesmo com app fechado |
| Dependências | Nenhuma nova | `expo-notifications`, conta Firebase/Apple |
| Prazo | Imediato | +2-3 dias de configuração |

**Decisão:** In-app agora (decisão do stakeholder). Push como evolução futura.

### 2.3 Intervalo de GPS fixo vs adaptativo

| Critério | 10s fixo (escolhido) | Adaptativo (10s/30s) |
|----------|----------------------|----------------------|
| Implementação | Simples | Requer detecção de movimento |
| Precisão | Consistente | Variável |
| Bateria | Consumo constante | Economia quando parado |

**Decisão:** 10s fixo (decisão do stakeholder). Valor prioriza precisão.

---

## 3. Padrões aplicáveis

### Padrão existente no legado: Controller → Model → Pool

Os novos endpoints seguem o mesmo padrão:
- `RotaController.goOnline()` → `UserModel.setOnlineStatus()` + `NotificacaoModel.criarComGatilho()`
- Queries SQL puras via `mysql2` (sem ORM)
- Validação via `express-validator`
- Autenticação via middleware `authenticate` + `authorize('motorista')`

### Padrão existente: Notificação com destinatários

O fluxo de criação de notificação segue exatamente o padrão de `NotificacaoController.criar()`:
1. Inserir em `notificacoes` com `gatilhoTipo = 'rota_inicio'` ou `'rota_fim'`
2. Buscar responsáveis elegíveis
3. Inserir em `notificacao_destinatarios` para cada um

### Padrão existente: StatusOnlineContext

O `StatusOnlineContext.tsx` já provê `isOnline` e `setIsOnline`. A mudança é:
- Antes: estado local apenas (perde ao fechar app)
- Depois: sincronizado com backend (`PUT /api/rotas/online` e `PUT /api/rotas/offline`)

---

## 4. Referências externas

| Recurso | URL | Relevância |
|---------|-----|------------|
| Expo Location — Background Updates | https://docs.expo.dev/versions/latest/sdk/location/#background-location | Config de background tracking |
| react-native-maps | https://github.com/react-native-maps/react-native-maps | Renderização de mapa e marcadores |
| Android Background Location Limits | https://developer.android.com/about/versions/oreo/background-location-limits | Restrições de OS para GPS background |

---

## 5. Histórico

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-plan` | reversa |
