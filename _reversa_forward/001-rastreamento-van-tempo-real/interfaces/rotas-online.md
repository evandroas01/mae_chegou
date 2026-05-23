# Interface: PUT /api/rotas/online

> Feature: `001-rastreamento-van-tempo-real`
> Tipo: HTTP REST
> Método: PUT

---

## Descrição

Ativa o status online do motorista autenticado. Persiste `statusOnline = TRUE` e `lastHeartbeat = NOW()` na tabela `users`. Dispara notificação in-app do tipo `rota_inicio` para todos os responsáveis vinculados (alunos ativos).

## Autenticação e autorização

- Header: `Authorization: Bearer <JWT>`
- Middleware: `authenticate` + `authorize('motorista')` + `requireTenant`

## Request

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** nenhum (empty body)

## Response

### 200 OK

```json
{
  "message": "Motorista online",
  "statusOnline": true,
  "lastHeartbeat": "2026-05-23T19:30:00.000Z",
  "notificacoesEnviadas": 3
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `statusOnline` | boolean | Sempre `true` nesta resposta |
| `lastHeartbeat` | ISO 8601 | Timestamp do momento da ativação |
| `notificacoesEnviadas` | number | Quantidade de responsáveis notificados |

### 409 Conflict

Motorista já está online.

```json
{
  "error": "Motorista já está online",
  "statusOnline": true,
  "lastHeartbeat": "2026-05-23T19:25:00.000Z"
}
```

### 401 Unauthorized

Token inválido ou ausente.

### 403 Forbidden

Usuário autenticado não tem role `motorista`.

### 500 Internal Server Error

Erro interno (falha de banco, etc).

## Idempotência

Não idempotente. Chamadas repetidas enquanto já online retornam 409. Para reativar, o motorista deve primeiro chamar `PUT /api/rotas/offline`.

## Timeout

Timeout padrão do ApiService frontend: 30 segundos.

## Efeitos colaterais

1. `UPDATE users SET statusOnline = TRUE, lastHeartbeat = NOW() WHERE id = :userId`
2. INSERT em `notificacoes` com `gatilhoTipo = 'rota_inicio'`
3. INSERT em `notificacao_destinatarios` para cada responsável elegível
