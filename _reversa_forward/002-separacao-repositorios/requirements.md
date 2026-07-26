# Requirements: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O projeto **Mãe, Chegou!** opera hoje como monorepo com a pasta `backend/` dentro do mesmo repositório do app Expo. A extração reversa confirmou que o backend é 100% autônomo — possui `package.json`, `tsconfig.json` e `.env` próprios, sem importações cruzadas com o frontend. A comunicação acontece exclusivamente via HTTP (porta `3000`) com URL base definida em `constants/api.ts`.

Esta feature extrai a pasta `backend/` para um repositório externo independente (`d:\Projetos\cheguei_mae_backend`), move a infraestrutura Docker (MySQL) para esse novo repositório, e limpa referências órfãs no repositório do frontend, tornando-o um app Expo puro.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#Visão-Geral` | Arquitetura client-server: Mobile App ──HTTP/JSON──▶ API REST ──mysql2──▶ MySQL 8.0. Sem acoplamento em código. | 🟢 |
| `_reversa_sdd/architecture.md#Containers` | Backend roda em Express 4 + TypeScript na porta `3000`; MySQL containerizado em Docker na porta `3306`. | 🟢 |
| `_reversa_sdd/inventory.md#Estrutura-de-Pastas` | `backend/` contém toda a API (controllers, models, routes, middleware, validators, database, services, types, utils), com `package.json` e `tsconfig.json` próprios. | 🟢 |
| `_reversa_sdd/inventory.md#Docker` | `docker-compose.yml` na raiz do frontend levanta MySQL 8.0 — dependência direta do backend, não do frontend. | 🟢 |
| `_reversa_sdd/inventory.md#Configurações` | `backend/.env` controla DB, JWT e CORS de forma independente. | 🟢 |
| `_reversa_sdd/code-analysis.md#auth` | `constants/api.ts` resolve URL base via rede (IP local em dev, domínio em produção). Não importa código do backend. | 🟢 |
| `PLANO_SEPARACAO_REPOSITORIOS.md` | Documento-fonte com diagnóstico de acoplamento zero e plano passo a passo de extração. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Evandro (Desenvolvedor / Mantenedor)** | Isolar o ciclo de vida do backend para deploy, versionamento e CI/CD independentes | Após a separação, consegue abrir terminais separados, commitar backend e frontend de forma independente, e futuramente hospedar cada um em plataformas distintas |
| **Futuro colaborador** | Entender a estrutura do projeto sem ambiguidade | Clona um repositório para frontend OU backend, sem carregar código que não precisa |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** O frontend continua consumindo a API na porta `3000` via `constants/api.ts` — nenhuma alteração de contrato HTTP. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#RN-42` (rastreamento via HTTP)
   - Tipo: inalterada (preservação explícita)

2. **RN-02:** O `docker-compose.yml` passa a residir na raiz do repositório backend, junto ao código que depende do MySQL. 🟢
   - Origem no legado: `_reversa_sdd/inventory.md#Docker`
   - Tipo: alterada (movimentação de arquivo de infraestrutura)

