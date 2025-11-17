import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'invalid_payload', details: result.error.format() });
    }
  // replace body with parsed data (narrowed)
  (req as Request & { body: unknown }).body = result.data;
    next();
  };
}
