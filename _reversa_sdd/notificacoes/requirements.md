# Notificações

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de envio de notificações de motoristas para responsáveis, com suporte a broadcast (todos) ou destinatários específicos. Inclui agendamento e marcação de leitura por destinatário.

## Responsabilidades
- Criar notificações (individuais ou broadcast) 🟢
- Suportar envio imediato ou agendado 🟢
- Listar notificações filtradas por role 🟢
- Marcar notificação como lida (por destinatário) 🟢
- Listar responsáveis disponíveis para seleção 🟢

## Regras de Negócio
- RN-50: Tipo `todos` cria registro de destinatário para cada responsável do tenant 🟢
- RN-51: `enviarAgora = true` → status `enviada`; `false` → `agendada` 🟢
- RN-52: Responsável vê notificações via JOIN com destinatários 🟢
- RN-53: Gatilhos automáticos previstos na DDL mas NÃO implementados 🔴

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar notificação (especifica ou todos) | Must | Destinatários criados |
| RF-02 | Envio imediato ou agendado | Must | Status correto |
| RF-03 | Listar filtradas por role | Must | Responsável vê só as suas |
| RF-04 | Marcar como lida | Must | lida=true, dataLeitura |
| RF-05 | Listar responsáveis disponíveis | Should | Apenas motorista acessa |

## Critérios de Aceitação

```gherkin
Cenário: Notificação broadcast
  Dado um tenant com 5 responsáveis
  Quando enviar POST com tipo "todos" e enviarAgora=true
  Então 5 registros em notificacao_destinatarios e status "enviada"

Cenário: Marcar como lida
  Dado uma notificação destinada ao responsável
  Quando enviar POST /:id/marcar-lida
  Então lida=true e dataLeitura preenchida
```

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/NotificacaoController.ts` | `NotificacaoController` | 🟢 |
| `backend/src/routes/notificacoes.routes.ts` | Rotas | 🟢 |
| `app/notificacoes.tsx` | Tela | 🟢 |
