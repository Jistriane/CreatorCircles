import { Request, Response, NextFunction } from 'express';

type UserInfo = { address: string };

// Middleware mock para validar sessão Wal
export default function authWalMock(req: Request, res: Response, next: NextFunction) {
  // Espera header x-wal-session com um token de sessão
  const session = req.headers['x-wal-session'] as string | undefined;
  if (!session) {
    // Para rotas públicas poderemos permitir sem sessão — aqui retornamos 401
    return res.status(401).json({ error: 'Wal session missing' });
  }

  // No MVP tratamos qualquer token não-vazio como válido e setamos req.user
  (req as Request & { user?: UserInfo }).user = { address: '0x' + session.slice(0, 8) };
  next();
}
