import { Router } from "express";
// MongoDB removido
import { validateBody } from '../middleware/validate.js';
import { createCircleSchema } from '../middleware/schemas.js';

const router = Router();

// Mock fallback when DB não está conectado (útil para testes locais sem Mongo)
const MOCK_CIRCLES = [
  { _id: 'dvc', name: 'Dev Circle', tokenSymbol: 'DVC', memberCount: 142, totalRevenueSUI: 710 }
];

// function dbConnected() {
//   return false;
// }


// Lista circles (mock)
router.get('/', (_req, res) => {
  res.json({ data: MOCK_CIRCLES });
});


// Buscar circle por id ou tokenSymbol
router.get('/:id', (req, res) => {
  const c = MOCK_CIRCLES.find(x => x._id === req.params.id || x.tokenSymbol === req.params.id);
  if (!c) return res.status(404).json({ error: "not found" });
  return res.json({ data: c });
});

export default router;


// Criar circle
router.post('/', validateBody(createCircleSchema), (req, res) => {
  const { name, tokenSymbol, benefits } = req.body as { name: string; tokenSymbol: string; benefits?: string[] };
  const mock = { _id: String(Date.now()), name, tokenSymbol, memberCount: 0, totalRevenueSUI: 0, benefits: benefits || [] };
  return res.status(201).json({ data: mock });
});


// Atualizar circle (mock)
router.patch('/:id', (req, res) => {
  return res.status(501).json({ error: 'not_implemented_without_db' });
});


// Remover circle (mock)
router.delete('/:id', (req, res) => {
  return res.status(501).json({ error: 'not_implemented_without_db' });
});
