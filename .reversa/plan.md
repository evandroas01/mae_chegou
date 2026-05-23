# Plano de Exploração — cheguei_mae

> Criado pelo Reversa em 2026-05-18
> Marque cada tarefa com ✅ quando concluída.
> Você pode editar este plano antes de iniciar: adicione, remova ou reordene tarefas conforme necessário.

---

## Fase 1: Reconhecimento 🔍

- [x] ✅ **Scout** — Mapeamento de estrutura de pastas e tecnologias
- [x] ✅ **Scout** — Análise de dependências e gerenciadores de pacotes
- [x] ✅ **Scout** — Identificação de entry points, CI/CD e configurações

## Decisão de organização das specs 🗂️

> Entre o Scout e o Arqueólogo, o Reversa pergunta como você quer organizar as specs (por módulo, caso de uso, endpoint, híbrida, por features ou customizada). A escolha fica persistida em `.reversa/config.toml` na seção `[specs]` e não será reperguntada em execuções futuras. Para reapresentar o menu, remova manualmente a seção.

## Fase 2: Escavação 🏗️

> O Reversa preenche esta seção com os módulos reais após o Scout concluir o reconhecimento.

- [x] ✅ **Arqueólogo** — Análise do módulo `auth`
- [x] ✅ **Arqueólogo** — Análise do módulo `alunos`
- [x] ✅ **Arqueólogo** — Análise do módulo `financeiro`
- [x] ✅ **Arqueólogo** — Análise do módulo `contratos`
- [x] ✅ **Arqueólogo** — Análise do módulo `manutencao`
- [x] ✅ **Arqueólogo** — Análise do módulo `rotas`
- [x] ✅ **Arqueólogo** — Análise do módulo `notificacoes`
- [x] ✅ **Arqueólogo** — Análise do módulo `chat`
- [x] ✅ **Arqueólogo** — Análise do módulo `perfil`
- [x] ✅ **Arqueólogo** — Análise do módulo `upload`
- [x] ✅ **Arqueólogo** — Análise do módulo `relatorios`
- [x] ✅ **Arqueólogo** — Análise do módulo `dashboard`

## Fase 3: Interpretação 🧠

- [x] ✅ **Detetive** — Arqueologia Git e ADRs retroativos
- [x] ✅ **Detetive** — Regras de negócio implícitas e máquinas de estado
- [x] ✅ **Detetive** — Matriz de permissões (RBAC/ACL)
- [x] ✅ **Arquiteto** — Diagramas C4 (Contexto + visão geral)
- [x] ✅ **Arquiteto** — ERD resumido e integrações externas
- [x] ✅ **Arquiteto** — Dívidas técnicas

## Fase 4: Geração 📝

- [x] ✅ **Redator** — Specs SDD por módulo (12 units × 3 arquivos = 36 specs)
- [x] ⏭️ **Redator** — OpenAPI (pulado — nível essencial)
- [x] ⏭️ **Redator** — User Stories (pulado — nível essencial)
- [x] ⏭️ **Redator** — Code/Spec Matrix (pulado — nível essencial)

## Fase 5: Revisão ✅

- [x] ✅ **Revisor** — Revisão cruzada de specs (consistência verificada)
- [x] ✅ **Revisor** — 4 perguntas de validação geradas (questions.md)
- [x] ✅ **Revisor** — Relatório de confiança: **64%** (confidence-report.md)

---

## Agentes Independentes

> Execute estes agentes quando os recursos estiverem disponíveis — podem rodar em qualquer fase.

- [ ] **Visor** — Análise de interface via screenshots
- [ ] **Data Master** — Análise completa do banco de dados
- [ ] **Design System** — Extração de tokens de design
- [ ] **Tracer** — Análise dinâmica (requer sistema acessível)

---

## Próximo passo

Após o Time de Descoberta concluir e o `_reversa_sdd/` estar populado, você pode disparar um dos fluxos seguintes:

- `/reversa-migrate`: orquestrador do **Time de Migração** (Paradigm Advisor → Curator → Strategist → Designer → Screen Translator → Inspector). Gera as specs do sistema novo. Saída em `_reversa_sdd/migration/` e `_reversa_sdd/screens/`.
- `/reversa-reconstructor`: gera plano bottom-up para reimplementar o software a partir das specs do legado (uma tarefa por sessão).
