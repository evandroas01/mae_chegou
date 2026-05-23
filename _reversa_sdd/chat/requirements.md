# Chat

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de comunicação em tempo real entre motorista e responsável. **Existe apenas no frontend** — sem backend implementado.

## Responsabilidades
- Tela de chat motorista ↔ responsável 🟡
- Envio e recebimento de mensagens 🔴 Sem backend

## Regras de Negócio
- 🔴 Nenhuma regra confirmada — módulo não funcional

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Interface de chat com lista de conversas | Should | Tela funcional |
| RF-02 | Envio/recebimento de mensagens | Must | Backend implementado |
| RF-03 | Histórico de mensagens | Should | Persistência no banco |

## Rastreabilidade de Código

| Arquivo | Cobertura |
|---------|-----------|
| `app/chat.tsx` (9KB) | 🔴 Frontend-only, sem backend |

## Lacunas Pendentes (🔴)
- Implementar backend completo (controller, model, rotas, tabela de mensagens)
- Decidir protocolo: WebSocket (real-time) vs polling HTTP
- Definir modelo de dados: conversas, mensagens, status de leitura
