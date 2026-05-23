# Contratos

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de gestão do ciclo de vida de contratos de transporte escolar. Gerencia criação com numeração automática, envio, assinatura e cancelamento. Mantém auditoria completa via log de ações e vincula alunos em relação N:N.

## Responsabilidades
- Criar contratos com número auto-gerado `CT-{ANO}-{SEQ}` 🟢
- Vincular múltiplos alunos por contrato (N:N) 🟢
- Gerenciar ciclo de vida: pendente → assinado / cancelado 🟢
- Manter log de auditoria em cada transição de estado 🟢
- Listar contratos filtrados por role do usuário 🟢

## Regras de Negócio
- RN-30: Número auto-gerado: `CT-{ano}-{sequencial 3 dígitos}` baseado no COUNT do tenant 🟢
- RN-31: Toda mudança de estado gera log com ação, data e observações 🟢
- RN-32: Relação N:N entre contrato e alunos via `contrato_alunos` 🟢
- RN-33: Qualquer autenticado pode assinar (sem restrição de role na rota) 🟢 🟡
- RN-34: Cancelamento aceita motivo opcional 🟢
- RN-35: Contrato assinado pode ser cancelado (sem guard de transição) 🟡

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar contrato com número auto e log `criado` | Must | Número CT-ANO-SEQ, log criado |
| RF-02 | Vincular alunos ao contrato (N:N) | Must | Registros em contrato_alunos |
| RF-03 | Assinar contrato | Must | Status → assinado, dataAssinatura, log |
| RF-04 | Cancelar contrato com motivo | Must | Status → cancelado, log com observações |
| RF-05 | Listar por role (responsável vê só seus) | Must | Filtragem via JOIN |
| RF-06 | Detalhar com alunos e logs | Should | Dados enriquecidos |

## Critérios de Aceitação

```gherkin
Cenário: Criar contrato gera número sequencial
  Dado um tenant com 5 contratos existentes
  Quando criar novo contrato
  Então número deve ser "CT-2026-006" e log "criado" registrado

Cenário: Assinar contrato pendente
  Dado um contrato com statusAssinatura "pendente"
  Quando enviar POST /:id/assinar
  Então statusAssinatura deve ser "assinado" e dataAssinatura preenchida

Cenário: Responsável vê apenas seus contratos
  Dado um responsável com 2 contratos dentre 10 do tenant
  Quando enviar GET /api/contratos
  Então deve retornar apenas os 2 contratos vinculados
```

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/ContratoController.ts` | `ContratoController` | 🟢 |
| `backend/src/models/ContratoModel.ts` | `ContratoModel` | 🟢 |
| `backend/src/routes/contratos.routes.ts` | Rotas | 🟢 |
| `backend/src/validators/contrato.validator.ts` | Validações | 🟢 |
| `app/contratos.tsx` | Tela | 🟢 |
