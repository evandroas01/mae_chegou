# Investigation: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`

## 1. Pesquisa de fundo

### 1.1 Acoplamento zero confirmado

A extração reversa confirmou com confiança 🟢 que o frontend e backend se comunicam **exclusivamente via HTTP**:

- **Frontend → Backend**: `constants/api.ts` usa `fetch` com URL base `http://<IP>:3000/api`
- **Nenhum import cruzado**: Não existe nenhuma instrução `import` ou `require` no frontend que aponte para `backend/` ou vice-versa
- **Dependências isoladas**: Cada projeto tem seu próprio `package.json`, `tsconfig.json` e `node_modules/`
- **Fonte**: `_reversa_sdd/inventory.md#Estrutura-de-Pastas`, `_reversa_sdd/architecture.md#Comunicação-entre-containers`

### 1.2 Docker volumes e portabilidade

O `docker-compose.yml` usa volume **nomeado** (`mysql_data`), não bind-mount relativo. Volumes nomeados são gerenciados pelo Docker Engine e não dependem do caminho do arquivo `docker-compose.yml`. Mover o compose para outro diretório não afeta o volume existente.

**Comando de verificação pós-mudança:**
```bash
docker volume ls | findstr mysql_data
```

### 1.3 Git history

O projeto tem apenas 2 commits (`_reversa_sdd/domain.md#Análise-Git`). Não há histórico granular que justifique `git subtree split` ou `git filter-branch`. Uma cópia simples seguida de `git init` no novo repositório é a abordagem mais limpa.

## 2. Alternativas avaliadas

| Alternativa | Prós | Contras | Veredito |
|-------------|------|---------|----------|
| **Cópia simples + git init** (escolhida) | Simplicidade máxima; resultado limpo; sem dependências de ferramentas | Perde os 2 commits do monorepo no backend | ✅ Escolhida — 2 commits não têm valor de rastreabilidade |
| **git subtree split** | Preserva histórico do subdiretório | Complexo; requer rebase manual; 2 commits não justificam | ❌ Over-engineering |
| **git filter-repo** | Preserva histórico com reescrita limpa | Requer instalação extra; mesmo problema de 2 commits | ❌ Over-engineering |
| **Git submodules** | Backend como submódulo do frontend | Complexidade operacional altíssima; anti-pattern para este caso | ❌ Inadequado |

## 3. Padrões aplicáveis

### Monorepo → Multi-repo

A transição monorepo → multi-repo é bem documentada na indústria. Para projetos com acoplamento zero entre os subprojetos (como é o caso confirmado aqui), a separação é uma operação de baixo risco.

**Checklist clássico de separação:**
- [x] Sem importações cruzadas de código
- [x] Dependências isoladas (`package.json` separados)
- [x] Configuração isolada (`tsconfig.json`, `.env` separados)
- [x] Comunicação via contrato bem definido (HTTP REST)
- [x] Deploy potencialmente independente

### Convenção de `.gitignore` para Node.js

O novo repositório backend precisa de um `.gitignore` explícito. Padrão recomendado para Node.js + TypeScript:

```gitignore
node_modules/
dist/
.env
*.tsbuildinfo
uploads/
```

## 4. Pontos de atenção

| Ponto | Detalhe | Ação |
|-------|---------|------|
| **Referências em documentação** | Buscar `cd backend`, `backend/` e `cheguei_mae\backend` em todos os `.md` do projeto | Grep global antes de fechar |
| **Scripts npm** | O frontend não tem scripts que referenciam o backend | Confirmar com `grep -r "backend" package.json` |
| **CI/CD** | Não existe configuração de CI/CD (`_reversa_sdd/inventory.md#CI/CD`) | Sem impacto |
| **`.env` do backend** | Já existe em `backend/.env`; após a mudança, estará na raiz do novo repo | Verificar que o `.gitignore` do novo repo cobre `.env` |

## 5. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-plan` | reversa |
