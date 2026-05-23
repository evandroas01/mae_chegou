# Domínio do Sistema — cheguei_mae

> Gerado pelo **Detetive** do Reversa em 2026-05-18
> Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## Glossário de Domínio

| Termo | Definição | Confiança |
|-------|-----------|-----------|
| **Motorista** | Profissional de transporte escolar que gerencia alunos, rotas, veículos e finanças. É o usuário central do sistema. Possui veículos, cria rotas e notifica responsáveis. | 🟢 |
| **Responsável** | Pai, mãe ou tutor legal de um aluno. Vinculado a um motorista. Recebe notificações, acompanha localização e assina contratos. | 🟢 |
| **Aluno** | Criança ou adolescente transportado. Vinculado a uma escola, um responsável e um motorista. Possui endereço de saída (embarque) e endereço do contratante. | 🟢 |
| **Admin** | Administrador do sistema. Tem acesso total a todos os dados do tenant. | 🟢 |
| **Tenant** | Unidade de isolamento de dados. Cada motorista/empresa opera como um tenant independente. | 🟢 |
| **Rota** | Trajeto planejado do motorista, composto por pontos de parada ordenados. Tem ciclo de vida: não iniciada → em andamento → finalizada. | 🟢 |
| **Ponto de Rota** | Local de embarque/desembarque dentro de uma rota. Pode ser do tipo `casa` (residência do aluno), `escola` ou `retorno`. | 🟢 |
| **Parada** | Registro efetivo de uma parada em um ponto — hora de chegada, hora de saída e flag de notificação enviada. | 🟢 |
| **Contrato** | Documento formal entre motorista e responsável. Define valor, período, dia de vencimento. Possui número auto-gerado (`CT-ANO-SEQ`). | 🟢 |
| **Lançamento** | Registro financeiro de receita ou despesa. Pode ser vinculado a um aluno e/ou contrato. | 🟢 |
| **Manutenção** | Registro de manutenção preventiva ou corretiva de um veículo. Pode ser agendada ou já realizada. | 🟢 |
| **Notificação** | Mensagem enviada pelo motorista aos responsáveis. Pode ser para todos ou para destinatários específicos. Suporta agendamento. | 🟢 |
| **Veículo** | Van ou outro meio de transporte escolar. Possui placa, modelo, quilometragem e documentos obrigatórios (licenciamento, seguro, vistoria escolar). | 🟢 |
| **Localização** | Coordenadas GPS do veículo em tempo real. Usada para rastreamento pelo responsável. | 🟢 |
| **Período** | Turno escolar: `M` (Manhã), `T` (Tarde), `N` (Noite). | 🟢 |
| **Escola** | Instituição de ensino onde o aluno estuda. Pode ser criada automaticamente no cadastro de aluno. | 🟢 |
| **Endereço** | Localização física com suporte a geocodificação (latitude/longitude). | 🟢 |
| **Vaga** | Capacidade disponível para novos alunos. | 🟡 Inferido — mencionado no dashboard mas sem tabela dedicada. |

---

## Regras de Negócio

### Auth & Acesso

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-01 | Email deve ser único em todo o sistema (não apenas no tenant) | 🟢 | `AuthController.ts:52` |
| RN-02 | Token JWT expira em 7 dias | 🟢 | `backend/.env` |
| RN-03 | Token verificado a cada carregamento do app (call to `/auth/me`) | 🟢 | `AuthContext.tsx:37` |
| RN-04 | Token inválido limpa sessão local (AsyncStorage) | 🟢 | `AuthContext.tsx:40` |
| RN-05 | Tenant ID é resolvido a cada request via DB lookup; fallback para userId se user não tem tenantId | 🟢 | `tenant.ts:27` |

### Alunos

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-10 | Se a escola informada não existe no tenant, ela é criada automaticamente | 🟢 | `AlunoController.ts:34-48` |
| RN-11 | Se o responsável não existe (por CPF), é criado como user com role `responsavel`, email temporário e senha `temp_password` (NÃO hasheada) | 🟢 | `AlunoController.ts:112-127` |
| RN-12 | Responsável existente é validado: deve pertencer ao motorista E ao tenant | 🟢 | `AlunoController.ts:91-99` |
| RN-13 | Motorista vê apenas alunos com `status = 'ativo'`; responsável e admin veem todos | 🟢 | `AlunoModel.ts:74` |
| RN-14 | Aluno pode ter dois endereços distintos: contratante (obrigatório) e saída/embarque (opcional) | 🟢 | `AlunoController.ts:67-85` |
| RN-15 | `diasSemana` e `datasVencimento` armazenados como JSON string | 🟢 | `AlunoController.ts:145-146` |

