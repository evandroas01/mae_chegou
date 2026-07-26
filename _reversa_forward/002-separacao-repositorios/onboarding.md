# Onboarding: Separação de Repositórios (Frontend vs Backend)

> Identificador: `002-separacao-repositorios`
> Data: `2026-05-26`

## Pré-requisitos

- [ ] Docker Desktop instalado e rodando
- [ ] Node.js instalado (v18+)
- [ ] npm instalado
- [ ] Acesso ao diretório `d:\Projetos\`

## Passo a passo para testar a feature

### 1. Verificar que a separação foi realizada

```powershell
# A pasta backend NÃO deve existir no frontend
Test-Path "d:\Projetos\cheguei_mae\backend"
# Esperado: False

# A pasta backend DEVE existir no novo local
Test-Path "d:\Projetos\cheguei_mae_backend"
# Esperado: True

# O docker-compose NÃO deve existir no frontend
Test-Path "d:\Projetos\cheguei_mae\docker-compose.yml"
# Esperado: False

# O docker-compose DEVE existir no backend
Test-Path "d:\Projetos\cheguei_mae_backend\docker-compose.yml"
# Esperado: True
```

### 2. Iniciar o backend

Abra um terminal na pasta do backend:

```powershell
cd d:\Projetos\cheguei_mae_backend

# Subir o MySQL
docker-compose up -d

# Aguardar o container ficar saudável
docker-compose ps
# Esperado: cheguei_mae_mysql com status "healthy"

# Instalar dependências (se necessário)
npm install

# Iniciar o servidor
npm run dev
# Esperado: "Servidor rodando na porta 3000"
```

### 3. Iniciar o frontend

Abra **outro terminal** na pasta do frontend:

```powershell
cd d:\Projetos\cheguei_mae

# Iniciar o Expo (com cache limpo)
npx expo start -c
# Esperado: Metro Bundler inicia sem erros
```

### 4. Validar comunicação

1. Abra o app no dispositivo/emulador
2. Acesse a tela de login
3. Tente fazer login com credenciais válidas
4. **Esperado:** Login funciona, token JWT é retornado, dashboard carrega

### 5. Verificar documentação

```powershell
# Abrir os docs e conferir se mencionam o caminho correto do backend
Get-Content "d:\Projetos\cheguei_mae\INICIAR_BACKEND.md" | Select-String "cheguei_mae_backend"
# Esperado: Pelo menos 1 ocorrência

Get-Content "d:\Projetos\cheguei_mae\INSTALAR_LOCAL.md" | Select-String "cheguei_mae_backend"
# Esperado: Pelo menos 1 ocorrência

Get-Content "d:\Projetos\cheguei_mae\README.md" | Select-String "cheguei_mae_backend"
# Esperado: Pelo menos 1 ocorrência
```

### 6. Verificar .gitignore limpo

```powershell
Get-Content "d:\Projetos\cheguei_mae\.gitignore" | Select-String "backend"
# Esperado: Nenhum resultado
```

## Rollback (se necessário)

Se algo der errado, a reversão é simples:

1. Mover `d:\Projetos\cheguei_mae_backend` de volta para `d:\Projetos\cheguei_mae\backend`
2. Mover `docker-compose.yml` de volta para a raiz do frontend
3. Restaurar a linha `backend/.env` no `.gitignore`
4. Reverter alterações nos documentos de setup via `git checkout -- INICIAR_BACKEND.md INSTALAR_LOCAL.md README.md`

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-26 | Versão inicial gerada por `/reversa-plan` | reversa |
