# Perfil

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Tela rica de perfil do usuário com múltiplas seções: dados pessoais, veículo, CNH, escolas, vagas e dados bancários. Reutiliza endpoints de `autenticacao` para dados básicos. Campos avançados sem tabelas dedicadas.

## Responsabilidades
- Exibir e editar dados pessoais (nome, email, telefone, CPF) 🟢
- Exibir dados do veículo e CNH 🟡
- Exibir dados bancários 🔴 Sem backend

## Regras de Negócio
- Reutiliza `GET /api/auth/me` e `PUT /api/auth/me` 🟢
- Campos avançados (CNH, banco, vagas) sem tabelas no banco 🔴

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Exibir/editar dados pessoais | Must | Via auth endpoints |
| RF-02 | Exibir dados do veículo | Should | 🔴 Sem endpoint dedicado |
| RF-03 | Exibir/editar CNH | Could | 🔴 Sem tabela |
| RF-04 | Exibir dados bancários | Could | 🔴 Sem tabela |

## Rastreabilidade de Código

| Arquivo | Cobertura |
|---------|-----------|
| `app/perfil.tsx` (23KB) | 🟢 Frontend rico |
| `backend/src/controllers/AuthController.ts` (me/update) | 🟢 Dados básicos |

## Lacunas Pendentes (🔴)
- Criar tabelas e endpoints para dados avançados (CNH, dados bancários, vagas)
- Integrar com módulo de upload para foto de perfil
