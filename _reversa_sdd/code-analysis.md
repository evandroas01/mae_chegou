# Análise de Código — cheguei_mae

> Gerado pelo **Arqueólogo** do Reversa em 2026-05-18
> Nível: **Essencial** | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## 1. Módulo: auth

### Propósito
Autenticação JWT, registro de usuários, gestão de perfil e autorização por roles.

### Fluxo principal
1. Login: `POST /api/auth/login` → valida email/senha via bcrypt → gera JWT com `{userId, userRole, tenantId}` → retorna token + user (sem password)
2. Registro: `POST /api/auth/register` → verifica email único → hash bcrypt → cria user → gera JWT
3. Me: `GET /api/auth/me` → extrai token do header → retorna dados do usuário autenticado
4. Update: `PUT /api/auth/me` → atualiza campos parciais (nome, email, telefone, cpf, password)
5. Responsáveis: `GET /api/auth/responsaveis` → lista responsáveis vinculados ao motorista (apenas role `motorista`)

### Frontend
- `AuthContext.tsx`: Provider com `login()`, `logout()`, `updateUser()`, persiste user/token no AsyncStorage
- `app/login.tsx`: Tela de login
- Proteção de rotas em `_layout.tsx` via `isAuthenticated` → redirect para `/login`

### Regras de negócio 🟢
- Email deve ser único no sistema
- JWT expira em 7 dias (`JWT_EXPIRES_IN=7d`)
- Token verificado a cada carregamento do app (chama `/auth/me`)
- Responsáveis são filtrados por `motoristaId` e role `responsavel`

### Entidades (resumo de dados)

| Entidade | Campos principais | Tipo |
|----------|-------------------|------|
| `User` | id, nome, email, password, role, telefone?, cpf?, motoristaId?, tenantId? | 🟢 Interface TS |
| `UserRole` | admin \| motorista \| responsavel \| aluno | 🟢 Enum |

---

## 2. Módulo: alunos

### Propósito
CRUD completo de alunos com criação cascata de escola, endereço e responsável.

### Fluxo principal
1. **Criar aluno** (`POST /api/alunos`): processo complexo em cascata:
   - Busca ou cria escola (por nome + tenantId)
   - Cria endereço do contratante
   - Cria endereço de saída (opcional, diferente do contratante)
   - Busca ou cria responsável (por CPF ou ID existente)
   - Cria o aluno vinculando todas as entidades
2. **Listar** (`GET /api/alunos`): filtra por role — motorista vê seus alunos, responsável vê seus filhos, admin vê todos
3. **Detalhar** (`GET /api/alunos/:id`): retorna aluno com JOINs (escola, responsável)
4. **Atualizar** (`PUT /api/alunos/:id`): atualização parcial dinâmica
5. **Deletar** (`DELETE /api/alunos/:id`): hard delete com filtro tenant

