# Requirements: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Permitir que o **motorista** sinalize que está online (iniciando a operação do dia) e que os **responsáveis** vinculados a ele recebam uma **notificação automática** informando que a van está em operação. A partir desse momento, os responsáveis devem poder **acompanhar a localização da van em tempo real** num mapa interativo, até que o motorista encerre a operação (fique offline). Esta feature resolve a lacuna de rastreamento incompleto identificada no legado — a infraestrutura de GPS e localização existe, mas falta o fluxo integrado de notificação + acompanhamento contínuo.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#Integrações Externas` | GPS/Geolocalização configurado via Expo Location API; Google Maps/Apple Maps via react-native-maps | 🟢 |
| `_reversa_sdd/architecture.md#ERD Resumido` | Tabela `localizacao_veiculos` existe com campos latitude, longitude, timestamp, velocidade, direção | 🟢 |
| `_reversa_sdd/architecture.md#Dívidas Técnicas` | DT-07: Scheduler de notificações ausente — notificações agendadas nunca são enviadas | 🟢 |
| `_reversa_sdd/domain.md#Rotas & Localização` | RN-42: Responsável rastreia motorista via cadeia `user.motoristaId → veículos → localização (último registro)` | 🟢 |
| `_reversa_sdd/domain.md#Rotas & Localização` | RN-43: Localização é append-only — nunca atualiza, sempre insere novo registro | 🟢 |
| `_reversa_sdd/domain.md#Notificações` | RN-50: Tipo `todos` busca todos responsáveis do tenant e cria registro de destinatário para cada um | 🟢 |
| `_reversa_sdd/domain.md#Notificações` | RN-53: Gatilhos automáticos (rota_inicio, rota_fim) previstos na DDL mas sem implementação | 🔴 |
| `_reversa_sdd/code-analysis.md#rotas` | Endpoints existentes: `POST /api/rotas/localizacao` (salvar GPS), `GET /api/rotas/localizacao/:veiculoId` (última posição), `GET /api/rotas/localizacao/motorista` (responsável busca do seu motorista) | 🟢 |
| `_reversa_sdd/code-analysis.md#notificacoes` | Gatilhos `rota_inicio` e `rota_fim` previstos no schema mas sem lógica de disparo | 🔴 |
| `_reversa_sdd/inventory.md#Contexts` | `StatusOnlineContext.tsx` — Context React para status online/offline do motorista já existe no frontend | 🟢 |
| `_reversa_sdd/state-machines.md#Rota` | Máquina de estados: `nao_iniciada → em_andamento → finalizada` | 🟢 |
| `_reversa_sdd/domain.md#TODOs` | `app/rotas.tsx:44,62` — TODO: Notificar responsáveis quando rota inicia/finaliza | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Motorista** | Sinalizar que está iniciando a operação (online) e enviar localização GPS continuamente | Abre o app, toca "Ficar Online", o sistema começa a enviar coordenadas GPS e notifica os responsáveis |
| **Responsável** | Saber quando a van está em operação e acompanhar sua posição em tempo real | Recebe notificação in-app "Seu motorista está online", abre o app e vê o mapa com a posição da van atualizada |
| **Responsável** | Saber quando a van encerrou a operação | Recebe notificação "Seu motorista encerrou a operação" e o mapa para de atualizar |

## 4. Regras de negócio novas ou alteradas

1. **RN-NEW-01:** Quando o motorista ativa o status "online", o sistema deve criar automaticamente uma notificação **in-app** do tipo `rota_inicio` para **todos** os responsáveis vinculados a ele (via cadeia `alunos.motoristaId → alunos.responsavelId → users`). Push notification real (FCM/APNs) fica como evolução futura. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-53` (gatilho previsto mas não implementado)
   - Tipo: nova (implementa gatilho já previsto)
   - Decisão: notificação in-app nesta versão; push notification como evolução futura (sessão clarify 2026-05-23)

2. **RN-NEW-02:** Quando o motorista desativa o status "online" (fica offline), o sistema deve criar automaticamente uma notificação **in-app** do tipo `rota_fim` para os mesmos responsáveis. Push notification real fica como evolução futura. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-53` (gatilho previsto mas não implementado)
   - Tipo: nova (implementa gatilho já previsto)
   - Decisão: notificação in-app nesta versão (sessão clarify 2026-05-23)

