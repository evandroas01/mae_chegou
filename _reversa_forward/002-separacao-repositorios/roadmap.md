# Roadmap: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`
> Requirements: `_reversa_forward/002-separacao-repositorios/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A separação é uma operação de reorganização de repositórios, não de refatoração de código. A extração reversa (`_reversa_sdd/architecture.md#Containers`, `_reversa_sdd/inventory.md#Estrutura-de-Pastas`) confirmou que o frontend se comunica com o backend exclusivamente via HTTP na porta `3000`, sem importações de código cruzadas. A estratégia é:

1. **Mover** a pasta `backend/` inteira para um diretório externo (`d:\Projetos\cheguei_mae_backend`)
2. **Mover** `docker-compose.yml` para o novo repositório backend (o MySQL é dependência exclusiva da API)
3. **Limpar** referências órfãs no `.gitignore` do frontend
4. **Atualizar** documentação de setup (`INICIAR_BACKEND.md`, `INSTALAR_LOCAL.md`, `README.md`)
5. **Validar** que ambos os projetos funcionam de forma independente

Nenhum arquivo de código-fonte é editado. Nenhuma dependência é adicionada ou removida.

## 2. Princípios aplicados

> Nenhum arquivo `.reversa/principles.md` encontrado. Nenhum princípio a verificar.

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Mover pasta `backend/` por cópia + exclusão (não `git subtree split`) | Projeto tem apenas 2 commits e branch única; histórico granular inexistente, não justifica complexidade de `git subtree` ou `git filter-branch` | `git subtree split`, `git filter-branch`, `git-filter-repo` | 🟢 |
| D-02 | Backend vai para `d:\Projetos\cheguei_mae_backend` (pasta irmã) | Convenção do documento original (`PLANO_SEPARACAO_REPOSITORIOS.md`); mantém proximidade no sistema de arquivos sem criar subpastas artificiais | Subpasta em outro drive, pasta dentro de `%USERPROFILE%` | 🟢 |
| D-03 | Docker Compose movido junto com o backend | MySQL é dependência exclusiva da API REST; manter no frontend poluiria um projeto Expo puro | Manter docker-compose na raiz do frontend, criar repositório separado para infra | 🟢 |
| D-04 | Não criar `.gitignore` novo para o backend (já tem `.env` no `.gitignore` via convenção dotenv) | O `backend/.env` já é coberto pelo padrão `.env` quando é a raiz do repositório; confirmar e ajustar se necessário | Criar `.gitignore` do zero | 🟡 |
| D-05 | Não alterar `constants/api.ts` — preservar lógica de detecção de IP | A URL base é resolvida em runtime via `expo-constants` e fallback para IP fixo; funciona independente de onde o backend está fisicamente | Externalizar URL em variável de ambiente do Expo | 🟢 |

## 4. Premissas

> Nenhuma premissa derivada de `[DÚVIDA]` — o requirements não contém marcadores pendentes.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| **Monorepo structure** | `_reversa_sdd/inventory.md#Estrutura-de-Pastas` | componente-extinto | A pasta `backend/` deixa de existir dentro do repositório do frontend |
| **Docker Compose** | `_reversa_sdd/inventory.md#Docker` | componente-movido | `docker-compose.yml` migra da raiz do frontend para raiz do backend |
| **Documentação de setup** | `_reversa_sdd/inventory.md#Configurações` | artefato-alterado | `INICIAR_BACKEND.md`, `INSTALAR_LOCAL.md`, `README.md` atualizados com nova localização |
| **`.gitignore`** | `.gitignore` (raiz) | artefato-alterado | Remoção da linha `backend/.env` |

> **Nenhum componente de código-fonte** (controllers, models, routes, services, contexts, telas) é alterado.

## 6. Delta no modelo de dados

- Resumo das mudanças: **Nenhuma**. O schema MySQL, as tabelas, os campos e as queries permanecem idênticos. O Docker Compose muda apenas de localização, não de conteúdo.
- Detalhe completo em: `_reversa_forward/002-separacao-repositorios/data-delta.md`

## 7. Delta de contratos externos

> Nenhum contrato HTTP, fila ou gRPC é alterado. O frontend continua consumindo `http://<IP>:3000/api` via `constants/api.ts`. O diretório `interfaces/` foi omitido por não haver contratos afetados.

## 8. Plano de migração

1. **Parar serviços** — Encerrar Metro Bundler (`npx expo start`) e servidor backend (`npm run dev`) se estiverem rodando
2. **Copiar `backend/`** — Copiar a pasta `d:\Projetos\cheguei_mae\backend` inteira para `d:\Projetos\cheguei_mae_backend`
3. **Mover `docker-compose.yml`** — Mover `d:\Projetos\cheguei_mae\docker-compose.yml` para `d:\Projetos\cheguei_mae_backend\docker-compose.yml`
4. **Criar `.gitignore` do backend** — Garantir que o novo repositório backend tenha um `.gitignore` adequado (pelo menos `node_modules/`, `.env`, `dist/`, `uploads/`)
5. **Remover `backend/` do frontend** — Deletar `d:\Projetos\cheguei_mae\backend`
6. **Limpar `.gitignore` do frontend** — Remover a linha `backend/.env`
7. **Atualizar documentação** — Editar `INICIAR_BACKEND.md`, `INSTALAR_LOCAL.md`, `README.md`
8. **Validar backend** — Na pasta `cheguei_mae_backend`: `docker-compose up -d`, `npm run dev`
9. **Validar frontend** — Na pasta `cheguei_mae`: `npx expo start -c`
10. **Inicializar Git do backend** — `git init`, `git add .`, `git commit -m "Extração do backend como repositório independente"`

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Volume Docker `mysql_data` perde referência ao mudar `docker-compose.yml` de local | médio | baixo | Volume é nomeado (`mysql_data`), não depende do caminho do compose. Verificar `docker volume ls` após a mudança |
| Backend sem `.gitignore` expõe `.env` no novo repositório | alto | médio | Criar `.gitignore` explícito no passo 4 do plano de migração |
| Algum script ou doc referencia `cd backend` e não é atualizado | baixo | baixo | Buscar globalmente por `cd backend` e `backend/` em todos os `.md` do projeto |

## 10. Critério de pronto

- [ ] Pasta `backend/` não existe mais em `d:\Projetos\cheguei_mae`
- [ ] Pasta `d:\Projetos\cheguei_mae_backend` contém todos os arquivos do backend intactos
- [ ] `docker-compose.yml` está na raiz do backend, ausente do frontend
- [ ] `.gitignore` do frontend não contém `backend/.env`
- [ ] Backend inicia sem erros (`npm run dev` na porta 3000)
- [ ] Frontend inicia sem erros (`npx expo start -c`)
- [ ] Documentação (`INICIAR_BACKEND.md`, `INSTALAR_LOCAL.md`, `README.md`) atualizada
- [ ] `regression-watch.md` gerado
- [ ] Todas as ações do `actions.md` marcadas `[X]`

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-plan` | reversa |