3. **RN-03:** Nenhuma dependência de `package.json` do frontend referencia o backend, e vice-versa. Validar pós-separação. 🟢
   - Origem no legado: `_reversa_sdd/inventory.md#Estrutura-de-Pastas`
   - Tipo: inalterada (confirmação de autonomia)

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Mover a pasta `backend/` inteira para `d:\Projetos\cheguei_mae_backend` como projeto independente | Must | A pasta `backend/` não existe mais em `d:\Projetos\cheguei_mae`; `d:\Projetos\cheguei_mae_backend` contém todos os arquivos originais intactos | 🟢 |
| RF-02 | Mover `docker-compose.yml` da raiz do frontend para a raiz do novo repositório backend | Must | `docker-compose.yml` não existe em `d:\Projetos\cheguei_mae`; existe em `d:\Projetos\cheguei_mae_backend\docker-compose.yml` com conteúdo idêntico | 🟢 |
| RF-03 | Remover a linha `backend/.env` do `.gitignore` do frontend | Must | O `.gitignore` do frontend não contém referências a `backend/` | 🟢 |
| RF-04 | Atualizar `INICIAR_BACKEND.md` para refletir a nova localização do backend | Must | Instruções referenciam `d:\Projetos\cheguei_mae_backend` em vez de `cd backend` | 🟢 |
| RF-05 | Atualizar `INSTALAR_LOCAL.md` para refletir a nova estrutura de dois repositórios | Must | Instruções de instalação distinguem frontend e backend como projetos separados | 🟢 |
| RF-06 | Atualizar `README.md` para refletir a nova estrutura de dois repositórios | Must | Seções de setup e execução mencionam os dois repositórios separados | 🟢 |
| RF-07 | Garantir que `constants/api.ts` do frontend continua apontando para `localhost:3000` / IP local sem alteração | Must | O arquivo `constants/api.ts` permanece inalterado; o app conecta na API após separação | 🟢 |
| RF-08 | Backend funciona de forma autônoma no novo local — `npm run dev` inicia o servidor sem erros | Must | `npm run dev` na pasta `d:\Projetos\cheguei_mae_backend` levanta o servidor Express na porta `3000` | 🟢 |
| RF-09 | Frontend funciona de forma autônoma — `npx expo start` inicia sem erros e sem referências quebradas ao `backend/` | Must | `npx expo start -c` na raiz do frontend roda normalmente; nenhum import aponta para `backend/` | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Compatibilidade | A porta `3000` da API deve ser mantida para que o frontend não precise de alteração | `constants/api.ts` hardcoda porta `3000` | 🟢 |
| Integridade | Nenhum arquivo de código-fonte do backend deve ser modificado durante a movimentação — apenas movido | Plano de separação confirma zero acoplamento | 🟢 |
| Reversibilidade | A operação deve ser reversível — mover `cheguei_mae_backend` de volta para `cheguei_mae/backend/` restaura o monorepo | Sem alterações de código, apenas movimentação de pastas e edição de docs | 🟢 |
| Documentação | Toda documentação de setup deve ser atualizada para refletir a separação antes de considerar a feature concluída | `INICIAR_BACKEND.md`, `INSTALAR_LOCAL.md`, `README.md` | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Backend isolado inicia corretamente
  Dado que a pasta "d:\Projetos\cheguei_mae_backend" contém o backend extraído
  E que o docker-compose.yml está na raiz da pasta backend
  Quando o desenvolvedor executa "docker-compose up -d" seguido de "npm run dev" na pasta backend
  Então o servidor Express inicia na porta 3000 sem erros

Cenário: Frontend Expo inicia sem referências ao backend
  Dado que a pasta "backend/" foi removida de "d:\Projetos\cheguei_mae"
  Quando o desenvolvedor executa "npx expo start -c" na raiz do frontend
  Então o Metro Bundler inicia sem erros de import ou referência quebrada

Cenário: Comunicação frontend-backend preservada
  Dado que o backend está rodando em "localhost:3000"
  E que o frontend está rodando via Expo
  Quando o usuário faz login no app
  Então a requisição HTTP chega ao backend e retorna token JWT válido

Cenário: .gitignore limpo de referências ao backend
  Dado que o .gitignore do frontend foi editado
  Quando o desenvolvedor abre o arquivo
  Então não existe a linha "backend/.env" nem qualquer outra referência à pasta backend/

Cenário: Documentação atualizada
  Dado que INICIAR_BACKEND.md, INSTALAR_LOCAL.md e README.md foram editados
  Quando o desenvolvedor lê os arquivos
  Então todas as instruções referenciam "d:\Projetos\cheguei_mae_backend" como localização do backend

Cenário: Reversão para monorepo
  Dado que o desenvolvedor deseja reverter a separação
  Quando ele move a pasta "cheguei_mae_backend" de volta para "cheguei_mae/backend/"
  E restaura o docker-compose.yml e o .gitignore originais
  Então o monorepo funciona como antes da separação
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Mover backend) | Must | Pré-requisito de toda a feature |
| RF-02 (Mover docker-compose) | Must | Infraestrutura do banco é dependência do backend |
| RF-03 (Limpar .gitignore) | Must | Referência órfã |
| RF-04 (INICIAR_BACKEND.md) | Must | Doc principal de setup do backend |
| RF-05 (INSTALAR_LOCAL.md) | Must | Doc principal de instalação |
| RF-06 (README.md) | Must | Doc principal do projeto |
| RF-07 (Preservar api.ts) | Must | Garantia de zero breaking change |
| RF-08 (Backend funcional) | Must | Validação de que a separação não quebrou o backend |
| RF-09 (Frontend funcional) | Must | Validação de que a separação não quebrou o frontend |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

> Nenhuma lacuna identificada. O plano de separação (`PLANO_SEPARACAO_REPOSITORIOS.md`) cobre todos os pontos necessários, e a extração reversa confirmou que o acoplamento é zero (`_reversa_sdd/architecture.md`, `_reversa_sdd/inventory.md`).

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-requirements` | reversa |
