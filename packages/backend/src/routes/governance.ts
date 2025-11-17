import { Router } from "express";
// MongoDB removido

const router = Router();

// Listar propostas (mock)
const MOCK_PROPOSALS: any[] = [];
router.get('/', (_req, res) => {
  res.json({ data: MOCK_PROPOSALS });
});

// Criar nova proposta (mock)
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });
  const proposal = { _id: String(Date.now()), title, votes: 0 };
  MOCK_PROPOSALS.push(proposal);
  res.json({ success: true, proposal });
});

// Votar em proposta (mock)
router.post('/vote', (req, res) => {
  const { proposalId } = req.body;
  if (!proposalId) return res.status(400).json({ error: 'ID obrigatório' });
  const proposal = MOCK_PROPOSALS.find(p => p._id === proposalId);
  if (!proposal) return res.status(404).json({ error: 'Proposta não encontrada' });
  proposal.votes += 1;
  res.json({ success: true, proposal });
});

export default router;