### Financeiro

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-20 | Status do lançamento é auto-calculado na criação: `dataVencimento < hoje ? 'atrasado' : 'pendente'` | 🟢 | `FinanceiroController.ts:29` |
| RN-21 | Saldo geral considera apenas lançamentos com `status = 'pago'` | 🟢 | `FinanceiroController.ts:169` |
| RN-22 | Inadimplência = soma de receitas atrasadas / receitas do mês × 100 | 🟢 | `FinanceiroController.ts:190` |
| RN-23 | Recorrência (mensal, trimestral, semestral, anual) é armazenada como metadado mas NÃO materializada automaticamente | 🔴 | `LancamentoModel.ts:23-25` |

### Contratos

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-30 | Número do contrato: `CT-{ano}-{sequencial 3 dígitos}` baseado no COUNT total de contratos do tenant | 🟢 | `ContratoController.ts:25-29` |
| RN-31 | Toda mudança de estado gera um registro de log com ação, data e observações opcionais | 🟢 | `ContratoController.ts:52, 187, 216` |
| RN-32 | Relação N:N entre contrato e alunos via tabela `contrato_alunos` | 🟢 | `ContratoModel.ts:101-105` |
| RN-33 | Responsável pode assinar contrato (sem restrição de role na rota) — qualquer autenticado pode assinar | 🟢 | `contratos.routes.ts:18` |

### Rotas & Localização

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-40 | Pontos da rota são ordenados sequencialmente (campo `ordem`, atribuído no loop de criação) | 🟢 | `RotaController.ts:39` |
| RN-41 | Iniciar rota registra `horaInicio = now`; finalizar registra `horaFim = now` | 🟢 | `RotaController.ts:163, 191` |
| RN-42 | Responsável rastreia motorista via cadeia: `user.motoristaId → veículos → localização (último registro)` | 🟢 | `RotaController.ts:272-300` |
| RN-43 | Localização é append-only — nunca atualiza, sempre insere novo registro | 🟢 | `RotaModel.ts:158` |

### Notificações

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-50 | Tipo `todos` busca todos responsáveis do tenant e cria registro de destinatário para cada um | 🟢 | `NotificacaoController.ts:54-70` |
| RN-51 | `enviarAgora = true` → status `enviada`; `false` → status `agendada` | 🟢 | `NotificacaoController.ts:23` |
| RN-52 | Responsável vê notificações via JOIN com `notificacao_destinatarios` | 🟢 | `NotificacaoController.ts:94` |
| RN-53 | Gatilhos automáticos (faturamento, rota_inicio, etc.) previstos na DDL mas sem implementação | 🔴 | `migrate.ts:230` |

### Manutenção

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-60 | Veículo deve pertencer ao motorista autenticado E ao tenant | 🟢 | `ManutencaoController.ts:28-35` |
| RN-61 | Se `dataAgendada` → status `agendada`; senão → `realizada` com `dataRealizada = now` | 🟢 | `ManutencaoController.ts:37` |
| RN-62 | Repetição de manutenção (por km ou meses) é armazenada mas NÃO automatizada | 🔴 | `ManutencaoController.ts:53-54` |

### Upload

| # | Regra | Confiança | Fonte |
|---|-------|-----------|-------|
| RN-70 | Upload aceita arquivo único ou múltiplo | 🟢 | `UploadController.ts` |
| RN-71 | Storage é disco local (`backend/uploads/`), servido estaticamente em `/uploads` | 🟢 | `server.ts:25` |

---

## TODOs e Intenções Não Implementadas

| Local | Intenção | Impacto |
|-------|----------|---------|
| `AlunoModel.ts:199` | Implementar lógica de pagamento (status sempre `em_dia` hoje) | Alto — painel de inadimplência por aluno não funciona |
| `app/rotas.tsx:44,62` | Notificar responsáveis quando rota inicia/finaliza | Alto — feature de rastreamento incompleta |
| `app/perfil.tsx:360` | Navegar para tela de detalhes do aluno a partir do perfil | Baixo — UX |
| `app/manutencao.tsx:158` | Buscar veiculoId do motorista automaticamente | Médio — cadastro manual de manutenção |
| `app/index.tsx:84` | Implementar lógica de cobrança no dashboard | Alto — feature de cobrança não existe |

---

## Análise Git

| Dado | Valor |
|------|-------|
| Total de commits | 2 |
| Branches | 1 (main) |
| Observação | Projeto commitado em bloco (commit único com todo o código). Sem histórico granular para análise de ADRs retroativos. |

🟡 **Nota:** Com apenas 2 commits ("first commit" + "Projeto"), não há histórico suficiente para extrair decisões arquiteturais ou refatorações via Git.
