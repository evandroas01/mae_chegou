# 🔍 Diagnóstico e Solução de Problemas

## Problemas Identificados e Soluções

### ✅ Problema 1: Backend não conecta ao banco de dados

**Causa:** Faltava o arquivo `.env` no backend com as credenciais corretas do banco de dados.

**Solução aplicada:**
- ✅ Criado arquivo `backend/.env` com as credenciais do Docker Compose:
  - DB_HOST=localhost
  - DB_PORT=3306
  - DB_USER=cheguei_user
  - DB_PASSWORD=cheguei_pass
  - DB_NAME=cheguei_mae

**Próximos passos:**
1. Verificar se o Docker está rodando:
   ```powershell
   docker ps
   ```

2. Se o MySQL não estiver rodando, inicie:
   ```powershell
   docker-compose up -d
   ```

3. Teste a conexão do backend:
   ```powershell
   cd backend
   npm run dev
   ```

   Você deve ver:
   ```
   ✅ Database connected successfully
   🚀 Server running on http://0.0.0.0:3000
   ```

4. Se ainda houver erro de conexão, execute as migrations:
   ```powershell
   cd backend
   npm run migrate
   ```

### ✅ Problema 2: App Expo não roda

**Causa possível:** A configuração `newArchEnabled: true` pode causar problemas com o Expo Go.

**Solução aplicada:**
- ✅ Desabilitado `newArchEnabled` no `app.json` (alterado para `false`)

**Próximos passos:**

1. **Limpar cache e reinstalar dependências:**
   ```powershell
   # Limpar cache do npm
   npm cache clean --force
   
   # Limpar cache do Expo
   npx expo start -c
   ```

2. **Verificar se todas as dependências estão instaladas:**
   ```powershell
   npm install
   ```

3. **Iniciar o Expo:**
   ```powershell
   npx expo start -c
   ```

4. **Se ainda não funcionar, tente:**
   ```powershell
   # Deletar node_modules e reinstalar
   Remove-Item -Recurse -Force node_modules
   npm install
   npx expo start -c
   ```

## Checklist Completo de Verificação

### Backend
- [ ] Arquivo `.env` existe em `backend/.env`
- [ ] Docker está rodando (`docker ps`)
- [ ] MySQL está acessível na porta 3306
- [ ] Backend inicia sem erros (`cd backend && npm run dev`)
- [ ] Migrations foram executadas (`cd backend && npm run migrate`)
- [ ] Backend responde em `http://localhost:3000/health`

### Frontend (Expo)
- [ ] Dependências instaladas (`npm install`)
- [ ] Cache limpo (`npx expo start -c`)
- [ ] `newArchEnabled` está como `false` no `app.json`
- [ ] Expo Go instalado no celular
- [ ] Celular e computador na mesma rede Wi-Fi
- [ ] IP local correto em `constants/api.ts`

### Firewall e Rede
- [ ] Firewall do Windows permite porta 3000
- [ ] Backend escuta em `0.0.0.0` (não apenas localhost)
- [ ] Teste `http://<SEU_IP>:3000/health` no navegador do celular funciona

## Comandos Úteis para Diagnóstico

### Verificar IP local (Windows)
```powershell
ipconfig
```
Procure por "IPv4 Address" na sua conexão Wi-Fi.

### Verificar se backend está rodando
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

### Verificar se Docker está rodando
```powershell
docker ps
```

### Ver logs do backend
```powershell
cd backend
npm run dev
```

### Ver logs do Expo
```powershell
npx expo start -c
```

## Solução de Problemas Específicos

### Erro: "Cannot connect to database"
1. Verifique se o Docker está rodando: `docker ps`
2. Verifique se o arquivo `.env` existe e tem as credenciais corretas
3. Teste a conexão manualmente:
   ```powershell
   docker exec -it cheguei_mae_mysql mysql -u cheguei_user -pcheguei_pass cheguei_mae
   ```

### Erro: "Expo Go não carrega o app"
1. Limpe o cache: `npx expo start -c`
2. Feche e reabra o Expo Go
3. Verifique se está na mesma rede Wi-Fi
4. Tente escanear o QR code novamente

### Erro: "Network request failed"
1. Verifique se o backend está rodando
2. Verifique o IP em `constants/api.ts`
3. Teste `http://<SEU_IP>:3000/health` no navegador do celular
4. Verifique o firewall do Windows

### Erro: "CORS policy"
1. Verifique se o backend está escutando em `0.0.0.0`
2. Verifique o arquivo `.env` do backend tem o IP correto em `CORS_ORIGIN`
3. Reinicie o backend após mudanças

## Ordem Recomendada de Inicialização

1. **Iniciar Docker (MySQL):**
   ```powershell
   docker-compose up -d
   ```

2. **Aguardar MySQL estar pronto (30-60 segundos)**

3. **Iniciar Backend:**
   ```powershell
   cd backend
   npm run dev
   ```
   Aguarde ver: `✅ Database connected successfully`

4. **Executar Migrations (se necessário):**
   ```powershell
   cd backend
   npm run migrate
   ```

5. **Iniciar Expo:**
   ```powershell
   npx expo start -c
   ```

6. **Conectar celular via Expo Go**

## Contato e Suporte

Se os problemas persistirem após seguir este guia:
1. Verifique os logs do backend para erros específicos
2. Verifique os logs do Expo para erros de conexão
3. Verifique se há mensagens de erro no console do navegador (se testando no web)

