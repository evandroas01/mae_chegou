# Chat — Design Técnico

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Interface
🔴 **Sem backend implementado.** Nenhum endpoint disponível.

## Frontend Existente
- `app/chat.tsx` (9KB) — tela com layout de chat, lista de conversas e input de mensagem 🟢
- Provavelmente usa dados mock ou estado local 🟡

## Decisões de Design Necessárias

| Decisão | Opções | Status |
|---------|--------|--------|
| Protocolo de comunicação | WebSocket (Socket.io) vs HTTP polling | 🔴 Pendente |
| Modelo de dados | Conversas + Mensagens vs Thread-based | 🔴 Pendente |
| Armazenamento | MySQL vs serviço externo (Firebase, etc.) | 🔴 Pendente |

## Riscos e Lacunas
- 🔴 Módulo inteiro não funcional — precisa de implementação completa
- 🔴 Sem modelo de dados definido para mensagens
- 🟡 Frontend pode precisar de refatoração significativa quando backend for implementado
