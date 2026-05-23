# Data Delta: Rastreamento da Van em Tempo Real

> Identificador: `001-rastreamento-van-tempo-real`
> Data: `2026-05-23`
> Modelo base: `_reversa_sdd/architecture.md#ERD Resumido`

---

## 1. Tabelas alteradas

### `users`

> Fonte: `_reversa_sdd/code-analysis.md#auth` — Entidade `User`

| Operação | Campo | Tipo | Default | Nullable | Justificativa |
|----------|-------|------|---------|----------|---------------|
| ADD | `statusOnline` | `BOOLEAN` | `FALSE` | NOT NULL | Persistir se o motorista está em operação. Aplicável apenas a users com `role = 'motorista'`, mas o campo fica na tabela `users` para evitar JOIN extra. |
| ADD | `lastHeartbeat` | `DATETIME` | `NULL` | NULL | Timestamp do último envio de GPS ou toggle online. Usado para cálculo de timeout (5 minutos). NULL = nunca ficou online. |

**Migration SQL:**

```sql
ALTER TABLE users
  ADD COLUMN statusOnline BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN lastHeartbeat DATETIME NULL DEFAULT NULL;
```

**Índice recomendado:**

```sql
-- Otimiza a query "buscar motorista online do responsável"
-- Usado pelo endpoint GET /api/rotas/motorista/status
CREATE INDEX idx_users_motorista_online
  ON users (statusOnline, role)
  WHERE statusOnline = TRUE AND role = 'motorista';
```

> 🟡 O índice parcial (`WHERE`) é suportado por MySQL 8.0 via functional index ou pode ser substituído por índice simples `(role, statusOnline)` se a versão não suportar.

---

## 2. Tabelas não alteradas (reutilizadas como estão)

| Tabela | Uso nesta feature | Campos relevantes |
|--------|-------------------|-------------------|
| `localizacao_veiculos` | Armazena coordenadas GPS enviadas pelo motorista (append-only, RN-43) | `veiculoId`, `latitude`, `longitude`, `timestamp`, `velocidade`, `direcao` |
| `notificacoes` | Armazena notificações de `rota_inicio` e `rota_fim` | `tipo`, `titulo`, `mensagem`, `gatilhoTipo`, `status`, `remetenteId` |
| `notificacao_destinatarios` | Registra cada responsável como destinatário da notificação | `notificacaoId`, `destinatarioId`, `lida`, `dataLeitura` |
| `alunos` | Cadeia de resolução: motorista → alunos(ativos) → responsáveis | `motoristaId`, `responsavelId`, `status` |
| `veiculos` | Resolução do veículo do motorista para salvar localização | `motoristaId`, `id` |

---

## 3. Tabelas novas

Nenhuma.

---

## 4. Tabelas removidas

Nenhuma.

---

## 5. Queries críticas (pseudocódigo)

### Q1: Buscar responsáveis vinculados ao motorista (para notificação)

```sql
SELECT DISTINCT u.id, u.nome, u.email
FROM alunos a
JOIN users u ON u.id = a.responsavelId
WHERE a.motoristaId = :motoristaId
  AND a.status = 'ativo'
  AND a.tenantId = :tenantId
  AND u.role = 'responsavel';
```

> 🟢 Reutiliza cadeia RN-42 já documentada em `_reversa_sdd/domain.md`.

### Q2: Verificar timeout de heartbeat (motorista fantasma)

```sql
SELECT id, statusOnline, lastHeartbeat
FROM users
WHERE id = :motoristaId
  AND statusOnline = TRUE
  AND (lastHeartbeat IS NULL OR lastHeartbeat < NOW() - INTERVAL 5 MINUTE);
```

> Se retornar registro, o motorista está "fantasma" e deve ser marcado offline automaticamente.

### Q3: Atualizar heartbeat (a cada envio de GPS)

```sql
UPDATE users
SET lastHeartbeat = NOW()
WHERE id = :motoristaId AND tenantId = :tenantId;
```

> 🟢 Executada junto com o INSERT em `localizacao_veiculos` dentro da mesma transação.

---

## 6. Impacto em migrações existentes

O arquivo `backend/src/database/migrate.ts` já contém DDL de 13+ tabelas. A migration desta feature deve:

1. Ser adicionada como ALTER TABLE (não recriar a tabela)
2. Ser idempotente (verificar se coluna já existe antes de adicionar)
3. Não alterar dados existentes (defaults seguros: `FALSE` e `NULL`)

---

## 7. Histórico

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-23 | Versão inicial gerada por `/reversa-plan` | reversa |
