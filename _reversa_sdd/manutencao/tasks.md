# Manutenção — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Pré-requisitos
- [ ] Tabelas `manutencoes`, `veiculos`, `documento_veiculos` criadas
- [ ] Módulo `autenticacao` implementado

## Tarefas

- [ ] T-01: Implementar `VeiculoModel` (CRUD + documentos)
  - Origem: `backend/src/models/VeiculoModel.ts:1-180`
  - Critério de pronto: CRUD veículos, CRUD documentos, findByMotorista
  - Confiança: 🟢

- [ ] T-02: Implementar validação de propriedade do veículo
  - Origem: `backend/src/controllers/ManutencaoController.ts:28-35`
  - Critério de pronto: Rejeita se veículo não pertence ao motorista+tenant
  - Confiança: 🟢

- [ ] T-03: Implementar lógica de status automático
  - Origem: `backend/src/controllers/ManutencaoController.ts:37-45`
  - Critério de pronto: dataAgendada → agendada; sem → realizada + dataRealizada=now
  - Confiança: 🟢

- [ ] T-04: Implementar controller, validadores e rotas
  - Origem: `ManutencaoController.ts`, `manutencoes.routes.ts`
  - Critério de pronto: CRUD + endpoint veículos
  - Confiança: 🟢

- [ ] T-05: Implementar tela frontend
  - Origem: `app/manutencao.tsx`
  - Critério de pronto: Listagem com status, criação, seleção de veículo
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste criação com dataAgendada → status agendada
- [ ] TT-02: Teste criação sem dataAgendada → status realizada + dataRealizada
- [ ] TT-03: Teste veículo de outro motorista → rejeição

## Ordem Sugerida
1. T-01 → T-02 → T-03 → T-04 → T-05

## Lacunas Pendentes (🔴)
- Implementar job/cron para marcar agendadas atrasadas
- Implementar alertas de vencimento de documentos do veículo
