import { Router } from 'express';
// MongoDB removido
import { validateBody } from '../middleware/validate.js';
import { userJoinSchema } from '../middleware/schemas.js';

const router = Router();

type MockUser = {
  wallet: string;
  circlesJoined: Array<{ symbol: string; tokens: number; joinDate: Date }>;
  nftAccess: unknown[];
};

const MOCK_USERS: MockUser[] = [];

// function dbConnected() {
//   return false;
// }


// Buscar usuário por wallet (mock)
router.get('/:wallet', (req, res) => {
  const wallet = req.params.wallet;
  const u = MOCK_USERS.find(x => x.wallet === wallet);
  if (!u) return res.status(404).json({ error: 'not_found' });
  return res.json({ data: u });
});


// Entrar em um círculo (mock)
router.post('/join', validateBody(userJoinSchema), (req, res) => {
  const { wallet, circleSymbol, tokens } = req.body as { wallet: string; circleSymbol: string; tokens?: number };
  if (!wallet || !circleSymbol) return res.status(400).json({ error: 'invalid_payload' });
  let u = MOCK_USERS.find(x => x.wallet === wallet);
  if (!u) {
    u = { wallet, circlesJoined: [{ symbol: circleSymbol, tokens: tokens || 0, joinDate: new Date() }], nftAccess: [] };
    MOCK_USERS.push(u);
  } else {
    u.circlesJoined.push({ symbol: circleSymbol, tokens: tokens || 0, joinDate: new Date() });
  }
  return res.status(200).json({ data: u });
});

export default router;
