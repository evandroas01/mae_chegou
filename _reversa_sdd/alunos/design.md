# Alunos — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface

| Método | Caminho | Entrada | Saída | Status codes | Authorize |
|--------|---------|---------|-------|--------------|-----------|
| POST | `/api/alunos` | Body complexo (ver abaixo) | `Aluno` enriquecido | 201, 400, 500 | motorista |
| GET | `/api/alunos` | — | `Aluno[]` enriquecidos | 200, 400, 500 | todos autenticados |
| GET | `/api/alunos/:id` | `id: string` | `Aluno` enriquecido | 200, 400, 404, 500 | todos autenticados |
| PUT | `/api/alunos/:id` | `Partial<Aluno>` | `Aluno` | 200, 400, 500 | motorista |
| DELETE | `/api/alunos/:id` | `id: string` | — | 204, 400, 500 | admin |

### Body do POST (criação)

```typescript
{
  nome: string,
  dataNascimento: string,     // ISO date
  serie: string,
  turma: string,
  periodo: 'M' | 'T' | 'N',
  status?: string,            // default: 'ativo'
  escola: { nome, endereco },
  responsavel: { id? } | { nome, email?, telefone, cpf },
  enderecoContratante: { rua, numero, complemento?, bairro, cidade, estado, cep },
  enderecoSaida?: { ... },    // opcional
  valorMensal: string,        // parseFloat no controller
  formaPagamento: string,
  diasSemana: string[],       // JSON.stringify no controller
  datasVencimento: string[],  // JSON.stringify no controller
  motoristaId?: string        // default: req.userId
}
```

## Fluxo Principal — Criação (Cascata)

1. Validar tenantId no request 🟢
2. **Escola:** buscar por `nome + tenantId`; se não encontrar, INSERT com cidade/estado hardcoded "São Paulo/SP" 🟢
3. **Endereço Contratante:** INSERT em `enderecos` com tenantId 🟢
4. **Endereço Saída:** se fornecido, INSERT em `enderecos` 🟢
5. **Responsável:** 🟢
   - Se `responsavel.id` → validar existência (motoristaId + tenantId + role responsavel)
   - Senão se CPF existe → reusar user existente
   - Senão → INSERT user com role `responsavel`, email `{cpf}@temp.com`, senha `temp_password` 🔴
6. **Aluno:** `AlunoModel.create(...)` com todas as FKs resolvidas 🟢
7. **Retorno:** `AlunoModel.findById()` com JOINs (escola, responsável) 🟢

## Fluxos Alternativos — Listagem por Role
- **Motorista:** `findByMotorista(userId, tenantId)` → filtra `status = 'ativo'` 🟢
- **Responsável:** `findByResponsavel(userId, tenantId)` → sem filtro de status 🟢
- **Admin:** `findAll(tenantId)` → todos 🟢

## Dependências
- `auth` — middlewares authenticate, authorize, requireTenant 🟢
- `pool` — conexão MySQL direta para queries de escola e endereço 🟢
- Tabelas: `alunos`, `escolas`, `enderecos`, `users` 🟢

## Decisões de Design Identificadas

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Criação cascata inline (escola + endereço + responsável no mesmo controller) | `AlunoController.ts:33-128` | 🟢 |
| SQL direto no controller (não no model) para escola e endereço | `AlunoController.ts:34-84` | 🟢 |
| Responsável criado com senha em texto puro | `AlunoController.ts:119` | 🟢 |
| Status pagamento hardcoded `em_dia` | `AlunoModel.ts:198-200` | 🟢 |
| JOINs no model para enriquecer resposta | `AlunoModel.ts:38-57` | 🟢 |

## Riscos e Lacunas
- 🔴 Senha `temp_password` não hasheada: vulnerabilidade de segurança
- 🔴 Escola criada com "São Paulo/SP" hardcoded: dados incorretos fora de SP
- 🔴 Status de pagamento sempre `em_dia`: inadimplência por aluno não funciona
- 🟡 SQL inline no controller mistura camadas (controller faz INSERT direto)
- 🟡 Sem transação — cascata pode falhar parcialmente (escola criada, aluno não)
