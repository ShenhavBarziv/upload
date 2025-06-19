import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const app = express();
app.use(express.json());

const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

const uploadDir = path.join(__dirname, '../uploads');
const dataDir = path.join(__dirname, '../data');
[uploadDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: uploadDir,
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

export function setupRoutes(): void {
  app.get('/api/uploads', (_req: Request, res: Response) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(files);
    });
  });

  app.get('/api/downloads', (_req: Request, res: Response) => {
    fs.readdir(dataDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(files);
    });
  });

  app.get('/api/files/:filename', (req: Request, res: Response) => {
    const filePath = path.join(dataDir, req.params.filename);
    res.sendFile(filePath);
  });

  app.post('/api/upload', upload.array('files'), (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Uploaded' });
  });

  app.use('/uploads', express.static(uploadDir));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}
