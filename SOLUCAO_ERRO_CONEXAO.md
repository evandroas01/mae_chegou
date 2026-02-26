# 🔧 Solução para Erro de Conexão

## Problema Identificado

O erro `"Não foi possível conectar ao servidor"` ocorre porque:

1. ❌ **Backend não está rodando** na porta 3000
2. ⚠️ **Cache do Metro** pode estar causando problemas com a detecção de IP

## Solução Passo a Passo

### 1. Verificar se o Backend está Rodando

Abra um **novo terminal** e execute:

```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Server running on http://0.0.0.0:3000
📡 Environment: development
🌐 CORS enabled for: [...]
```

**Importante:** O backend precisa estar rodando **antes** de abrir o app no celular.

### 2. Verificar se o Banco de Dados está Rodando

```bash
docker ps
```

Se o MySQL não estiver rodando:
```bash
docker-compose up -d
```

### 3. Verificar Firewall do Windows

O Windows pode estar bloqueando conexões na porta 3000. Para permitir:

1. Abra o **Firewall do Windows**
2. Clique em **Configurações Avançadas**
3. Clique em **Regras de Entrada**
4. Crie uma nova regra para a porta **3000** (TCP)
5. Permita a conexão

Ou execute no PowerShell (como Administrador):
```powershell
New-NetFirewallRule -DisplayName "Backend API" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 4. Limpar Cache e Reiniciar o Expo

No terminal onde o Expo está rodando:

1. Pare o Expo (Ctrl+C)
2. Limpe o cache:
```bash
npx expo start -c
```

### 5. Verificar o IP Local

Se seu IP for diferente de `192.168.15.3`, edite `constants/api.ts`:

```typescript
// Linha 18 - altere para seu IP
return '192.168.15.3'; // Altere aqui
```

Para descobrir seu IP:
- **Windows:** `ipconfig` (procure por "IPv4 Address" na sua conexão Wi-Fi)
- **Mac/Linux:** `ifconfig` ou `ip addr show`

### 6. Testar a Conexão

No navegador do celular (mesma rede Wi-Fi), acesse:
```
http://192.168.15.3:3000/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

Se não funcionar, verifique:
- ✅ Backend está rodando
- ✅ Firewall permite porta 3000
- ✅ IP está correto
- ✅ Celular e computador na mesma rede Wi-Fi

## Logs de Debug

Agora o app mostra logs no console:
- `[API] API_BASE_URL configurado como: ...`
- `[ApiService] Inicializado com baseURL: ...`
- `[ApiService] Fazendo requisição para: ...`

Verifique esses logs no terminal do Expo para ver qual URL está sendo usada.

## Checklist Rápido

- [ ] Backend rodando (`cd backend && npm run dev`)
- [ ] Banco de dados rodando (`docker ps`)
- [ ] Firewall permite porta 3000
- [ ] IP correto em `constants/api.ts`
- [ ] Cache limpo (`npx expo start -c`)
- [ ] Celular e computador na mesma rede Wi-Fi
- [ ] Teste `http://<SEU_IP>:3000/health` no navegador do celular

## Se Ainda Não Funcionar

1. Verifique os logs do backend para ver se há erros
2. Verifique os logs do Expo para ver qual URL está sendo usada
3. Tente acessar `http://localhost:3000/health` no navegador do computador
4. Verifique se há algum antivírus bloqueando conexões

