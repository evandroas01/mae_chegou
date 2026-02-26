import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getFileUrl } from '../config/upload';
import path from 'path';

export class UploadController {
  static async uploadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado' });
        return;
      }

      const fileType = req.body.type || 'general';
      const url = getFileUrl(req.file.filename, fileType as any);

      res.json({
        url,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
    }
  }

  static async uploadMultiple(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ error: 'Nenhum arquivo enviado' });
        return;
      }

      const files = Array.isArray(req.files) ? req.files : [req.files];
      const fileType = req.body.type || 'general';

      const uploadedFiles = files.map((file: Express.Multer.File) => ({
        url: getFileUrl(file.filename, fileType as any),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.json({
        files: uploadedFiles,
      });
    } catch (error) {
      console.error('Erro no upload múltiplo:', error);
      res.status(500).json({ error: 'Erro ao fazer upload dos arquivos' });
    }
  }
}

