# Dependências do Projeto — cheguei_mae

> Gerado pelo **Scout** do Reversa em 2026-05-18
> Escala de confiança: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## Frontend (React Native / Expo)

> Fonte: `package.json` (raiz)

### Dependências de Produção

| Pacote | Versão | Função |
|--------|--------|--------|
| `react` | `19.1.0` | 🟢 Core React |
| `react-native` | `0.81.5` | 🟢 Framework mobile |
| `react-dom` | `19.1.0` | 🟢 Renderização web |
| `expo` | `~54.0.20` | 🟢 Plataforma Expo |
| `expo-router` | `~6.0.13` | 🟢 Roteamento file-based |
| `@react-navigation/native` | `^7.1.8` | 🟢 Navegação base |
| `@react-navigation/bottom-tabs` | `^7.4.0` | 🟢 Tab navigation |
| `@react-navigation/elements` | `^2.6.3` | 🟢 Elementos de navegação |
| `react-native-screens` | `~4.16.0` | 🟢 Gerenciamento de telas nativas |
| `react-native-safe-area-context` | `~5.6.0` | 🟢 Safe area insets |
| `react-native-gesture-handler` | `~2.28.0` | 🟢 Gestos nativos |
| `react-native-reanimated` | `~4.1.1` | 🟢 Animações nativas |
| `react-native-web` | `~0.21.0` | 🟢 Suporte web |
| `react-native-worklets` | `0.5.1` | 🟢 Worklets para Reanimated |
| `react-native-maps` | `^1.18.0` | 🟢 Mapas (Google Maps / Apple Maps) |
| `@react-native-async-storage/async-storage` | `^2.2.0` | 🟢 Armazenamento local (tokens, dados offline) |
| `@expo/vector-icons` | `^15.0.3` | 🟢 Ícones |
| `expo-constants` | `~18.0.10` | 🟢 Constantes do app |
| `expo-font` | `~14.0.9` | 🟢 Carregamento de fontes |
| `expo-haptics` | `~15.0.7` | 🟢 Feedback tátil |
| `expo-image` | `~3.0.10` | 🟢 Otimização de imagens |
| `expo-image-picker` | `~16.0.3` | 🟢 Seleção de imagens da galeria/câmera |
| `expo-linking` | `~8.0.8` | 🟢 Deep linking |
| `expo-location` | `^19.0.7` | 🟢 Geolocalização GPS |
| `expo-splash-screen` | `~31.0.10` | 🟢 Splash screen nativa |
| `expo-status-bar` | `~3.0.8` | 🟢 Barra de status |
| `expo-symbols` | `~1.0.7` | 🟢 SF Symbols (iOS) |
| `expo-system-ui` | `~6.0.8` | 🟢 System UI config |
| `expo-web-browser` | `~15.0.8` | 🟢 Navegador in-app |

### Dependências de Desenvolvimento

| Pacote | Versão | Função |
|--------|--------|--------|
| `typescript` | `~5.9.2` | 🟢 TypeScript compiler |
| `@types/react` | `~19.1.0` | 🟢 Tipos do React |
| `eslint` | `^9.25.0` | 🟢 Linter |
| `eslint-config-expo` | `~10.0.0` | 🟢 Config ESLint Expo |

---

## Backend (Node.js / Express)

> Fonte: `backend/package.json`

### Dependências de Produção

| Pacote | Versão | Função |
|--------|--------|--------|
| `express` | `^4.21.1` | 🟢 Framework web |
| `cors` | `^2.8.5` | 🟢 CORS middleware |
| `dotenv` | `^16.4.5` | 🟢 Variáveis de ambiente |
| `mysql2` | `^3.11.5` | 🟢 Driver MySQL |
| `jsonwebtoken` | `^9.0.2` | 🟢 Autenticação JWT |
| `bcryptjs` | `^2.4.3` | 🟢 Hash de senhas |
| `express-validator` | `^7.2.0` | 🟢 Validação de input |
| `multer` | `^1.4.5-lts.1` | 🟢 Upload de arquivos |
| `uuid` | `^11.0.3` | 🟢 Geração de UUIDs |
| `@types/bcryptjs` | `^2.4.6` | 🟡 Deveria ser devDependency |
| `@types/express` | `^4.17.21` | 🟡 Deveria ser devDependency |
| `@types/jsonwebtoken` | `^9.0.5` | 🟡 Deveria ser devDependency |

### Dependências de Desenvolvimento

| Pacote | Versão | Função |
|--------|--------|--------|
| `typescript` | `^5.7.2` | 🟢 TypeScript compiler |
| `tsx` | `^4.19.2` | 🟢 Runtime TypeScript (dev) |
| `eslint` | `^9.15.0` | 🟢 Linter |
| `@typescript-eslint/eslint-plugin` | `^8.15.0` | 🟢 Plugin ESLint TS |
| `@typescript-eslint/parser` | `^8.15.0` | 🟢 Parser ESLint TS |
| `@types/cors` | `^2.8.17` | 🟢 Tipos CORS |
| `@types/multer` | `^1.4.12` | 🟢 Tipos Multer |
| `@types/node` | `^22.10.1` | 🟢 Tipos Node.js |
| `@types/uuid` | `^10.0.0` | 🟢 Tipos UUID |

---

## Gerenciadores de Pacotes

| Local | Gerenciador | Lock File |
|-------|-------------|-----------|
| Raiz (frontend) | npm | `package-lock.json` (851KB) |
| Backend | npm | `package-lock.json` (219KB) |

---

## Integrações Externas

| Integração | Status | Detalhes |
|------------|--------|----------|
| MySQL 8.0 | 🟢 Configurado | Via Docker Compose, driver `mysql2` |
| Google Maps / Apple Maps | 🟢 Configurado | Via `react-native-maps` |
| GPS / Geolocalização | 🟢 Configurado | Via `expo-location` |
| Pagamentos (PIX, boleto) | 🔴 Planejado | Listado em "Próximos Passos" do README |
| Push Notifications | 🔴 Planejado | Listado em "Próximos Passos" do README |

---

## Scripts NPM

### Frontend (raiz)
| Script | Comando | Descrição |
|--------|---------|-----------|
| `start` | `expo start` | Servidor de desenvolvimento |
| `android` | `expo start --android` | Android dev |
| `ios` | `expo start --ios` | iOS dev |
| `web` | `expo start --web` | Web dev |
| `lint` | `expo lint` | Linter |
| `reset-project` | `node ./scripts/reset-project.js` | Reset do projeto |

### Backend
| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `tsx watch src/server.ts` | Dev server com hot reload |
| `build` | `tsc` | Compilação TypeScript |
| `start` | `node dist/server.js` | Produção |
| `migrate` | `tsx src/database/migrate.ts` | Executar migrations |
| `seed` | `tsx src/database/seed.ts` | Dados de teste |
| `lint` | `eslint src --ext .ts` | Linter |
| `type-check` | `tsc --noEmit` | Verificação de tipos |

---

## Observações

> [!WARNING]
> **@types em dependencies:** Os pacotes `@types/bcryptjs`, `@types/express` e `@types/jsonwebtoken` estão em `dependencies` ao invés de `devDependencies` no backend. Não afeta o funcionamento mas é uma má prática.

> [!NOTE]
> **Sem ORM:** O backend usa queries SQL puras via `mysql2` (sem Prisma, TypeORM, Sequelize, etc.). Os models são classes/funções que encapsulam as queries.
