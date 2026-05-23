# Plano de Testes: Rastreamento da Van em Tempo Real

Este plano descreve o passo a passo para validar manualmente se a funcionalidade de rastreamento de van em tempo real está operando de acordo com as regras de negócio implementadas.

## 1. Preparação do Ambiente

Antes de iniciar os testes, garanta que os serviços estão rodando:

1. **Banco de Dados**: Certifique-se de que o container do MySQL está ativo (`docker-compose up -d` na raiz, se houver).
2. **Backend**: No terminal, vá até a pasta `backend/` e inicie o servidor:
   ```bash
   npm run dev
   ```
3. **Frontend**: Em outro terminal, vá até a raiz do projeto e inicie o Expo:
   ```bash
   npm start
   ```

> [!TIP]
> Você precisará de duas instâncias (ou dois aparelhos/emuladores) logadas em contas diferentes para testar o fluxo completo: uma logada como **Motorista** e outra como **Responsável**.

---

## 2. Teste do Lado do Motorista

Nesta etapa, validaremos se o motorista consegue compartilhar sua localização e se o sistema envia o sinal de vida (*heartbeat*) e notificações corretamente.

### Passo 2.1: Login e Acesso
- Faça login com uma conta de `motorista`.
- Verifique se no cabeçalho do `Dashboard` existe um *switch* indicando o status **Offline**.

### Passo 2.2: Ficar Online
- Clique no switch para ficar **Online**.
- **Validação de Interface**: O switch deve ficar verde e um card avisando "Rota disponível para responsáveis" deve aparecer.
- **Validação de Permissão**: Se for a primeira vez no aparelho, o aplicativo pedirá permissão de localização. Você deve aceitar.
- **Validação de Banco (Opcional)**: No banco de dados MySQL, a tabela `users` deve ter `statusOnline = 1` e `lastHeartbeat` atualizado para o motorista.
- **Validação de Notificação**: O sistema deve ter gerado uma notificação "Motorista Online" para os responsáveis vinculados (visível se você checar o banco na tabela `notificacoes` ou pelo endpoint).

### Passo 2.3: Ficar Offline
- Clique no switch para ficar **Offline**.
- **Validação de Interface**: O switch volta ao estado inativo e o card some.
- **Validação de Notificação**: O sistema deve ter gerado a notificação "Motorista Offline".

---

## 3. Teste do Lado do Responsável

Nesta etapa, validaremos a visão dos pais/responsáveis acompanhando o motorista.

### Passo 3.1: Validação do Status Offline
- Faça login com a conta de um `responsável` que tenha alunos ativos com o motorista do teste anterior.
- Navegue para a tela de **Localização**.
- **Validação de Interface**: A tela deve mostrar um card indicando **"Motorista Offline"**. O mapa *não* deve focar ou exibir o ícone da van.

### Passo 3.2: Validação do Status Online em Tempo Real
- No aparelho do motorista, ative o switch para **Online**.
- Espere até 10 segundos no aparelho do responsável (o aplicativo faz *polling* automático).
- **Validação de Interface**: O card no aparelho do responsável deve mudar sozinho para **"Motorista Online"**.
- O mapa deve mostrar o marcador da Van na localização atual do motorista.

### Passo 3.3: Atualização de Movimento (Heartbeat e Coordenadas)
- Com o motorista Online, mova o dispositivo (ou simule movimento no emulador).
- **Validação do Heartbeat**: Verifique se o backend está recebendo *requests* (visíveis nos logs do servidor Node) no endpoint `/api/rotas/localizacao`. O campo `lastHeartbeat` deve se renovar a cada chamada.
- No aparelho do responsável, o marcador da van deve pular e se mover no mapa.

### Passo 3.4: Validação do Heartbeat Expirado (Lazy Check)
- Simule uma "queda" do aplicativo do motorista (force o fechamento do app sem desmarcar o switch).
- Aguarde **mais de 5 minutos** (tempo do timeout do lazy check configurado no `RotaController`).
- No aparelho do responsável, navegue novamente para a tela de **Localização** (para forçar o GET).
- **Validação Lazy**: O backend deve perceber que o heartbeat é antigo (> 5 min), forçar o status para `statusOnline = false` e retornar o status offline para o responsável.

---

## 4. Testes de Casos de Borda (Edge Cases)

| Cenário | O que fazer | Resultado Esperado |
|---------|-------------|--------------------|
| **Permissão Recusada** | Como motorista, recusar permissão de localização do SO. | Ao tentar ficar online, recebe um `alert` e o switch volta imediatamente para offline. |
| **Responsável sem motorista** | Logar com responsável sem aluno matriculado com motorista. | Ao entrar na tela de localização, o backend deve devolver erro 404 de "Motorista não vinculado" e a tela exibe sem veículo. |
| **Dois logins na mesma conta** | O motorista já está online no celular e tenta ficar online via web/outro device simultaneamente. | O endpoint retorna 409 (Conflict) "Motorista já está online". |

> [!IMPORTANT]
> A funcionalidade de mapas (`react-native-maps`) não funciona bem no modo Web puro do Expo (ela exige bibliotecas específicas ou execução nativa). Sempre teste o motorista e o mapa num simulador Android/iOS ou utilizando o app Expo Go num aparelho físico.
