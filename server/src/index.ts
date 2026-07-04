import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
import path from 'path';
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to measure Processing Time
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const processingTimeInMs = (diff[0] * 1e3 + diff[1] * 1e-6);
    // console.log(`Processing time for ${req.method} ${req.url}: ${processingTimeInMs} ms`);
  });

  // Also add a header so the client can read the processing time (useful for the load test script)
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    const diff = process.hrtime(start);
    const processingTimeInMs = (diff[0] * 1e3 + diff[1] * 1e-6);
    res.setHeader('X-Processing-Time', processingTimeInMs.toString());
    return originalSend(body);
  };
  
  next();
});

// Aeronaves
app.get('/api/aeronaves', asyncHandler(async (req, res) => {
  const data = await prisma.aeronave.findMany();
  res.json(data);
}));
app.post('/api/aeronaves', asyncHandler(async (req, res) => {
  const data = await prisma.aeronave.create({ data: req.body });
  res.json(data);
}));

// Estoque
app.get('/api/estoque', asyncHandler(async (req, res) => {
  const data = await prisma.estoque.findMany();
  res.json(data);
}));
app.post('/api/estoque', asyncHandler(async (req, res) => {
  const data = await prisma.estoque.create({ data: req.body });
  res.json(data);
}));

// Funcionarios
app.get('/api/funcionarios', asyncHandler(async (req, res) => {
  const data = await prisma.funcionario.findMany();
  res.json(data);
}));
app.post('/api/funcionarios', asyncHandler(async (req, res) => {
  const data = await prisma.funcionario.create({ data: req.body });
  res.json(data);
}));

// Etapas
app.get('/api/etapas', asyncHandler(async (req, res) => {
  const data = await prisma.etapa.findMany({ include: { funcionario: true } });
  res.json(data);
}));
app.post('/api/etapas', asyncHandler(async (req, res) => {
  const data = await prisma.etapa.create({ data: req.body });
  res.json(data);
}));

// Testes
app.get('/api/testes', asyncHandler(async (req, res) => {
  const data = await prisma.teste.findMany({ include: { aeronave: true } });
  res.json(data);
}));
app.post('/api/testes', asyncHandler(async (req, res) => {
  const data = await prisma.teste.create({ data: req.body });
  res.json(data);
}));

// Aeronaves DELETE & PUT
app.delete('/api/aeronaves/:id', asyncHandler(async (req, res) => {
  await prisma.aeronave.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));
app.put('/api/aeronaves/:id', asyncHandler(async (req, res) => {
  const data = await prisma.aeronave.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(data);
}));

// Estoque DELETE & PUT
app.delete('/api/estoque/:id', asyncHandler(async (req, res) => {
  await prisma.estoque.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));
app.put('/api/estoque/:id', asyncHandler(async (req, res) => {
  const data = await prisma.estoque.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(data);
}));

// Funcionarios DELETE & PUT
app.delete('/api/funcionarios/:id', asyncHandler(async (req, res) => {
  await prisma.funcionario.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));
app.put('/api/funcionarios/:id', asyncHandler(async (req, res) => {
  const data = await prisma.funcionario.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(data);
}));

// Etapas DELETE & PUT
app.delete('/api/etapas/:id', asyncHandler(async (req, res) => {
  await prisma.etapa.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));
app.put('/api/etapas/:id', asyncHandler(async (req, res) => {
  const data = await prisma.etapa.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(data);
}));

// Testes DELETE & PUT
app.delete('/api/testes/:id', asyncHandler(async (req, res) => {
  await prisma.teste.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));
app.put('/api/testes/:id', asyncHandler(async (req, res) => {
  const data = await prisma.teste.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(data);
}));

// SPA Fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Middleware de tratamento de erro global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro capturado pelo middleware global:", err);
  res.status(500).json({
    error: true,
    message: err.message || 'Erro interno do servidor.'
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
