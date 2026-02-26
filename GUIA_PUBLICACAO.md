# Guia de Publicação do App para Testes

Este guia explica como publicar o app "Mãe, Chegou!" para testes em dispositivos móveis.

## Opções de Publicação

### 1. Expo Go (Testes Rápidos) ⚡

A forma mais rápida para testes iniciais. Você precisa do app **Expo Go** instalado no dispositivo.

#### Para iOS:
1. Instale o **Expo Go** na App Store
2. No seu computador, execute:
   ```bash
   npm start
   ```
3. Escaneie o QR code com a câmera do iPhone
4. O app abrirá no Expo Go

#### Para Android:
1. Instale o **Expo Go** na Play Store
2. No seu computador, execute:
   ```bash
   npm start
   ```
3. Abra o app Expo Go
4. Escaneie o QR code ou toque em "Scan QR code"
5. O app abrirá no Expo Go

**Limitações:** Algumas funcionalidades nativas podem não funcionar perfeitamente no Expo Go.

---

### 2. Build de Desenvolvimento (EAS Build) 🛠️

Cria um arquivo `.apk` (Android) ou `.ipa` (iOS) para instalação direta no dispositivo, sem necessidade da App Store/Play Store.

#### Pré-requisitos

1. Instale o EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Faça login na sua conta Expo:
   ```bash
   eas login
   ```
   (Se não tiver conta, crie em: https://expo.dev)

3. Configure o projeto (se ainda não fez):
   ```bash
   eas build:configure
   ```

#### Para Android (APK):

1. Execute o build:
   ```bash
   eas build --platform android --profile development
   ```

2. Aguarde o build (pode levar 10-20 minutos)

3. Baixe o APK:
   - Após o build, você receberá um link
   - Baixe o arquivo `.apk`
   - Envie para o dispositivo Android via WhatsApp, email, ou transferência USB
   - No dispositivo, habilite "Instalar apps de fontes desconhecidas"
   - Abra o arquivo `.apk` e instale

#### Para iOS (IPA - Requer Conta de Desenvolvedor Apple):

1. Configure o `app.json` com seu Bundle Identifier:
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.seudominio.chegueimae"
       }
     }
   }
   ```

2. Execute o build:
   ```bash
   eas build --platform ios --profile development
   ```

3. Instale via TestFlight ou distribuição ad-hoc

**Nota:** Para iOS, você precisa de uma conta de desenvolvedor Apple ($99/ano) para instalar em dispositivos físicos.

---

### 3. Build de Produção (TestFlight/Play Store Internal Testing) 🚀

Para distribuir para mais testadores de forma organizada.

#### Para Android (Play Store - Internal Testing):

1. Execute o build de produção:
   ```bash
   eas build --platform android --profile production
   ```

2. Envie para a Play Store:
   ```bash
   eas submit --platform android
   ```

3. Configure Internal Testing na Play Console:
   - Acesse https://play.google.com/console
   - Vá em "Teste interno"
   - Adicione emails dos testadores
   - Eles receberão o link para baixar o app

#### Para iOS (TestFlight):

1. Execute o build de produção:
   ```bash
   eas build --platform ios --profile production
   ```

2. Envie para o App Store Connect:
   ```bash
   eas submit --platform ios
   ```

3. Configure TestFlight no App Store Connect:
   - Acesse https://appstoreconnect.apple.com
   - Vá em "TestFlight"
   - Adicione testadores internos/externos
   - Eles receberão um convite por email

---

## Configuração do EAS Build

Crie ou edite o arquivo `eas.json` na raiz do projeto:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Configuração do app.json

Verifique se o `app.json` tem as configurações corretas:

```json
{
  "expo": {
    "name": "Mãe, Chegou!",
    "slug": "cheguei-mae",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.seudominio.chegueimae",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Este app precisa da sua localização para rastreamento em tempo real."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.seudominio.chegueimae",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Este app precisa da sua localização para rastreamento em tempo real."
        }
      ]
    ]
  }
}
```

---

## Passo a Passo Recomendado para Primeiros Testes

### 1. Teste Local com Expo Go (Mais Rápido)

```bash
# Certifique-se de que o backend está rodando
cd backend
npm run dev

# Em outro terminal, inicie o app
npm start
```

Escaneie o QR code com o Expo Go no seu celular.

### 2. Build de Desenvolvimento (Recomendado para Testes Avançados)

```bash
# Configure o EAS (só precisa fazer uma vez)
eas build:configure

# Faça login
eas login

# Build para Android (APK)
eas build --platform android --profile development

# Depois de concluído, baixe e instale o APK no dispositivo
```

### 3. Distribuir para Testadores

Para Android (mais fácil):
```bash
# Build de preview (APK)
eas build --platform android --profile preview

# Ou build de produção (AAB para Play Store)
eas build --platform android --profile production
```

Para iOS:
```bash
# Build de produção
eas build --platform ios --profile production

# Enviar para TestFlight
eas submit --platform ios
```

---

## Variáveis de Ambiente

Para builds de produção, configure as variáveis de ambiente no EAS:

```bash
# Configurar URL da API para produção
eas secret:create --name API_BASE_URL --value https://api.seudominio.com --scope project
```

Ou crie um arquivo `.env.production`:

```
API_BASE_URL=https://api.seudominio.com
```

---

## Checklist Antes de Publicar

- [ ] `app.json` configurado com nome, versão e ícones corretos
- [ ] `eas.json` configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Permissões de localização configuradas
- [ ] Backend configurado e acessível (ou variável de ambiente apontando para produção)
- [ ] Testes locais funcionando
- [ ] Ícones e splash screen configurados

---

## Solução de Problemas

### Erro: "EAS CLI not found"
```bash
npm install -g eas-cli
```

### Erro: "Build failed"
- Verifique os logs em: https://expo.dev
- Verifique se todas as dependências estão no `package.json`

### Erro: "Cannot connect to backend"
- Verifique se o backend está rodando
- Para builds de produção, configure a URL correta nas variáveis de ambiente

### App não abre no dispositivo
- Verifique se o backend está acessível do dispositivo
- Para testes locais, use o IP local (ex: `http://192.168.15.7:3000`)
- Para produção, use um domínio público

---

## Links Úteis

- EAS Dashboard: https://expo.dev
- Documentação EAS Build: https://docs.expo.dev/build/introduction/
- Documentação Expo: https://docs.expo.dev/
- Play Console: https://play.google.com/console
- App Store Connect: https://appstoreconnect.apple.com

---

## Comandos Resumidos

```bash
# Iniciar app para Expo Go
npm start

# Build Android APK (desenvolvimento)
eas build --platform android --profile development

# Build Android APK (preview/testes)
eas build --platform android --profile preview

# Build Android AAB (produção)
eas build --platform android --profile production

# Build iOS (desenvolvimento - requer conta Apple)
eas build --platform ios --profile development

# Build iOS (produção - TestFlight)
eas build --platform ios --profile production

# Enviar para Play Store
eas submit --platform android

# Enviar para App Store/TestFlight
eas submit --platform ios
```