### Regras de negócio 🟢
- Se responsável não existe (por CPF), é criado automaticamente com email temporário `{cpf}@temp.com` e senha `temp_password` 🔴 **LACUNA: senha não é hasheada na criação inline**
- Escola é criada com cidade "São Paulo" e estado "SP" hardcoded 🟡 **INFERIDO: valores defaults temporários**
- Motorista só vê alunos com `status = 'ativo'`; responsável e admin veem todos
- Resposta inclui dados aninhados da escola e responsável via JOIN
- Status de pagamento é sempre `em_dia` como default (TODO no código)

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Aluno` | id, nome, dataNascimento, serie, turma, periodo(M/T/N), status, escolaId, responsavelId, motoristaId, enderecoContratanteId, enderecoSaidaId?, valorMensal, formaPagamento, diasSemana(JSON), datasVencimento(JSON), contratoId?, tenantId |
| `Escola` | id, nome, endereco, cidade, estado, cep, tenantId |
| `Endereco` | id, rua, numero, complemento?, bairro, cidade, estado, cep, latitude?, longitude?, tenantId |

---

## 3. Módulo: financeiro

### Propósito
Gestão de lançamentos financeiros (receitas e despesas) com resumo mensal e cálculo de inadimplência.

### Fluxo principal
1. **Criar lançamento** (`POST /api/financeiro`): calcula status automaticamente — se `dataVencimento < hoje`, marca como `atrasado`, senão `pendente`
2. **Listar** (`GET /api/financeiro`): filtros por tipo, status, dataInicio, dataFim
3. **Resumo** (`GET /api/financeiro/resumo`): algoritmo de agregação:
   - Total receitas do mês corrente
   - Total despesas do mês corrente
   - Saldo (todas receitas pagas - todas despesas pagas)
   - Inadimplência (receitas com status `atrasado`)
   - Percentual de inadimplência = `valor_atrasado / receita_mes * 100`

### Regras de negócio 🟢
- Lançamentos podem ser vinculados a aluno e/ou contrato
- Suporte a recorrência (mensal, trimestral, semestral, anual) com data fim 🔴 **LACUNA: recorrência não é materializada automaticamente, apenas armazenada como metadado**
- Saldo considera apenas lançamentos com `status = 'pago'`
- Categorias: receita_recorrente, receita_extra, despesa_fixa, despesa_variavel

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Lancamento` | id, tipo(receita/despesa), categoria, valor, data, dataVencimento?, dataPagamento?, descricao, status(pago/pendente/atrasado), vinculadoAlunoId?, vinculadoContratoId?, recorrenciaTipo?, recorrenciaMeses?, recorrenciaDataFim?, tenantId |
| `ResumoFinanceiro` | saldoAtual, totalReceitasMes, totalDespesasMes, saldoMes, inadimplencia{valor, percentual, quantidade} |

---

## 4. Módulo: contratos

### Propósito
Gestão do ciclo de vida de contratos (criação, envio, assinatura, cancelamento) com log de auditoria.

### Fluxo principal
1. **Criar** (`POST /api/contratos`): gera número automático `CT-{ANO}-{SEQ}`, vincula alunos (N:N), cria log `criado`
2. **Listar** (`GET /api/contratos`): responsável vê apenas seus contratos; enriquece com alunos e logs
3. **Assinar** (`PUT /api/contratos/:id/assinar`): atualiza status para `assinado`, registra `dataAssinatura`, cria log
4. **Cancelar** (`PUT /api/contratos/:id/cancelar`): atualiza status para `cancelado`, aceita motivo, cria log

### Regras de negócio 🟢
- Número do contrato: `CT-{ano}-{sequencial 3 dígitos}` (baseado no COUNT de contratos do tenant)
- Ciclo de vida: `pendente → assinado` ou `pendente → cancelado`
- Relação N:N com alunos via tabela `contrato_alunos`
- Log de auditoria automático em toda mudança de estado

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Contrato` | id, numero, responsavelId, periodo, valor, vencimento, statusAssinatura, statusPagamento, periodoAtraso?, clausulas?, arquivoUrl?, dataInicio, dataFim?, dataEnvio?, dataAssinatura?, tenantId |
| `ContratoLog` | id, contratoId, acao(criado/enviado/assinado/cancelado/reemitido), data, observacoes? |

---

## 5. Módulo: manutencao

### Propósito
Agendamento e controle de manutenções preventivas e corretivas de veículos.

### Fluxo principal
1. **Criar** (`POST /api/manutencoes`): valida que veículo pertence ao motorista autenticado; se `dataAgendada` → status `agendada`, senão status `realizada` com `dataRealizada = now`
2. **Listar** (`GET /api/manutencoes`): JOIN com veículo para exibir placa/modelo; motorista vê apenas seus veículos
3. **Veículos** (`GET /api/manutencoes/veiculos`): retorna veículos do motorista (shortcut)

### Regras de negócio 🟢
- Manutenção pode ter repetição por km ou meses 🔴 **LACUNA: lógica de repetição não está implementada (apenas armazena configuração)**
- Motorista só acessa manutenções de seus próprios veículos
- Status: agendada, realizada, atrasada

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Manutencao` | id, veiculoId, dataAgendada?, dataRealizada?, tipo(preventiva/corretiva), descricao, custo, quilometragem, status, repetirTipo?(km/meses), repetirIntervalo?, tenantId |
| `Veiculo` | id, placa(UNIQUE), modelo, ano, quilometragemAtual, motoristaId, tenantId |
| `DocumentoVeiculo` | id, veiculoId, tipo(licenciamento/seguro/vistoria_escolar), numero, validade, arquivoUrl?, tenantId |

