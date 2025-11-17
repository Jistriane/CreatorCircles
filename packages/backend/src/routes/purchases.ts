import { Router } from "express";
// MongoDB removido

const router = Router();


// Lista compras do usuário (mock)
router.get('/', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
  // Retorno mock
  res.json({ data: [
    { _id: 'p1', userId, circleId: '1', amount: 10, createdAt: new Date().toISOString() },
    { _id: 'p2', userId, circleId: '2', amount: 5, createdAt: new Date().toISOString() }
  ] });
});

export default router;
