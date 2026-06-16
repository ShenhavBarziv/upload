import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const app = express();
app.use(express.json());

const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

export const uploadDir = path.join(__dirname, '../uploads');
export const dataDir = path.join(__dirname, '../data');
[uploadDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function listRegularFiles(dir: string, res: Response): void {
  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(entries.filter((entry) => entry.isFile()).map((entry) => entry.name));
  });
}

function resolveSafeFile(baseDir: string, filename: string): string | null {
  if (filename !== path.basename(filename)) {
    return null;
  }

  const resolvedBase = path.resolve(baseDir);
  const candidate = path.resolve(resolvedBase, filename);
  const relative = path.relative(resolvedBase, candidate);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  try {
    const stats = fs.lstatSync(candidate);
    if (!stats.isFile() || stats.isSymbolicLink()) {
      return null;
    }
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return null;
    }
    throw err;
  }

  return candidate;
}

function sendSafeFile(baseDir: string, filename: string, res: Response): void {
  let filePath: string | null;

  try {
    filePath = resolveSafeFile(baseDir, filename);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return;
  }

  if (!filePath) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.sendFile(filePath);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

export function setupRoutes(): void {
  app.get('/api/uploads', (_req: Request, res: Response) => {
    listRegularFiles(uploadDir, res);
  });

  app.get('/api/downloads', (_req: Request, res: Response) => {
    listRegularFiles(dataDir, res);
  });

  app.get('/api/files/:filename', (req: Request, res: Response) => {
    sendSafeFile(dataDir, req.params.filename, res);
  });

  app.post('/api/upload', upload.array('files'), (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Uploaded' });
  });

  app.get('/uploads/:filename', (req: Request, res: Response) => {
    sendSafeFile(uploadDir, req.params.filename, res);
  });

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}
