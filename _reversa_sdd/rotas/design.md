# Rotas — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| POST | `/api/rotas` | `RotaCreate` com pontos | `Rota` | 201, 400, 500 | admin, motorista |
| GET | `/api/rotas` | — | `Rota[]` | 200, 500 | todos autenticados |
| GET | `/api/rotas/:id` | `id` | `Rota` com pontos | 200, 404, 500 | todos autenticados |
| PUT | `/api/rotas/:id` | `Partial<Rota>` | `Rota` | 200, 400, 500 | admin, motorista |
| POST | `/api/rotas/:id/iniciar` | — | `Rota` | 200, 404, 500 | admin, motorista |
| POST | `/api/rotas/:id/finalizar` | — | `Rota` | 200, 404, 500 | admin, motorista |
| GET | `/api/rotas/localizacao/:veiculoId` | `veiculoId` | `LocalizacaoVeiculo` | 200, 404, 500 | todos autenticados |
| GET | `/api/rotas/localizacao-motorista` | — (JWT) | `LocalizacaoVeiculo` | 200, 404, 500 | todos autenticados |
| POST | `/api/rotas/localizacao` | `{veiculoId, lat, lng, velocidade?, direcao?}` | `LocalizacaoVeiculo` | 201, 500 | admin, motorista |

## Fluxo Principal — Criação de Rota

1. Controller extrai: periodo, data, veiculoId, pontos[] 🟢
2. `RotaModel.create(...)` insere rota com `status = 'nao_iniciada'` 🟢
3. Para cada ponto no array: INSERT em `ponto_rotas` com `ordem = index` 🟢
4. Retorna rota com pontos 🟢

## Fluxo — Iniciar Rota

1. Busca rota por ID + tenantId 🟢
2. UPDATE: `status = 'em_andamento'`, `horaInicio = NOW()` 🟢
3. Retorna rota atualizada 🟢
4. 🔴 TODO no frontend: notificar responsáveis (não implementado)

## Fluxo — Localização do Motorista (pelo Responsável)

1. Extrai `motoristaId` do user autenticado (responsável) 🟢
2. Busca veículos do motorista: `SELECT * FROM veiculos WHERE motoristaId = ?` 🟢
3. Para cada veículo: busca última localização `ORDER BY timestamp DESC LIMIT 1` 🟢
4. Retorna array de localizações 🟢

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Localização append-only (INSERT, nunca UPDATE) | `RotaModel.ts:158` | 🟢 |
| Sem validação de transição de estado | `RotaController.ts:163-191` | 🟢 |
| Pontos ordenados por index do array (não campo explícito do request) | `RotaController.ts:39` | 🟢 |
| Responsável rastreia por cadeia multi-table | `RotaController.ts:272-300` | 🟢 |

## Riscos e Lacunas
- 🔴 Sem validação de transição (pode re-iniciar rota finalizada)
- 🔴 Notificação de responsáveis ao iniciar/finalizar: TODO no frontend
- 🟡 Sem WebSocket — responsável precisa fazer polling para localização em tempo real
- 🟡 Localização append-only pode crescer sem controle (sem TTL/limpeza)
