# Perfil — Design Técnico

> Spec gerada pelo **Redator** do Reversa

## Interface
Reutiliza endpoints do módulo `autenticacao`:
- `GET /api/auth/me` — dados básicos 🟢
- `PUT /api/auth/me` — atualização parcial 🟢

🔴 Sem endpoints dedicados para CNH, dados bancários, vagas ou escolas do perfil.

## Frontend
- Tela `app/perfil.tsx` (23KB) com seções: dados pessoais, veículo, CNH, escolas, alunos, dados bancários 🟢
- Múltiplas seções renderizadas condicionalmente por role 🟡

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Reuso de auth endpoints para dados básicos | `perfil.tsx` consome `/auth/me` | 🟢 |
| Seções avançadas provavelmente com dados mock | `perfil.tsx:250+` | 🟡 |

## Riscos e Lacunas
- 🔴 Dados avançados do perfil sem persistência (CNH, banco, vagas)
- 🟡 Tela grande (23KB) pode precisar decomposição em componentes
