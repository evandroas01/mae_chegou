# 🚀 Como Iniciar o Backend

## Problema de Conexão

Se você está recebendo erro de conexão ao tentar fazer login, o backend provavelmente não está rodando.

## Solução Rápida

### 1. Abra um NOVO terminal (PowerShell ou CMD)

**IMPORTANTE:** Deixe o terminal do Expo rodando e abra um **segundo terminal** para o backend.

### 2. Navegue até a pasta do backend e inicie o servidor:

```powershell
cd D:\Projetos\cheguei_mae\backend
npm run dev
```

### 3. Você deve ver estas mensagens:

```
🚀 Server running on http://0.0.0.0:3000
📡 Environment: development
🌐 CORS enabled for: [...]
```

### 4. Deixe este terminal aberto

O backend precisa estar rodando **enquanto você usa o app**.

## Verificar se o Backend está Rodando

### No PowerShell:
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

Se retornar `TcpTestSucceeded : True`, o backend está rodando.

### Ou teste no navegador:
Abra: `http://localhost:3000/health`

Se retornar `{"status":"ok"}`, o backend está funcionando.

## Solução de Problemas

### Backend não inicia:

1. **Verifique se o MySQL está rodando:**
   ```powershell
   docker ps
   ```
   Se não estiver rodando:
   ```powershell
   docker-compose up -d
   ```

2. **Instale as dependências do backend:**
   ```powershell
   cd backend
   npm install
   ```

3. **Verifique se há erros no terminal do backend**

### Erro de CORS:

O backend já está configurado para aceitar conexões de qualquer IP `192.168.x.x:8081`. Se ainda houver erro de CORS:

1. Verifique o IP detectado no app (nos logs do Expo)
2. Adicione o IP no `.env` do backend (linha `CORS_ORIGIN`)

### Firewall do Windows:

Se o celular não conseguir conectar, pode ser o firewall:

1. Abra **Firewall do Windows**
2. **Configurações Avançadas** > **Regras de Entrada**
3. Crie uma nova regra para a porta **3000** (TCP)
4. Permita a conexão

## Resumo

✅ **Terminal 1:** Expo rodando (`npx expo start -c`)  
✅ **Terminal 2:** Backend rodando (`cd backend && npm run dev`)  
✅ **Docker:** MySQL rodando (`docker-compose up -d`)

Se todos estiverem rodando, o app deve conseguir conectar! 🎉

