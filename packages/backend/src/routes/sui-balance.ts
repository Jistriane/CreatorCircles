import { Router } from "express";

const router = Router();

// Mock: retorna saldo SUI do usuário
router.get('/', (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'address obrigatório' });
  // Retorno mock
  res.json({ address, balance: 123.45 });
});

export default router;
