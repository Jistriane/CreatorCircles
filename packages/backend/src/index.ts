import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
import cors from "cors";
import express from "express";
import * as Sentry from '@sentry/node';
import circlesRouter from "./routes/circles.js";
import { validateEnv, getPort } from "./config.js";
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import buyTokenRouter from './routes/buyToken.js';
import purchasesRouter from './routes/purchases.js';
import governanceRouter from './routes/governance.js';
import { errorHandler } from './middleware/errorHandler.js';
import { applySecurity } from './middleware/security.js';
import logger from './logger.js';
import healthRouter from './routes/health.js';
import suiBalanceRouter from './routes/sui-balance.js';

// Valida variáveis de ambiente no startup (fail-fast)
validateEnv();
logger.info('Backend CreatorCircles inicializado');


const app = express();
app.use(cors());
app.use(express.json());
import metricsRouter from './routes/metrics.js';
app.use('/metrics', metricsRouter);

// Initialize Sentry if DSN provided
if (process.env.SENTRY_DSN) {
 Sentry.init({ dsn: process.env.SENTRY_DSN });
 // request handler must be the first middleware
 // @ts-expect-error - Sentry types are dynamic for this lightweight init
 app.use(Sentry.Handlers.requestHandler());
}

// Apply security middlewares (helmet, rate limit)
applySecurity(app);

app.use("/health", healthRouter);
app.use("/api/circles", circlesRouter);
app.use('/api/users', usersRouter);
app.use('/auth', authRouter);
app.use('/api/buy-token', buyTokenRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/governance', governanceRouter);
app.use('/api/sui-balance', suiBalanceRouter);

// Sentry error handler (must be before our error handler)
if (process.env.SENTRY_DSN) {
 // @ts-expect-error - lightweight call
 app.use(Sentry.Handlers.errorHandler());
}

// global error handler
app.use(errorHandler);
// export default app; // Removido para compatibilidade ES module

export default app;
