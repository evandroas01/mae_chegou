# 📱 Como Instalar o App Localmente (Sem Publicar nas Lojas)

Este guia mostra como gerar um arquivo `.apk` (Android) ou `.ipa` (iOS) para instalar diretamente no seu celular, **sem precisar publicar na Play Store ou App Store**.

---

## 🎯 Opção 1: Android (APK) - Mais Fácil ⭐

### Pré-requisitos

1. **Conta Expo** (grátis):
   - Acesse: https://expo.dev/signup
   - Crie uma conta gratuita

2. **EAS CLI** instalado:
   ```bash
   npm install -g eas-cli
   ```

### Passo a Passo

#### 1. Faça login na sua conta Expo

```bash
eas login
```

Você será redirecionado para o navegador para fazer login.

#### 2. Configure o projeto (primeira vez apenas)

```bash
eas build:configure
```

Isso criará um arquivo `eas.json` na raiz do projeto.

#### 3. Gere o APK

```bash
eas build --platform android --profile preview
```

**Opções de build:**
- `--profile preview` → Gera APK para testes (recomendado)
- `--profile development` → Gera APK com desenvolvimento client

#### 4. Aguarde o build

- O build leva entre **10-20 minutos**
- Você pode acompanhar o progresso no terminal ou em: https://expo.dev
- Quando terminar, você receberá um **link para download**

#### 5. Baixe e instale o APK

**No seu celular Android:**

1. **Baixe o APK** do link fornecido
2. **Habilite instalação de apps desconhecidos:**
   - Vá em **Configurações** → **Segurança**
   - Ative **"Fontes desconhecidas"** ou **"Instalar apps desconhecidos"**
   - (A localização pode variar dependendo da versão do Android)
3. **Abra o arquivo `.apk`** baixado
4. **Toque em "Instalar"**
5. **Pronto!** O app estará instalado no seu celular

---

## 🍎 Opção 2: iOS (IPA) - Requer Conta Apple Developer

> ⚠️ **Importante:** Para instalar em dispositivos iOS físicos, você precisa de uma **conta de desenvolvedor Apple** ($99/ano). Para testes, recomendo usar o **Expo Go** (ver abaixo).

### Se tiver conta Apple Developer:

```bash
# Build para iOS
eas build --platform ios --profile preview

# Aguarde o build e baixe o .ipa
# Depois instale via TestFlight ou distribuição ad-hoc
```

---

## 📦 Opção 3: Expo Go (Testes Rápidos - SEM Build) ⚡

A forma mais rápida para testar **sem gerar build**:

### Passos:

1. **Instale o Expo Go no seu celular:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **No seu computador, execute:**
   ```bash
   npm start
   ```

3. **Escaneie o QR code:**
   - **Android:** Abra o Expo Go → "Scan QR code"
   - **iOS:** Use a câmera do iPhone

4. **O app abrirá no Expo Go!**

> ⚠️ **Nota:** Com Expo Go, o app roda dentro do app Expo Go, não é uma instalação separada.

---

## 📋 Checklist Antes de Fazer Build

- [ ] Backend está funcionando e acessível
- [ ] `app.json` configurado corretamente
- [ ] Ícones e splash screen configurados
- [ ] Permissões de localização configuradas (já está configurado ✅)
- [ ] Conta Expo criada
- [ ] EAS CLI instalado

---

## 🔧 Configuração do EAS Build

O arquivo `eas.json` será criado automaticamente quando você executar `eas build:configure`. Mas você pode criá-lo manualmente:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 🚀 Comandos Rápidos

```bash
# 1. Instalar EAS CLI (se ainda não tiver)
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurar projeto (primeira vez)
eas build:configure

# 4. Build Android APK
eas build --platform android --profile preview

# 5. Ver status do build
eas build:list

# 6. Baixar build concluído
# O link aparecerá no terminal quando o build terminar
```

---

## 📥 Como Instalar o APK no Android

### Método 1: Direto no Celular

1. Baixe o APK do link fornecido pelo EAS
2. Abra o arquivo no celular
3. Permita instalação de fontes desconhecidas
4. Instale

### Método 2: Via USB (Computador)

1. Baixe o APK no computador
2. Conecte o celular via USB
3. Habilite "Depuração USB" nas opções de desenvolvedor
4. Copie o APK para o celular
5. Abra e instale no celular

### Método 3: Via WhatsApp/Email

1. Baixe o APK no computador
2. Envie para si mesmo via WhatsApp ou email
3. Abra no celular e instale

---

## ⚙️ Configurar URL do Backend para Produção

Se você quiser que o app funcione sem depender do seu computador:

### Opção A: Usar IP Público (se tiver)

1. Configure seu roteador para fazer port forwarding
2. Use seu IP público na URL do backend

### Opção B: Usar um Serviço de Túnel (ngrok, localtunnel, etc.)

```bash
# Exemplo com ngrok
ngrok http 3000

# Use a URL fornecida pelo ngrok no app
```

### Opção C: Deploy do Backend em Servidor

- Deploy em Heroku, Railway, Render, etc.
- Configure a URL no `constants/api.ts` ou variável de ambiente

---

## 🐛 Solução de Problemas

### Erro: "EAS CLI not found"
```bash
npm install -g eas-cli
```

### Erro: "Not logged in"
```bash
eas login
```

### Erro: "Build failed"
- Verifique os logs em: https://expo.dev
- Certifique-se que o `app.json` está correto
- Verifique se todas as dependências estão no `package.json`

### APK não instala no Android
- Certifique-se que **"Fontes desconhecidas"** está habilitado
- Android mais recentes: Vá em **Configurações** → **Apps** → **Acesso especial** → **Instalar apps desconhecidos**

### App não conecta ao backend
- Certifique-se que o backend está rodando e acessível
- Para builds, configure a URL correta do backend
- Se testando localmente, use o IP local da sua rede (ex: `http://192.168.15.7:3000`)

---

## 💡 Dicas Importantes

1. **Build Preview é GRATUITO** (dentro dos limites da conta Expo)
2. **APK não expira** - pode instalar quantas vezes quiser
3. **Pode distribuir** o APK para outros testadores (envie o arquivo)
4. **Não precisa publicar** na Play Store para testar
5. **Para iOS**, o Expo Go é mais prático se não tiver conta de desenvolvedor

---

## 🎯 Recomendação Final

### Para testes rápidos:
**Use o Expo Go** - Instale o app, execute `npm start`, escaneie o QR code.

### Para instalação permanente no celular:
**Gere um APK** - `eas build --platform android --profile preview`

---

## 📞 Precisa de Ajuda?

- Documentação EAS: https://docs.expo.dev/build/introduction/
- Dashboard Expo: https://expo.dev
- Suporte Expo: https://expo.dev/support

