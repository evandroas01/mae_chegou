# Upload — Tarefas de Implementação

> Spec gerada pelo **Redator** do Reversa

## Tarefas

- [ ] T-01: Implementar config Multer com diskStorage
  - Origem: `backend/src/config/upload.ts`
  - Confiança: 🟢

- [ ] T-02: Implementar UploadController (single + multiple)
  - Origem: `backend/src/controllers/UploadController.ts`
  - Confiança: 🟢

- [ ] T-03: Implementar rotas e servir estático
  - Origem: `backend/src/routes/upload.routes.ts`, `server.ts:25`
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01: Teste upload único retorna metadata correta
- [ ] TT-02: Teste upload múltiplo retorna array

## Lacunas Pendentes (🔴)
- Adicionar validação de tipo de arquivo (whitelist)
- Adicionar limite de tamanho (ex: 10MB)
- Considerar migração para cloud storage (S3/GCS) para produção
