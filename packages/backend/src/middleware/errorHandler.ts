import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

export function errorHandler(err: unknown, _req: Request, res: Response, _next?: NextFunction) {
  // reference _next to satisfy lint rules about unused vars
  void _next;
  // Send to Sentry if configured
  if (process.env.SENTRY_DSN) {
    try {
      Sentry.captureException(err as Error);
    } catch {
      // ignore
    }
  }

  const maybeError = err as { status?: number; message?: string; stack?: string } | undefined;
  const status = maybeError && maybeError.status ? maybeError.status : 500;
  const message = maybeError && maybeError.message ? maybeError.message : 'internal_error';
  // In prod, avoid exposing stack
  const payload: Record<string, unknown> = { error: message };
  if (process.env.NODE_ENV !== 'production' && maybeError && maybeError.stack) payload.stack = maybeError.stack;

  res.status(status).json(payload);
}
