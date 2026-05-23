# Perguntas para Validação Humana — cheguei_mae

> Gerado pelo **Revisor** do Reversa em 2026-05-18
> Apenas lacunas 🔴 que bloqueiam reimplementação (nível essencial)

---

## Q-01: Restrição de registro de usuários
**Unit:** `autenticacao`
**Contexto:** Atualmente qualquer pessoa pode criar conta com qualquer role (incluindo admin) via `POST /api/auth/register`, sem restrição.
**Pergunta:** O registro deve ser restrito? Se sim, qual modelo preferido?
- (a) Apenas admin cria contas
- (b) Convite por email
- (c) Registro público apenas como `responsavel` (motorista/admin criados manualmente)
- (d) Manter como está

**Resposta:** _____

---

## Q-02: Tratamento do responsável criado automaticamente
**Unit:** `alunos`
**Contexto:** Quando um motorista cadastra aluno com CPF de responsável inexistente, o sistema cria o responsável com email `{cpf}@temp.com` e senha `temp_password` em texto puro.
**Pergunta:** Qual o fluxo correto?
- (a) Criar com senha hasheada + forçar troca no primeiro login
- (b) Criar sem senha + enviar convite por email/SMS para o responsável definir senha
- (c) Outro: _____

**Resposta:** _____

---

## Q-03: Chat — escopo de implementação
**Unit:** `chat`
**Contexto:** A tela de chat existe no frontend (9KB) mas não há backend. É o módulo com menor confiança (14%).
**Pergunta:** O chat é prioritário para a próxima versão?
- (a) Sim, implementar com WebSocket (tempo real)
- (b) Sim, implementar com HTTP polling (mais simples)
- (c) Não, remover a tela por enquanto e implementar depois
- (d) Substituir por integração com WhatsApp Business API

**Resposta:** _____

---

## Q-04: Automações (cron jobs / schedulers)
**Unit:** `financeiro`, `manutencao`, `notificacoes`
**Contexto:** Três módulos armazenam metadados de automação mas não executam:
- Lançamentos vencidos não mudam para `atrasado` automaticamente
- Manutenções agendadas não mudam para `atrasada`
- Notificações agendadas nunca são enviadas
- Recorrência financeira não gera lançamentos filhos

**Pergunta:** Implementar automações é prioridade?
- (a) Sim, todas as 4 automações
- (b) Apenas status de vencimento (financeiro + manutenção)
- (c) Apenas scheduler de notificações
- (d) Nenhuma por enquanto

**Resposta:** _____

---

> Preencha as respostas acima e me avise quando terminar — basta digitar `reversa`.
