# Data Delta: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`

## Resumo

**Nenhuma alteração no modelo de dados.**

Esta feature é uma operação de reorganização de repositórios. O schema MySQL, as tabelas, os campos, os índices, as constraints e as queries permanecem 100% idênticos.

## Detalhes

| Aspecto | Mudança | Confidência |
|---------|---------|-------------|
| Tabelas MySQL | Nenhuma criada, alterada ou removida | 🟢 |
| Campos | Nenhum adicionado, removido ou renomeado | 🟢 |
| Índices | Nenhum alterado | 🟢 |
| Migrações | Nenhuma necessária | 🟢 |
| Seeds | Sem alteração | 🟢 |
| Docker volume `mysql_data` | Permanece intacto após mover `docker-compose.yml` (volume nomeado, não bind-mount) | 🟢 |
| Conexão com o banco | `backend/.env` (agora raiz do novo repo) mantém `DB_HOST=localhost`, `DB_PORT=3306` | 🟢 |

## Impacto em migrações existentes

O arquivo `backend/src/database/migrate.ts` é **movido**, não editado. A DDL das 13 tabelas (`_reversa_sdd/inventory.md#Schema-de-Banco-de-Dados`) permanece inalterada.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-plan` | reversa |