3. **RN-NEW-03:** Enquanto o motorista estiver online, o app deve capturar e enviar coordenadas GPS do dispositivo a cada **10 segundos** (intervalo fixo) para o endpoint existente `POST /api/rotas/localizacao` 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-43` (localização append-only já existe)
   - Tipo: alterada (ativa o envio contínuo que hoje é manual/pontual)
   - Decisão: intervalo fixo de 10 segundos, sem configuração pelo motorista (sessão clarify 2026-05-23)

4. **RN-NEW-04:** O responsável deve visualizar a localização da van do seu motorista em um mapa, com atualização periódica enquanto o motorista estiver online 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-42` (cadeia de rastreamento já definida)
   - Tipo: alterada (transforma consulta pontual em acompanhamento contínuo)

5. **RN-NEW-05:** Somente responsáveis cujos alunos estejam com `status = 'ativo'` e vinculados ao motorista devem receber a notificação e ter acesso ao rastreamento 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-13` (motorista vê apenas alunos ativos)
   - Tipo: nova (restrição de segurança derivada do legado)

6. **RN-NEW-06:** O status online/offline do motorista deve ser persistido no backend para que o responsável possa consultar se o motorista está em operação antes de abrir o mapa 🟡
   - Origem no legado: `_reversa_sdd/inventory.md#Contexts` (StatusOnlineContext existe no frontend mas sem persistência backend)
   - Tipo: nova

7. **RN-NEW-07:** O status "online" do motorista é **independente** do módulo de rotas. O motorista pode ficar online sem criar ou iniciar nenhuma rota — o online sinaliza que está em operação e ativa o rastreamento GPS, sem vínculo obrigatório com o ciclo de vida de rotas (`nao_iniciada → em_andamento → finalizada`) 🟢
   - Origem no legado: `_reversa_sdd/state-machines.md#Rota` (máquina de estados existente permanece inalterada)
   - Tipo: nova (decisão de escopo)
   - Decisão: online independente de rota (sessão clarify 2026-05-23)

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | O motorista deve poder ativar/desativar o status "online" com um controle visível na tela principal | Must | Toggle acessível no dashboard; estado refletido visualmente (ícone, cor, texto) | 🟢 |
| RF-02 | Ao ativar o status online, o backend deve registrar o status e disparar notificação automática para todos os responsáveis vinculados | Must | Registro criado em `notificacoes` + `notificacao_destinatarios` com gatilho `rota_inicio`; status do motorista persistido | 🟡 |
| RF-03 | Ao desativar o status online, o backend deve registrar e disparar notificação automática de encerramento | Must | Notificação com gatilho `rota_fim` criada para os mesmos responsáveis | 🟡 |
| RF-04 | Enquanto online, o app do motorista deve capturar coordenadas GPS e enviar ao backend periodicamente | Must | Registros em `localizacao_veiculos` inseridos a cada intervalo configurado; coordenadas válidas | 🟢 |
| RF-05 | O responsável deve ver a posição da van do seu motorista em um mapa com atualização automática | Must | Mapa com marcador na última posição conhecida; atualização periódica sem reload manual | 🟢 |
| RF-06 | O responsável deve receber notificação quando o motorista ficar online | Must | Notificação visível na listagem de notificações do app com título e mensagem claros | 🟢 |
| RF-07 | O responsável deve receber notificação quando o motorista ficar offline | Should | Notificação visível na listagem de notificações do app | 🟢 |
| RF-08 | O responsável deve poder ver na tela de rastreamento se o motorista está online ou offline | Should | Indicador visual (badge/status) no mapa ou tela de localização | 🟡 |
| RF-09 | O sistema deve parar de enviar GPS automaticamente quando o motorista ficar offline ou o app fechar | Must | Nenhum registro de localização inserido após o motorista ficar offline; GPS do dispositivo liberado | 🟢 |
| RF-10 | O motorista deve poder ver sua própria posição no mapa enquanto online | Could | Mapa com marcador de "minha posição" visível durante a operação | 🟡 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | O envio de coordenadas GPS deve ocorrer a cada **10 segundos** (intervalo fixo, não configurável pelo motorista) | Decisão do stakeholder (sessão clarify 2026-05-23): prioriza precisão sobre economia de bateria | 🟢 |
| Desempenho | O mapa do responsável deve atualizar a posição a cada 10-15 segundos via polling ao endpoint existente | O endpoint `GET /api/rotas/localizacao/:veiculoId` já existe e retorna a última posição | 🟢 |
| Bateria | O envio contínuo de GPS deve usar estratégias de economia de bateria (background location com accuracy balanceada) | Expo Location API suporta `startLocationUpdatesAsync` com configuração de accuracy | 🟢 |
| Segurança | Apenas responsáveis autenticados e vinculados ao motorista (via tenant + motoristaId) devem acessar a localização | Middleware `requireTenant` + validação de `motoristaId` já existem no legado | 🟢 |
| Confiabilidade | Se o app do motorista for fechado abruptamente, o status online deve expirar após timeout configurável no backend | Evita "motorista fantasma" online indefinidamente | 🟡 |
| Observabilidade | O backend deve logar cada mudança de status online/offline com timestamp e userId | Rastreabilidade para suporte e debugging | 🟡 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Motorista fica online e responsáveis são notificados
  Dado que o motorista "João" está logado e possui 3 responsáveis vinculados com alunos ativos
  Quando João ativa o status "online"
  Então o status do motorista deve ser registrado como "online" no backend
  E uma notificação com gatilho "rota_inicio" deve ser criada
  E 3 registros de destinatários devem ser criados em notificacao_destinatarios
  E o app deve iniciar a captura e envio de coordenadas GPS a cada 10 segundos

