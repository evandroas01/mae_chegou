import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Criar diretório de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Criar subdiretório baseado no tipo de arquivo
    let subDir = 'general';
    if (file.fieldname === 'documento') {
      subDir = 'documentos';
    } else if (file.fieldname === 'anexo') {
      subDir = 'anexos';
    } else if (file.fieldname === 'foto') {
      subDir = 'fotos';
    }

    const dir = path.join(uploadDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens e documentos PDF/DOC são aceitos.'));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Helper para gerar URL do arquivo
export const getFileUrl = (filename: string, type: 'documento' | 'anexo' | 'foto' | 'general' = 'general'): string => {
  const subDir = type === 'documento' ? 'documentos' : type === 'anexo' ? 'anexos' : type === 'foto' ? 'fotos' : 'general';
  return `/uploads/${subDir}/${filename}`;
};

