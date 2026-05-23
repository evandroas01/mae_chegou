# Upload

> Spec gerada pelo **Redator** do Reversa | Escala: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

## Visão Geral
Módulo utilitário de upload de arquivos via Multer. Suporta upload único e múltiplo com storage em disco local.

## Responsabilidades
- Upload de arquivo único 🟢
- Upload de múltiplos arquivos 🟢
- Servir arquivos estaticamente 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Upload único retorna URL, filename, size, mimetype | Must | Arquivo salvo |
| RF-02 | Upload múltiplo com array de arquivos | Should | Múltiplos salvos |

## Rastreabilidade de Código

| Arquivo | Cobertura |
|---------|-----------|
| `backend/src/controllers/UploadController.ts` | 🟢 |
| `backend/src/config/upload.ts` | 🟢 |
| `backend/src/routes/upload.routes.ts` | 🟢 |
