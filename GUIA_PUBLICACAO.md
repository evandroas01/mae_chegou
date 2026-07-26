# Guia de Publicação — Cheguei Mãe 🚌

> Guia definitivo para publicar o app nas lojas Apple App Store e Google Play Store.
> App ID: **br.com.chegueimae** | Versão: 1.0.0

---

## ⚡ Pré-requisitos

| Item | Link | Status |
|---|---|---|
| Conta Apple Developer (US$99/ano) | https://developer.apple.com | ❌ Pendente |
| Conta Google Play Console (US$25 único) | https://play.google.com/console | ❌ Pendente |
| Conta Expo (gratuita) | https://expo.dev | ❌ Pendente |
| EAS CLI instalado | - | ❌ Pendente |
| Backend no Render funcionando | - | ❌ Pendente |

---

## Etapa 1 — Instalar EAS CLI

```bash
npm install -g eas-cli
```

---

## Etapa 2 — Fazer login na sua conta Expo

```bash
eas login
```

---

## Etapa 3 — Vincular o projeto Expo

```bash
# Dentro da pasta do app (cheguei_mae)
eas build:configure
```

Isso vai adicionar um `extra.eas.projectId` no `app.json` automaticamente.

---

## Etapa 4 — Atualizar a URL do Backend

Antes do build, faça o deploy do backend no Render (veja `INICIAR_BACKEND.md`).
Após o deploy, pegue a URL pública (ex: `https://cheguei-mae-backend.onrender.com`)
e atualize a linha em `constants/api.ts`:

```ts
return 'https://SUA-URL-REAL.onrender.com/api';
```

---

## Etapa 5 — Build Android (Google Play)

```bash
# Build de produção — gera arquivo .aab
eas build --platform android --profile production
```

O arquivo `.aab` será gerado na nuvem (EAS) e você receberá um link para download.

---

## Etapa 6 — Build iOS (App Store)

```bash
# Build de produção — gera arquivo .ipa
eas build --platform ios --profile production
```

> Durante o primeiro build iOS, o EAS vai pedir suas credenciais do Apple Developer.
> Ele cria automaticamente os certificados e provisioning profiles.

---

## Etapa 7 — Publicar na Google Play Store 🤖

### 7.1 — Criar o App no Console

1. Acesse https://play.google.com/console
2. Clique em **Criar app**
3. Preencha:
   - **Nome:** Cheguei Mãe
   - **Idioma padrão:** Português (Brasil)
   - **Tipo:** App
   - **Gratuito ou pago:** Gratuito

### 7.2 — Configurar a Ficha da Loja

- **Ícone de alta resolução:** 512×512px PNG (sem transparência)
- **Ícone de feature:** 1024×500px (imagem de destaque)
- **Screenshots:** mínimo 2 prints do app em uso
- **Descrição curta:** até 80 caracteres
- **Descrição completa:** até 4.000 caracteres
- **Categoria:** Educação ou Estilo de vida

### 7.3 — Enviar o AAB (via EAS Submit)

```bash
eas submit --platform android --profile production
```

Ou manualmente: no Console → Produção → Criar versão → Upload do arquivo `.aab`.

### 7.4 — Classificação de Conteúdo

- Responder questionário de classificação etária no Console
- App receberá classificação **Livre** (sem conteúdo restrito)

### 7.5 — Política de Privacidade

- Obrigatória — precisa de uma URL pública com a política
- Pode ser uma página simples no GitHub Pages ou Notion

### 7.6 — Revisão e Publicação

- Tempo de revisão: **1 a 3 dias úteis**
- Recomendado: publicar primeiro em **Teste Interno** → validar → promover para Produção

---

## Etapa 8 — Publicar na Apple App Store 🍎

### 8.1 — Criar o App no App Store Connect

1. Acesse https://appstoreconnect.apple.com
2. Clique em **+** → **New App**
3. Preencha:
   - **Plataformas:** iOS
   - **Nome:** Cheguei Mãe
   - **Idioma:** Português (Brasil)
   - **Bundle ID:** `br.com.chegueimae`
   - **SKU:** `chegueimae001` (identificador interno seu)

### 8.2 — Configurar a Ficha da App

- **Ícone:** gerado automaticamente pelo build (1024×1024)
- **Screenshots obrigatórios:** iPhone 6.7" (1290×2796px)
- **Descrição:** até 4.000 caracteres
- **Palavras-chave:** até 100 caracteres (ex: "van escolar, transporte, aluno, localização")
- **URL de suporte:** obrigatório (pode ser e-mail em formato URL ou página web)
- **URL de privacidade:** obrigatório

### 8.3 — Enviar o IPA (via EAS Submit)

```bash
eas submit --platform ios --profile production
```

O EAS sobe automaticamente o build para o App Store Connect.

### 8.4 — TestFlight (Recomendado antes da publicação)

- No App Store Connect, vá em **TestFlight** → adicione testadores internos
- Valide o app em dispositivos reais antes de submeter para revisão

### 8.5 — Submeter para Revisão

- No App Store Connect → selecione o build → clique em **Submit for Review**
- Preencha questionário de conformidade de exportação (responda "Não" para criptografia)
- Tempo de revisão Apple: **1 a 3 dias úteis** (pode variar)

---

## Checklist Final Antes de Publicar

### Android
- [ ] URL do backend de produção configurada em `constants/api.ts`
- [ ] `eas build --platform android` concluído com sucesso
- [ ] Ficha da loja preenchida (ícone, screenshots, descrição)
- [ ] Classificação de conteúdo respondida
- [ ] Política de privacidade publicada em URL pública
- [ ] `.aab` enviado via `eas submit` ou manualmente

### iOS
- [ ] URL do backend de produção configurada em `constants/api.ts`
- [ ] `bundleIdentifier: br.com.chegueimae` no `app.json` ✅
- [ ] `eas build --platform ios` concluído com sucesso
- [ ] Ficha no App Store Connect preenchida
- [ ] Screenshots iPhone 6.7" prontos
- [ ] Testado no TestFlight
- [ ] Submetido para revisão via `eas submit`

---

## Identificadores do App

| Campo | Valor |
|---|---|
| Bundle Identifier (iOS) | `br.com.chegueimae` |
| Package (Android) | `br.com.chegueimae` |
| App Name | `Cheguei Mãe` |
| Versão | `1.0.0` |
| Build iOS | `1` |
| Version Code Android | `1` |

> ⚠️ O `bundleIdentifier` e o `package` são **imutáveis** após o primeiro upload nas lojas.

---

## Comandos de Referência Rápida

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Enviar para as lojas
eas submit --platform android --profile production
eas submit --platform ios --profile production

# Build das duas plataformas de uma vez
eas build --platform all --profile production
```
