import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { validateBody } from '../middleware/validate.js';
import { authVerifySchema } from '../middleware/schemas.js';

dotenv.config();

const router = Router();

// Endpoint /auth/verify
// Body: { sessionToken: string, userAddress?: string }
// Behavior:
// - If FEATURE_WAL is 'false' or WAL_CLIENT_KEY is not set, accept any non-empty sessionToken (dev mode)
// - If FEATURE_WAL is 'true' and WAL_VERIFY_URL is set, attempt to verify against Wal (placeholder)
// - Otherwise, compare sessionToken === WAL_CLIENT_KEY as a simple validator
router.post('/verify', validateBody(authVerifySchema), async (req: Request, res: Response) => {
  const { sessionToken, userAddress } = req.body as { sessionToken: string; userAddress?: string };
  if (!sessionToken) return res.status(400).json({ ok: false, error: 'missing_sessionToken' });

  const featureWal = (process.env.FEATURE_WAL || 'true') === 'true';
  const walClientKey = process.env.WAL_CLIENT_KEY;
  const walApiUrl = process.env.WAL_API_URL || process.env.WAL_VERIFY_URL; // support older name

  // Dev-friendly: if WAL feature is off or no WAL config available, accept token as valid
  if (!featureWal || (!walClientKey && !walApiUrl)) {
    return res.json({ ok: true, valid: true, address: userAddress || ('0x' + sessionToken.slice(0, 8)) });
  }

  // If WAL API URL is configured, attempt server-side verification
  if (walApiUrl) {
    try {
  // Node 18+ provides global fetch
  const resp = await fetch(walApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wal-app-id': process.env.WAL_APP_ID || '',
          'x-wal-secret': process.env.WAL_SECRET || ''
        },
        body: JSON.stringify({ sessionToken })
      });

      if (!resp || !resp.ok) return res.status(401).json({ ok: false, valid: false, error: 'invalid_session' });
      const data = await resp.json();
      return res.json({ ok: true, valid: true, address: data.userAddress || userAddress });
    } catch (e) {
      // WAL endpoint unreachable or failed
      // log the error for diagnostics and return 502
      // eslint-disable-next-line no-console
      console.error(e);
      return res.status(502).json({ ok: false, error: 'wal_unreachable' });
    }
  }

  // Fallback: compare sessionToken against a configured client key
  if (walClientKey && sessionToken === walClientKey) return res.json({ ok: true, valid: true, address: userAddress || ('0x' + sessionToken.slice(0, 8)) });

  return res.status(401).json({ ok: false, valid: false, error: 'invalid_session' });
});

export default router;