---

## 6. Módulo: rotas

### Propósito
Gestão de rotas de transporte escolar com tracking GPS em tempo real.

### Fluxo principal
1. **Criar rota** (`POST /api/rotas`): cria rota + pontos com ordem sequencial
2. **Iniciar** (`PUT /api/rotas/:id/iniciar`): status → `em_andamento`, registra `horaInicio`
3. **Finalizar** (`PUT /api/rotas/:id/finalizar`): status → `finalizada`, registra `horaFim`
4. **Localização** (`POST /api/rotas/localizacao`): salva coordenadas GPS do veículo
5. **Buscar localização** (`GET /api/rotas/localizacao/:veiculoId`): última posição conhecida
6. **Localização do motorista** (`GET /api/rotas/localizacao/motorista`): responsável busca localização do veículo do seu motorista vinculado

### Máquina de estados 🟢
```
nao_iniciada → em_andamento → finalizada
```

### Regras de negócio 🟢
- Pontos da rota têm tipo: `casa`, `escola`, `retorno`
- Pontos são ordenados sequencialmente (campo `ordem`)
- Responsável rastreia motorista via cadeia: user.motoristaId → veiculos → localizacao_veiculos (último registro)
- Paradas registram hora de chegada/saída e flag de notificação enviada

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Rota` | id, periodo, data, status, motoristaId, veiculoId, horaInicio?, horaFim?, tenantId |
| `PontoRota` | id, rotaId, alunoId?, tipo(casa/escola/retorno), enderecoId, ordem, tempoEstimado? |
| `ParadaRota` | id, rotaId, pontoId, horaChegada?, horaSaida?, notificacaoEnviada |
| `LocalizacaoVeiculo` | id, veiculoId, latitude, longitude, timestamp, velocidade?, direcao?, tenantId |

---

## 7. Módulo: notificacoes

### Propósito
Envio de notificações de motoristas para responsáveis, com suporte a agendamento e destinatários individuais ou broadcast.

### Fluxo principal
1. **Criar** (`POST /api/notificacoes`):
   - Se `tipo = 'especifico'`: insere destinatários individuais na tabela `notificacao_destinatarios`
   - Se `tipo = 'todos'`: busca todos responsáveis do tenant e cria registros de destinatários
   - Se `enviarAgora = true`: status `enviada`, senão `agendada`
2. **Listar** (`GET /api/notificacoes`): responsável vê apenas notificações destinadas a ele (com JOIN), motorista/admin vê todas do tenant
3. **Marcar como lida** (`PUT /api/notificacoes/:id/lida`): atualiza `lida = true` e `dataLeitura` para o destinatário específico
4. **Responsáveis disponíveis** (`GET /api/notificacoes/responsaveis`): lista responsáveis dos alunos do motorista (para seleção de destinatários)

### Regras de negócio 🟢
- Gatilhos automáticos previstos na tabela (faturamento, rota_inicio, rota_fim, contrato_pendente, manutencao_vencimento) 🔴 **LACUNA: lógica de disparo de gatilhos não está implementada**
- Template de notificação previsto (`templateId`) mas não implementado

### Entidades

| Entidade | Campos principais |
|----------|-------------------|
| `Notificacao` | id, tipo(todos/especifico), titulo, mensagem, enviarAgora, dataHoraAgendamento?, status, templateId?, gatilhoTipo?, gatilhoParametros?, remetenteId, tenantId |
| `NotificacaoDestinatario` | id, notificacaoId, destinatarioId, lida, dataLeitura? |

---

## 8. Módulo: chat

### Propósito 🟡
Tela de chat para comunicação motorista ↔ responsável.

### Status
🔴 **LACUNA**: Existe tela frontend (`app/chat.tsx`, 9KB) mas **não há backend implementado** — nenhum controller, model ou rota dedicados ao chat. Provavelmente usa dados mock.

---

## 9. Módulo: perfil

### Propósito
Tela de perfil do usuário com dados pessoais, veículo, CNH, escolas, vagas e dados bancários.

### Status
- Frontend: `app/perfil.tsx` (23KB) — tela rica com múltiplas seções
- Backend: reutiliza `AuthController.update()` e `AuthController.me()` para dados básicos
- 🔴 **LACUNA**: Campos avançados do perfil (CNH, dados bancários, vagas) não têm tabelas dedicadas no banco

---

## 10. Módulo: upload

### Propósito
Upload de arquivos (documentos, imagens) via Multer.

### Fluxo
1. **Upload único** (`POST /api/upload`): retorna URL, filename, originalName, size, mimetype
2. **Upload múltiplo** (`POST /api/upload/multiple`): mesmo para múltiplos arquivos

### Configuração 🟢
- Storage: disco local em `backend/uploads/`
- Servido estaticamente em `/uploads`

---

## 11. Módulo: relatorios

### Propósito 🟡
Tela de relatórios com opções de exportação (PDF/CSV).

### Status
- Frontend: `app/relatorios.tsx` (4.7KB)
- 🔴 **LACUNA**: Sem backend dedicado — provavelmente consome dados dos módulos financeiro, manutenção e alunos

---

## 12. Módulo: dashboard

### Propósito
Painel principal com métricas consolidadas (vagas, receita, inadimplência, manutenções).

### Status
- Frontend: `app/index.tsx` (23KB) — dashboard rico com cards de métricas, gráficos e atalhos
- Backend: consome resumo financeiro (`/api/financeiro/resumo`), contagem de alunos, etc.
- 🟡 **INFERIDO**: Não tem controller próprio, agrega dados de outros módulos

---

## Padrões Transversais

### Arquitetura Backend 🟢
- **Padrão**: Controller → Model → Pool MySQL (queries manuais, sem ORM)
- **Validação**: `express-validator` via validators dedicados por entidade
- **Autenticação**: JWT middleware → Authorization header
- **Multi-tenant**: Middleware `requireTenant` + filtro `tenantId` em todas as queries
- **Error handling**: try/catch em cada método com `console.error` + resposta 500 genérica

### Arquitetura Frontend 🟢
- **Navegação**: Expo Router (file-based routing)
- **Estado global**: React Context (AuthContext, StatusOnlineContext)
- **API client**: Classe `ApiService` com interceptor JWT, timeout, tratamento de 401
- **Armazenamento local**: AsyncStorage para token e user
- **Layouts**: 4 layouts por role (Admin, Motorista, Responsável, Aluno) com sidebars e bottom navigation

### Vulnerabilidades e TODOs identificados

| Item | Severidade | Local |
|------|-----------|-------|
| Responsável criado com `temp_password` não hasheado | 🔴 Alta | `AlunoController.ts:119` |
| JWT secret hardcoded no `.env` | 🟡 Média | `backend/.env:10` |
| Escola criada com cidade/estado hardcoded | 🟡 Média | `AlunoController.ts:45` |
| Recorrência financeira não materializada | 🟡 Média | `FinanceiroController.ts` |
| Repetição de manutenção não implementada | 🟡 Média | `ManutencaoController.ts` |
| Gatilhos de notificação não implementados | 🟡 Média | `NotificacaoController.ts` |
| Chat sem backend | 🔴 Alta | `app/chat.tsx` |
| Status pagamento aluno sempre `em_dia` | 🟡 Média | `AlunoModel.ts:199` |
| Perfil avançado sem tabelas | 🟡 Média | `app/perfil.tsx` |
| Sem testes automatizados | 🔴 Alta | Projeto inteiro |
| `@types/*` em dependencies ao invés de devDependencies | 🟢 Baixa | `backend/package.json` |
