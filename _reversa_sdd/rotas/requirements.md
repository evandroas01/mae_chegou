# Rotas

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de gestão de rotas de transporte escolar com rastreamento GPS em tempo real. Controla o ciclo de vida da rota (não iniciada → em andamento → finalizada), pontos de parada ordenados e localização do veículo para acompanhamento por responsáveis.

## Responsabilidades
- Criar rotas com pontos de parada ordenados 🟢
- Iniciar e finalizar rotas (máquina de estados) 🟢
- Salvar coordenadas GPS do veículo (append-only) 🟢
- Fornecer última localização do veículo para responsáveis 🟢
- Registrar paradas (hora de chegada/saída) 🟢

## Regras de Negócio
- RN-40: Pontos ordenados sequencialmente (campo `ordem`, atribuído no loop) 🟢
- RN-41: Iniciar rota registra `horaInicio = now`; finalizar registra `horaFim = now` 🟢
- RN-42: Responsável rastreia via cadeia: `user.motoristaId → veículos → localização` 🟢
- RN-43: Localização append-only — nunca atualiza, sempre insere 🟢
- RN-44: Pontos de rota têm tipo: `casa`, `escola`, `retorno` 🟢
- RN-45: Parada registra hora de chegada/saída e flag notificacaoEnviada 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar rota com pontos ordenados | Must | Pontos com ordem sequencial |
| RF-02 | Iniciar rota (status → em_andamento) | Must | horaInicio registrada |
| RF-03 | Finalizar rota (status → finalizada) | Must | horaFim registrada |
| RF-04 | Salvar localização GPS do veículo | Must | Insert append-only |
| RF-05 | Buscar última localização do veículo | Must | Responsável pode rastrear |
| RF-06 | Localização do motorista pelo responsável | Must | Via cadeia user→veículos→GPS |

## Critérios de Aceitação

```gherkin
Cenário: Iniciar rota
  Dado uma rota com status "nao_iniciada"
  Quando enviar POST /:id/iniciar
  Então status deve ser "em_andamento" e horaInicio preenchida

Cenário: Rastreamento pelo responsável
  Dado um responsável vinculado a um motorista
  Quando acessar GET /api/rotas/localizacao-motorista
  Então deve retornar última localização do veículo do motorista

Cenário: Salvar localização GPS
  Dado um motorista com rota em andamento
  Quando enviar POST /api/rotas/localizacao com lat/lng
  Então coordenadas salvas com timestamp
```

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/RotaController.ts` | `RotaController` | 🟢 |
| `backend/src/models/RotaModel.ts` | `RotaModel` | 🟢 |
| `backend/src/routes/rotas.routes.ts` | Rotas | 🟢 |
| `app/rotas.tsx` | Tela de rotas | 🟢 |
| `app/localizacao.tsx` | Tela de rastreamento | 🟢 |
