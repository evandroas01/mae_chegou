# Alunos

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de gestão de alunos de transporte escolar. Suporta CRUD completo com criação cascata de entidades relacionadas (escola, endereço, responsável). Filtra visibilidade por role do usuário.

## Responsabilidades
- Cadastrar alunos com criação automática de escola, endereço e responsável 🟢
- Listar alunos filtrados por role (motorista: ativos, responsável: seus filhos, admin: todos) 🟢
- Detalhar aluno com dados enriquecidos (escola, responsável) via JOINs 🟢
- Atualizar dados parciais do aluno 🟢
- Deletar aluno (hard delete, apenas admin) 🟢

## Regras de Negócio
- RN-10: Se a escola não existe (por nome + tenantId), é criada automaticamente 🟢
- RN-11: Se o responsável não existe (por CPF), é criado com email temporário e senha `temp_password` NÃO hasheada 🟢 🔴
- RN-12: Responsável existente validado: pertence ao motorista + tenant + role responsavel 🟢
- RN-13: Motorista vê apenas alunos ativos; responsável e admin veem todos 🟢
- RN-14: Aluno pode ter 2 endereços: contratante (obrigatório) e saída/embarque (opcional) 🟢
- RN-15: `diasSemana` e `datasVencimento` armazenados como JSON string 🟢
- RN-16: Status de pagamento do aluno é sempre `em_dia` (hardcoded) 🔴

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar aluno com escola, endereço e responsável em cascata | Must | Aluno criado com FK válidas |
| RF-02 | Listar alunos filtrados por role do usuário | Must | Motorista vê ativos, responsável vê filhos |
| RF-03 | Detalhar aluno com JOINs (escola, responsável) | Must | Dados enriquecidos retornados |
| RF-04 | Atualizar aluno parcialmente | Should | Apenas campos enviados atualizados |
| RF-05 | Deletar aluno (apenas admin) | Should | Hard delete com filtro tenant |
| RF-06 | Criar escola automaticamente se não existir | Must | Escola buscada por nome+tenant |
| RF-07 | Criar/buscar responsável por CPF | Must | User responsavel criado ou reusado |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Segurança | Apenas motorista pode criar alunos | `alunos.routes.ts:13` | 🟢 |
| Segurança | Apenas admin pode deletar alunos | `alunos.routes.ts:17` | 🟢 |
| Segurança | Todos os dados filtrados por tenantId | `AlunoModel.ts` (todas as queries) | 🟢 |

## Critérios de Aceitação

```gherkin
Cenário: Cadastro de aluno com responsável novo
  Dado um motorista autenticado
  Quando enviar POST /api/alunos com dados completos e CPF de responsável inexistente
  Então deve criar escola (se nova), endereço, responsável e aluno com status 201

Cenário: Cadastro com responsável existente
  Dado um responsável já cadastrado com CPF "123.456.789-00"
  Quando enviar POST /api/alunos com o mesmo CPF
  Então deve vincular ao responsável existente sem criar duplicata

Cenário: Listagem como motorista
  Dado um motorista com 5 alunos (3 ativos, 2 inativos)
  Quando enviar GET /api/alunos
  Então deve retornar apenas os 3 alunos ativos

Cenário: Listagem como responsável
  Dado um responsável com 2 filhos cadastrados
  Quando enviar GET /api/alunos
  Então deve retornar apenas seus 2 filhos
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| CRUD de alunos | Must | Entidade central do sistema |
| Criação cascata | Must | Fluxo de cadastro principal |
| Filtro por role | Must | Segurança e UX |
| Enriquecimento via JOIN | Should | Melhora UX mas não bloqueia |
| Delete (admin) | Could | Raramente usado |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/AlunoController.ts` | `AlunoController` | 🟢 |
| `backend/src/models/AlunoModel.ts` | `AlunoModel` | 🟢 |
| `backend/src/routes/alunos.routes.ts` | Rotas | 🟢 |
| `backend/src/validators/aluno.validator.ts` | Validações | 🟢 |
| `app/alunos.tsx` | Tela listagem | 🟢 |
| `app/cadastro-aluno.tsx` | Tela cadastro | 🟢 |
| `app/aluno-detalhe/[id].tsx` | Tela detalhe | 🟢 |
| `services/alunoService.ts` | Service frontend | 🟢 |
| `types/aluno.ts` | Tipos TypeScript | 🟢 |
