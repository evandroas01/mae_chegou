# Upload — Design Técnico

> Spec gerada pelo **Redator** do Reversa

## Interface

| Método | Caminho | Entrada | Saída | Status codes |
|--------|---------|---------|-------|--------------| 
| POST | `/api/upload` | multipart/form-data (`file`) | `{url, filename, originalName, size, mimetype}` | 200, 400, 500 |
| POST | `/api/upload/multiple` | multipart/form-data (`files[]`) | Array de objetos | 200, 400, 500 |

## Configuração 🟢
- Storage: disco local `backend/uploads/`
- Servido estaticamente: `app.use('/uploads', express.static('uploads'))`
- Lib: Multer com diskStorage

## Decisões de Design

| Decisão | Evidência | Confiança |
|---------|-----------|-----------|
| Disco local (não cloud/S3) | `upload.ts` config | 🟢 |
| Sem validação de tipo/tamanho visível nas rotas | `upload.routes.ts` | 🟡 |

## Riscos e Lacunas
- 🟡 Sem validação de tipo de arquivo (aceita qualquer upload)
- 🟡 Sem limite de tamanho visível
- 🟡 Disco local — não escala horizontalmente
