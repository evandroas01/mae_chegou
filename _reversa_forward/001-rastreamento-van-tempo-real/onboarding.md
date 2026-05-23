# Onboarding: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`

Passo a passo para testar a feature pela primeira vez.

---

## Pré-requisitos

1. Backend rodando (`npm run dev` em `backend/`)
2. MySQL rodando (`docker compose up -d`)
3. Migration executada (nova coluna `statusOnline` e `lastHeartbeat` em `users`)
4. Pelo menos 1 motorista e 1 responsável cadastrados, com aluno ativo vinculando ambos
5. App frontend rodando (`npx expo start`)

---

## Fluxo 1: Motorista fica online

1. Faça login como **motorista**
2. No dashboard, localize o controle de "Ficar Online"
3. Toque no toggle para ativar
4. **Esperado:**
   - Toggle muda de estado visual (cor, ícone)
   - Permissão de localização é solicitada (se primeira vez)
   - GPS começa a ser capturado (verifique no terminal do backend os logs de `POST /api/rotas/localizacao`)
5. Aguarde ~30 segundos e verifique no banco:
   ```sql
   SELECT statusOnline, lastHeartbeat FROM users WHERE id = <motoristaId>;
   -- Deve retornar: statusOnline = 1, lastHeartbeat = timestamp recente
   ```

## Fluxo 2: Responsável recebe notificação

1. Abra outra instância do app (ou outro dispositivo) e faça login como **responsável**
2. Vá até a tela de notificações
3. **Esperado:** Notificação com título indicando que o motorista está online
4. Verifique no banco:
   ```sql
   SELECT * FROM notificacoes WHERE gatilhoTipo = 'rota_inicio' ORDER BY id DESC LIMIT 1;
   SELECT * FROM notificacao_destinatarios WHERE notificacaoId = <id_acima>;
   ```

## Fluxo 3: Responsável acompanha no mapa

1. Com o motorista online, no app do responsável acesse a tela de localização/rastreamento
2. **Esperado:**
   - Mapa exibido com marcador na posição da van
   - Indicador de "Motorista online" visível
   - Posição atualiza a cada ~10 segundos
3. No app do motorista, mova-se fisicamente (ou use mock de localização do emulador)
4. **Esperado:** Marcador no mapa do responsável se move conforme nova posição

## Fluxo 4: Motorista fica offline

1. No app do motorista, toque no toggle para desativar (ficar offline)
2. **Esperado:**
   - Toggle volta ao estado offline
   - GPS para de ser capturado
   - Notificação de encerramento criada para os responsáveis
3. No app do responsável:
   - Nova notificação de "motorista encerrou operação"
   - Mapa mostra indicador "offline" ou última posição conhecida sem atualização

## Fluxo 5: Timeout de motorista fantasma

1. Coloque o motorista online
2. Force o fechamento do app do motorista (kill process)
3. Aguarde 5+ minutos
4. No app do responsável, consulte o status do motorista
5. **Esperado:** O backend deve reportar o motorista como offline (heartbeat expirado)

---

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Permissão de GPS negada | Usuário negou permissão de background location | Revogar e conceder novamente em Configurações do dispositivo |
| GPS não envia em background (Android) | Falta configuração de foreground service | Verificar `app.json` — `expo-location` config |
| Notificação não aparece | Responsável não vinculado ao motorista ou alunos inativos | Verificar tabela `alunos` — `status = 'ativo'` e `motoristaId` correto |
| Mapa não atualiza | Polling não configurado ou endpoint retornando erro | Verificar console do app e logs do backend |

---

## Histórico

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-plan` | reversa |
