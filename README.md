# 🚌 Mãe, Chegou!

<div align="center">
  <img src="./assets/images/logotipo.jpg" alt="Mãe, Chegou!" width="300" />
  
  <p><strong>Sistema completo de gestão para transporte escolar</strong></p>
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-~54.0.20-000020?logo=expo)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## 📋 Sobre o Projeto

**Mãe, Chegou!** é uma aplicação mobile completa desenvolvida para gestão de transporte escolar, permitindo que motoristas, responsáveis e administradores gerenciem alunos, rotas, contratos, finanças e muito mais de forma integrada e eficiente.

### 🎯 Principais Funcionalidades

#### 👨‍✈️ Para Motoristas
- **Dashboard** com métricas em tempo real (vagas, receita, inadimplência, manutenções)
- **Gestão de Alunos** (cadastro, edição, visualização)
- **Controle Financeiro** (lançamentos, receitas, despesas)
- **Contratos** (geração, envio, acompanhamento de assinaturas)
- **Manutenção de Veículos** (agendamento, histórico, alertas)
- **Rotas e Localização** (status online/offline, início/fim de rota, mapa)
- **Relatórios** (financeiro, manutenções, exportação PDF/CSV)
- **Perfil Completo** (dados pessoais, CNH, documentos, escolas, vagas, dados bancários)

#### 👨‍👩‍👧 Para Responsáveis
- **Dashboard** com status dos filhos
- **Rastreamento em Tempo Real** da localização do veículo
- **Visualização de Contratos** e assinatura digital
- **Histórico de Pagamentos**
- **Chat** com o motorista
- **Notificações** sobre rotas e cobranças

