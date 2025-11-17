import { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function applySecurity(app: Express) {
  // Basic HTTP headers
  app.use(helmet());

  // Rate limiter - gentle defaults for APIs
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use(limiter);
}
