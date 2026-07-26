# Actions: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`
> Roadmap: `_reversa_forward/002-separacao-repositorios/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 4 (T001 → T002 → T003 → T008) |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Copiar a pasta `backend/` inteira de `d:\Projetos\cheguei_mae\backend` para `d:\Projetos\cheguei_mae_backend` | - | - | `d:\Projetos\cheguei_mae_backend\` | 🟢 | `[ ]` |
| T002 | Mover `docker-compose.yml` da raiz do frontend para `d:\Projetos\cheguei_mae_backend\docker-compose.yml` | T001 | - | `d:\Projetos\cheguei_mae_backend\docker-compose.yml` | 🟢 | `[ ]` |
| T003 | Criar `.gitignore` adequado na raiz do novo repositório backend com regras: `node_modules/`, `dist/`, `.env`, `*.tsbuildinfo`, `uploads/` | T001 | - | `d:\Projetos\cheguei_mae_backend\.gitignore` | 🟡 | `[ ]` |

## Fase 2, Testes

> Equipe não utiliza suite de testes mapeada (`_reversa_sdd/inventory.md#Cobertura-de-Testes`). Pulado.

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Remover a pasta `backend/` do repositório frontend em `d:\Projetos\cheguei_mae` | T002 | - | `d:\Projetos\cheguei_mae\backend\` | 🟢 | `[ ]` |
| T005 | Remover a linha `backend/.env` do `.gitignore` do frontend | T004 | - | `.gitignore` | 🟢 | `[ ]` |

## Fase 4, Integração

> Nenhuma integração de código necessária. O frontend já se conecta ao backend via HTTP/rede, sem importações cruzadas.

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Atualizar `INICIAR_BACKEND.md` — substituir referências a `cd backend` por instruções de abrir terminal em `d:\Projetos\cheguei_mae_backend` e incluir `docker-compose up -d` | T004 | `[//]` | `INICIAR_BACKEND.md` | 🟢 | `[ ]` |
| T007 | Atualizar `INSTALAR_LOCAL.md` — reorganizar seções para refletir dois repositórios independentes (frontend e backend) com instruções de instalação separadas | T004 | `[//]` | `INSTALAR_LOCAL.md` | 🟢 | `[ ]` |
| T008 | Atualizar `README.md` — atualizar seções de estrutura, setup e execução para refletir a separação em dois repositórios | T004 | `[//]` | `README.md` | 🟢 | `[ ]` |
| T009 | Inicializar repositório Git no backend: `git init`, `git add .`, `git commit -m "Extração do backend como repositório independente"` | T003 | - | `d:\Projetos\cheguei_mae_backend\.git\` | 🟢 | `[ ]` |

## Notas de execução

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-to-do` | reversa |