#### 👨‍💼 Para Administradores
- Todas as funcionalidades do motorista
- Gestão completa de todos os alunos
- Relatórios avançados
- Configurações do sistema

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para o banco de dados)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, mas recomendado)
- [Git](https://git-scm.com/)

### 📱 Para Dispositivos Móveis (Recomendado)

#### 1. Instale o Expo Go
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

#### 2. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd cheguei_mae
```

#### 3. Configure o Backend e Banco de Dados

##### 3.1 Inicie o MySQL via Docker

Na raiz do projeto, execute:
```bash
docker-compose up -d
```

Isso irá iniciar o MySQL 8.0 em um container Docker com as seguintes credenciais:
- Host: `localhost`
- Porta: `3306`
- Usuário: `cheguei_user`
- Senha: `cheguei_pass`
- Banco: `cheguei_mae`

##### 3.2 Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` com as configurações do Docker (já estão pré-configuradas):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=cheguei_user
DB_PASSWORD=cheguei_pass
DB_NAME=cheguei_mae
```

##### 3.3 Execute as Migrations

```bash
npm run migrate
```

##### 3.4 Inicie o Servidor Backend

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

#### 4. Configure o Frontend

Volte para a raiz do projeto e instale as dependências:

```bash
cd ..
npm install
```

ou

```bash
yarn install
```

#### 5. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

ou

```bash
npx expo start
```

#### 5. Execute no Dispositivo

- **Android**: Escaneie o QR Code com o app Expo Go
- **iOS**: Use a câmera do iPhone para escanear o QR Code

> ⚠️ **Importante**: Certifique-se de que seu dispositivo móvel e computador estão na mesma rede Wi-Fi.

### 💻 Para Emuladores/Simuladores

#### Android

```bash
npm run android
```

ou

```bash
npx expo start --android
```

> Requer: [Android Studio](https://developer.android.com/studio) com um emulador configurado

#### iOS (apenas macOS)

```bash
npm run ios
```

ou

```bash
npx expo start --ios
```

> Requer: [Xcode](https://developer.apple.com/xcode/) instalado

### 🌐 Para Web

```bash
npm run web
```

ou

```bash
npx expo start --web
```

---

## 📁 Estrutura do Projeto

```
cheguei_mae/
├── app/                          # Telas e rotas (Expo Router)
│   ├── index.tsx                 # Dashboard
│   ├── alunos.tsx                # Lista de alunos
│   ├── cadastro-aluno.tsx        # Cadastro/Edição de aluno
│   ├── aluno-detalhe/            # Detalhes do aluno
│   ├── financeiro.tsx            # Gestão financeira
│   ├── contratos.tsx             # Gestão de contratos
│   ├── manutencao.tsx            # Manutenção de veículos
│   ├── rotas.tsx                 # Rotas e localização
│   ├── notificacoes.tsx          # Sistema de notificações
│   ├── chat.tsx                  # Chat com responsáveis
│   ├── perfil.tsx                # Perfil do motorista
│   ├── relatorios.tsx            # Relatórios
│   └── localizacao.tsx           # Mapa de localização
│
├── components/                    # Componentes reutilizáveis
│   ├── layout/                   # Layouts por tipo de usuário
│   │   ├── AppLayout.tsx         # Layout principal
│   │   ├── MotoristaLayout.tsx   # Layout do motorista
│   │   ├── AdminLayout.tsx       # Layout do admin
│   │   ├── ResponsavelLayout.tsx # Layout do responsável
│   │   ├── Header.tsx            # Cabeçalho
│   │   ├── Sidebar.tsx           # Menu lateral
│   │   └── BottomNavigation.tsx  # Navegação inferior
│   └── ui/                       # Componentes de UI
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Chip.tsx
│       └── SearchBar.tsx
│
├── contexts/                      # Contextos React
│   ├── AuthContext.tsx           # Autenticação
│   └── StatusOnlineContext.tsx   # Status online/offline
│
├── types/                         # Tipos TypeScript
│   ├── user.ts                   # Tipos de usuário
│   ├── aluno.ts                  # Tipos de aluno
│   ├── contrato.ts               # Tipos de contrato
│   ├── financeiro.ts             # Tipos financeiros
│   ├── manutencao.ts             # Tipos de manutenção
│   ├── rota.ts                   # Tipos de rota
│   ├── notificacao.ts            # Tipos de notificação
│   ├── chat.ts                   # Tipos de chat
│   └── perfil.ts                 # Tipos de perfil
│
├── services/                      # Serviços e dados mock
│   └── mockData.ts               # Dados mockados
│
├── constants/                     # Constantes
│   ├── theme.ts                  # Tema do app
│   └── adminlte-theme.ts        # Tema AdminLTE
│
├── assets/                        # Recursos estáticos
│   └── images/                   # Imagens e logos
│
└── package.json                  # Dependências do projeto
```

---

## 🔐 Credenciais de Teste

O projeto inclui usuários mockados para testes:

### Administrador
- **Email**: `admin@maechegou.com`
- **Senha**: `admin123`

### Motorista
- **Email**: `motorista@maechegou.com`
- **Senha**: `motorista123`

### Responsável
- **Email**: `responsavel@maechegou.com`
- **Senha**: `responsavel123`

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma e ferramentas para React Native
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - Roteamento baseado em arquivos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[React Native Maps](https://github.com/react-native-maps/react-native-maps)** - Mapas e localização
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** - Geolocalização
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Armazenamento local

---

## 📱 Compatibilidade

- ✅ **iOS** (via Expo Go ou build nativo)
- ✅ **Android** (via Expo Go ou build nativo)
- ✅ **Web** (via navegador)

---

## 🎨 Design System

O projeto utiliza um tema inspirado no **AdminLTE** com:

- **Cores Principais**:
  - Verde Localização: `#3D8361`
  - Azul Confirmação: `#68B3E9`
  - Cinza Escuro: `#404E5A`

- **Componentes**:
  - Cards estilizados
  - Botões com variantes (primary, secondary, success, danger, warning)
  - Inputs com validação
  - Chips para tags e filtros
  - Layout responsivo

---

## 📝 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start

# Iniciar com cache limpo
npm start -- --clear

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na Web
npm run web

# Verificar erros de lint
npm run lint
```

---

## 🔄 Próximos Passos

### Funcionalidades em Desenvolvimento

- [ ] Integração com backend/API
- [ ] Notificações push
- [ ] Assinatura digital de contratos
- [ ] Upload de arquivos e documentos
- [ ] Gráficos avançados
- [ ] Exportação de relatórios em PDF
- [ ] Integração com pagamentos (PIX, boleto)
- [ ] Chat em tempo real
- [ ] Rastreamento GPS em tempo real

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

## 👥 Equipe

Desenvolvido com ❤️ para facilitar a gestão de transporte escolar.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

<div align="center">
  <p>Feito com ❤️ usando React Native e Expo</p>
  <p><strong>Mãe, Chegou! 🚌</strong></p>
</div>
