# Manutenção

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo de agendamento e controle de manutenções preventivas e corretivas dos veículos de transporte escolar. Inclui gestão de veículos e documentos associados (licenciamento, seguro, vistoria).

## Responsabilidades
- Criar manutenções (agendada ou já realizada) 🟢
- Listar manutenções com dados do veículo (placa, modelo) 🟢
- Validar que veículo pertence ao motorista autenticado 🟢
- Listar veículos do motorista 🟢
- Atualizar status da manutenção 🟢

## Regras de Negócio
- RN-60: Veículo validado: pertence ao motorista + tenant 🟢
- RN-61: Se `dataAgendada` → status `agendada`; sem → `realizada` com `dataRealizada = now` 🟢
- RN-62: Repetição (km/meses) armazenada mas NÃO automatizada 🔴
- RN-63: Tipos: preventiva, corretiva 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criar manutenção com status automático | Must | Agendada ou realizada baseado em dataAgendada |
| RF-02 | Validar propriedade do veículo | Must | Rejeitar se veículo não pertence ao motorista |
| RF-03 | Listar com dados do veículo | Must | JOIN com veículos para placa/modelo |
| RF-04 | Listar veículos do motorista | Should | Shortcut para seleção de veículo |

## Critérios de Aceitação

```gherkin
Cenário: Criar manutenção agendada
  Dado um motorista com veículo cadastrado
  Quando enviar POST com dataAgendada futura
  Então status deve ser "agendada"

Cenário: Criar manutenção já realizada
  Dado um motorista com veículo
  Quando enviar POST sem dataAgendada
  Então status deve ser "realizada" e dataRealizada = now

Cenário: Veículo de outro motorista
  Dado um veiculoId que pertence a outro motorista
  Quando enviar POST
  Então deve retornar 403 ou 404
```

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `backend/src/controllers/ManutencaoController.ts` | `ManutencaoController` | 🟢 |
| `backend/src/models/VeiculoModel.ts` | `VeiculoModel` | 🟢 |
| `backend/src/routes/manutencoes.routes.ts` | Rotas | 🟢 |
| `app/manutencao.tsx` | Tela | 🟢 |
