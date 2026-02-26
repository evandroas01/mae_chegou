# 📱 Guia Rápido - Executar App no Celular

## Pré-requisitos

1. ✅ Banco de dados MySQL rodando via Docker
2. ✅ Backend rodando e acessível na rede local
3. ✅ Celular e computador na mesma rede Wi-Fi
4. ✅ Expo Go instalado no celular

## Passos para Executar

### 1. Iniciar o Banco de Dados

```bash
docker-compose up -d
```

Verifique se está rodando:
```bash
docker ps
```

### 2. Iniciar o Backend

```bash
cd backend
npm run dev
```

O backend deve estar rodando em `http://0.0.0.0:3000` (acessível de qualquer IP da rede local).

**Importante:** Se você tiver firewall ativo, certifique-se de permitir conexões na porta 3000.

### 3. Verificar seu IP Local

**Windows:**
```bash
ipconfig
```
Procure por "IPv4 Address" na sua conexão Wi-Fi (geralmente algo como `192.168.x.x`).

**Mac/Linux:**
```bash
ifconfig
```
ou
```bash
ip addr show
```

### 4. Atualizar o IP no Código (se necessário)

Se seu IP local for diferente de `192.168.15.3`, edite o arquivo `constants/api.ts` e atualize a função `getLocalIP()`:

```typescript
return '192.168.15.3'; // Altere para seu IP
```

### 5. Limpar Cache e Iniciar o Expo

```bash
# Parar o Expo atual (Ctrl+C) e reiniciar com cache limpo
npx expo start -c
```

### 6. Conectar o Celular

1. Abra o app **Expo Go** no seu celular
2. Certifique-se de que o celular está na **mesma rede Wi-Fi** do computador
3. Escaneie o **QR Code** que aparece no terminal
   - **Android**: Use o app Expo Go para escanear
   - **iOS**: Use a câmera do iPhone para escanear

### 7. Verificar Conexão

Após o app carregar, tente fazer login. Se houver erro de conexão:

1. Verifique se o backend está rodando
2. Verifique se o IP está correto em `constants/api.ts`
3. Verifique se o firewall permite conexões na porta 3000
4. Teste acessando `http://<SEU_IP>:3000/health` no navegador do celular

## Troubleshooting

### Erro: "Não foi possível conectar ao servidor"

**Soluções:**
1. Verifique se o backend está rodando: `cd backend && npm run dev`
2. Verifique se o IP está correto em `constants/api.ts`
3. Teste no navegador do celular: `http://<SEU_IP>:3000/health`
4. Verifique o firewall do Windows/Mac

### Erro: "CORS policy"

O backend já está configurado para aceitar conexões da rede local. Se ainda houver erro:
1. Verifique se o backend está escutando em `0.0.0.0` (não apenas localhost)
2. Reinicie o backend após as mudanças

### App não carrega

1. Limpe o cache: `npx expo start -c`
2. Feche e reabra o Expo Go
3. Verifique se está na mesma rede Wi-Fi

## Comandos Úteis

```bash
# Ver IP local (Windows)
ipconfig

# Ver IP local (Mac/Linux)
ifconfig

# Testar se backend está acessível
curl http://<SEU_IP>:3000/health

# Parar Docker
docker-compose down

# Ver logs do backend
cd backend && npm run dev
```

