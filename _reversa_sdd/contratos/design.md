# Contratos — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| POST | `/api/contratos` | `ContratoCreate` | `Contrato` | 201, 400, 500 | admin, motorista |
| GET | `/api/contratos` | — | `Contrato[]` com alunos e logs | 200, 500 | todos autenticados |
| GET | `/api/contratos/:id` | `id` | `Contrato` detalhado | 200, 404, 500 | todos autenticados |
| PUT | `/api/contratos/:id` | `Partial<Contrato>` | `Contrato` | 200, 400, 500 | admin, motorista |
| DELETE | `/api/contratos/:id` | `id` | — | 204, 500 | admin |
| POST | `/api/contratos/:id/assinar` | — | `Contrato` | 200, 404, 500 | todos (⚠️) |
| POST | `/api/contratos/:id/cancelar` | `{motivo?}` | `Contrato` | 200, 404, 500 | admin, motorista |

## Fluxo Principal — Criação

1. Controller extrai campos do body 🟢
2. Conta contratos existentes do tenant: `SELECT COUNT(*) FROM contratos WHERE tenantId = ?` 🟢
3. Gera número: `CT-${ano}-${(count+1).toString().padStart(3, '0')}` 🟢
4. `ContratoModel.create(...)` insere contrato com status `pendente` 🟢
5. Para cada alunoId no array: INSERT em `contrato_alunos` 🟢
6. `ContratoModel.createLog(contratoId, 'criado', ...)` 🟢
7. Retorna contrato com alunos e logs 🟢

## Fluxo — Assinatura

1. Busca contrato por ID + tenantId 🟢
2. Atualiza: `statusAssinatura = 'assinado'`, `dataAssinatura = now` 🟢
3. Cria log com ação `assinado` 🟢
4. Retorna contrato atualizado 🟢

## Fluxo — Cancelamento

1. Busca contrato por ID + tenantId 🟢
2. Atualiza: `statusAssinatura = 'cancelado'` 🟢
3. Cria log com ação `cancelado` e observações (motivo) 🟢
4. Retorna contrato atualizado 🟢

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Numeração sequencial por tenant (COUNT-based) | `ContratoController.ts:25-29` | 🟢 |
| Sem guard de transição (assinado pode ser cancelado) | `ContratoController.ts:180-220` | 🟢 |
| Log append-only (nunca deleta logs) | `ContratoModel.ts:110-120` | 🟢 |
| Rota de assinatura sem authorize | `contratos.routes.ts:18` | 🟢 |

## Riscos e Lacunas
- 🟡 Numeração por COUNT pode gerar duplicatas se contratos forem deletados
- 🟡 Sem guard de transição: contrato assinado pode ser cancelado e cancelado pode ser re-assinado
- 🟡 Rota de assinatura sem restrição de role — qualquer autenticado pode assinar qualquer contrato
- 🔴 statusPagamento do contrato nunca é atualizado (sempre `em_dia`)
