# Interface: GET /api/rotas/motorista/status

> Feature: `001-rastreamento-van-tempo-real`
> Tipo: HTTP REST
> Método: GET

---

## Descrição

Retorna o status online/offline do motorista vinculado ao responsável autenticado. Inclui verificação de timeout de heartbeat — se `lastHeartbeat` expirou (> 5 minutos), o motorista é considerado offline independentemente do campo `statusOnline`.

## Autenticação e autorização

- Header: `Authorization: Bearer <JWT>`
- Middleware: `authenticate` + `authorize('responsavel')` + `requireTenant`

## Request

**Headers:**
```
Authorization: Bearer <token>
```

**Query params:** nenhum

## Response

### 200 OK — Motorista online

```json
{
  "motoristaId": 42,
  "motoristaNome": "João Silva",
  "statusOnline": true,
  "lastHeartbeat": "2026-05-23T19:30:00.000Z",
  "veiculoId": 7,
  "veiculoPlaca": "ABC-1234"
}
```

### 200 OK — Motorista offline

```json
{
  "motoristaId": 42,
  "motoristaNome": "João Silva",
  "statusOnline": false,
  "lastHeartbeat": "2026-05-23T18:45:00.000Z",
  "veiculoId": 7,
  "veiculoPlaca": "ABC-1234"
}
```

### 200 OK — Motorista fantasma (heartbeat expirado)

Se `statusOnline = TRUE` mas `lastHeartbeat` > 5 minutos atrás:
- Retorna `statusOnline: false` na response
- **Efeito colateral**: atualiza `users.statusOnline = FALSE` no banco (correção lazy)
- **NÃO** dispara notificação de `rota_fim` (o motorista pode ter perdido conectividade temporariamente)

```json
{
  "motoristaId": 42,
  "motoristaNome": "João Silva",
  "statusOnline": false,
  "lastHeartbeat": "2026-05-23T19:20:00.000Z",
  "heartbeatExpirado": true,
  "veiculoId": 7,
  "veiculoPlaca": "ABC-1234"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `motoristaId` | number | ID do motorista vinculado |
| `motoristaNome` | string | Nome do motorista |
| `statusOnline` | boolean | `true` se online e heartbeat válido |
| `lastHeartbeat` | ISO 8601 / null | Último heartbeat; `null` se nunca ficou online |
| `heartbeatExpirado` | boolean (opcional) | Presente e `true` quando houve correção lazy |
| `veiculoId` | number | ID do veículo do motorista |
| `veiculoPlaca` | string | Placa do veículo |

### 404 Not Found

Responsável não tem motorista vinculado (nenhum aluno ativo).

```json
{
  "error": "Nenhum motorista vinculado encontrado"
}
```

### 401 Unauthorized / 403 Forbidden

Autenticação/autorização padrão.

## Cadeia de resolução

```
user(responsavel).id
  → alunos(responsavelId = user.id, status = 'ativo')
    → motoristaId (DISTINCT, deve ser 1)
      → users(id = motoristaId)
        → statusOnline, lastHeartbeat
      → veiculos(motoristaId)
        → id, placa
```

> 🟡 Se o responsável tiver alunos com motoristas diferentes, retornar o primeiro encontrado. Caso multi-motorista precise ser suportado no futuro, a response vira array.

## Timeout

Timeout padrão do ApiService frontend: 30 segundos.
