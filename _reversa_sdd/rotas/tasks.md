# Rotas — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Pré-requisitos
- [ ] Tabelas `rotas`, `ponto_rotas`, `parada_rotas`, `localizacao_veiculos` criadas
- [ ] Módulos `autenticacao` e `manutencao` (VeiculoModel) implementados

## Tarefas

- [ ] T-01: Implementar `RotaModel` (CRUD + pontos + paradas + localização)
  - Origem: `backend/src/models/RotaModel.ts:1-200`
  - Critério de pronto: create com pontos, findAll, findById (JOINs), iniciar, finalizar, saveLocalizacao, getLocalizacao
  - Confiança: 🟢

- [ ] T-02: Implementar máquina de estados (iniciar/finalizar)
  - Origem: `backend/src/controllers/RotaController.ts:155-200`
  - Critério de pronto: nao_iniciada→em_andamento→finalizada, registra horas
  - Confiança: 🟢

- [ ] T-03: Implementar endpoint de localização GPS (save + get)
  - Origem: `backend/src/controllers/RotaController.ts:202-260`
  - Critério de pronto: INSERT append-only, GET última localização por veiculoId
  - Confiança: 🟢

- [ ] T-04: Implementar rastreamento pelo responsável
  - Origem: `backend/src/controllers/RotaController.ts:262-314`
  - Critério de pronto: Cadeia user→motoristaId→veículos→localização funcional
  - Confiança: 🟢

- [ ] T-05: Implementar controller, validadores e rotas
  - Origem: `RotaController.ts`, `rotas.routes.ts`
  - Critério de pronto: Todos os endpoints funcionais
  - Confiança: 🟢

- [ ] T-06: Implementar telas frontend (rotas + localização)
  - Origem: `app/rotas.tsx`, `app/localizacao.tsx`
  - Critério de pronto: Lista de rotas, mapa com rastreamento
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste ciclo completo: criar → iniciar → finalizar
- [ ] TT-02: Teste save + get localização GPS
- [ ] TT-03: Teste rastreamento pelo responsável via cadeia de tabelas

## Ordem Sugerida
1. T-01 → T-02 → T-03 → T-04 → T-05 → T-06

## Lacunas Pendentes (🔴)
- Adicionar validação de transição de estado
- Implementar notificação de responsáveis ao iniciar/finalizar rota
- Considerar WebSocket para localização em tempo real (ao invés de polling)
- Implementar política de retenção para dados de localização
