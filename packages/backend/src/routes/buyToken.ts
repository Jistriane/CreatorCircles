import { Router } from "express";
// MongoDB removido

const router = Router();



// Registra compra de token para um círculo (mock)
router.post('/', (req, res) => {
  const { circleId, userId } = req.body;
  if (!circleId) return res.status(400).json({ success: false, error: 'circleId obrigatório' });
  // Retorno mock
  const purchase = { _id: String(Date.now()), circleId, userId, createdAt: new Date().toISOString() };
  res.json({ success: true, purchase });
});

export default router;