Cenário: Responsável acompanha a van em tempo real
  Dado que o motorista "João" está online
  E a responsável "Maria" está logada e vinculada ao motorista João
  Quando Maria abre a tela de rastreamento
  Então o mapa deve exibir a posição da van com base na última localização registrada
  E o mapa deve atualizar a posição automaticamente a cada 10 segundos

Cenário: Motorista fica offline e responsáveis são notificados
  Dado que o motorista "João" está online e com GPS ativo
  Quando João desativa o status "online"
  Então o status deve ser registrado como "offline" no backend
  E uma notificação com gatilho "rota_fim" deve ser criada para os responsáveis vinculados
  E o envio de coordenadas GPS deve ser interrompido

Cenário: Responsável sem alunos ativos não recebe notificação
  Dado que o motorista "João" tem o responsável "Carlos" vinculado
  E todos os alunos de Carlos estão com status "inativo"
  Quando João ativa o status "online"
  Então Carlos NÃO deve receber notificação de rota_inicio
  E Carlos NÃO deve ter acesso ao rastreamento em tempo real

Cenário: App do motorista é fechado abruptamente
  Dado que o motorista "João" está online
  Quando o app é encerrado sem que João desative o status
  Então o backend deve considerar o motorista offline após o timeout configurado
  E os responsáveis NÃO devem receber notificação de rota_fim até o timeout expirar
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Ponto de entrada da feature — sem toggle, nada funciona |
| RF-02 | Must | Core — vincula o status online à notificação automática |
| RF-03 | Must | Complemento essencial — responsáveis precisam saber quando encerrou |
| RF-04 | Must | Sem GPS contínuo, não há rastreamento em tempo real |
| RF-05 | Must | Entrega de valor principal para o responsável |
| RF-06 | Must | Responsável precisa saber que pode abrir o mapa |
| RF-07 | Should | Útil mas não bloqueia o uso — responsável pode ver no mapa que parou |
| RF-08 | Should | Melhora UX mas o mapa já mostra se há atualização |
| RF-09 | Must | Segurança e economia de recursos — GPS não pode ficar ativo indefinidamente |
| RF-10 | Could | Nice-to-have — motorista pode validar que seu GPS está funcionando |
| RNF de bateria | Should | Impacta adoção — bateria drenada = motorista desliga a feature |
| RNF de timeout | Should | Evita estado inconsistente mas é edge case |

## 9. Esclarecimentos

### Sessão 2026-05-23

- **Q:** O sistema legado não possui push notifications implementadas. A notificação de "motorista online" deve funcionar apenas como notificação in-app ou é necessário implementar push notification real (FCM/APNs)?
  **R:** In-app agora, push depois. As notificações desta feature serão visíveis apenas dentro do app (listagem de notificações). Push notification real (FCM/APNs) fica como evolução futura, não faz parte do escopo desta feature.

- **Q:** Qual deve ser o intervalo entre capturas de GPS? Valor fixo ou configurável pelo motorista?
  **R:** 10 segundos fixo. O intervalo é fixo e não configurável pelo motorista. Prioriza precisão do rastreamento.

- **Q:** O status "online" do motorista é independente de ter uma rota ativa, ou deve estar vinculado ao módulo de rotas existente?
  **R:** Independente de rota. O motorista pode ficar online sem criar ou iniciar nenhuma rota. O online sinaliza que está em operação e ativa o rastreamento GPS. O módulo de rotas continua funcionando de forma independente.

## 10. Lacunas

> Todas as dúvidas foram resolvidas na sessão de esclarecimento de 2026-05-23. Nenhuma lacuna pendente.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-05-23 | Sessão de esclarecimento: 3 dúvidas resolvidas (push in-app, GPS 10s fixo, online independente de rota) | reversa-clarify |
