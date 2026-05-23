# Interface: PUT /api/rotas/offline

> Feature: `001-rastreamento-van-tempo-real`
> Tipo: HTTP REST
> Método: PUT

---

## Descrição

Desativa o status online do motorista autenticado. Persiste `statusOnline = FALSE` na tabela `users`. Dispara notificação in-app do tipo `rota_fim` para todos os responsáveis vinculados (alunos ativos).

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
  "message": "Motorista offline",
  "statusOnline": false,
  "notificacoesEnviadas": 3
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `statusOnline` | boolean | Sempre `false` nesta resposta |
| `notificacoesEnviadas` | number | Quantidade de responsáveis notificados |

### 409 Conflict

Motorista já está offline.

```json
{
  "error": "Motorista já está offline",
  "statusOnline": false
}
```

### 401 Unauthorized

Token inválido ou ausente.

### 403 Forbidden

Usuário autenticado não tem role `motorista`.

### 500 Internal Server Error

Erro interno.

## Idempotência

Não idempotente. Chamadas repetidas enquanto já offline retornam 409.

## Timeout

Timeout padrão do ApiService frontend: 30 segundos.

## Efeitos colaterais

1. `UPDATE users SET statusOnline = FALSE WHERE id = :userId`
2. INSERT em `notificacoes` com `gatilhoTipo = 'rota_fim'`
3. INSERT em `notificacao_destinatarios` para cada responsável elegível
