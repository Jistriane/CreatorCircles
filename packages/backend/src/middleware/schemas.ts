import { z } from 'zod';

export const authVerifySchema = z.object({
  sessionToken: z.string().min(1),
  userAddress: z.string().optional()
});

export const createCircleSchema = z.object({
  name: z.string().min(1),
  tokenSymbol: z.string().min(1),
  benefits: z.array(z.string()).optional()
});

export const userJoinSchema = z.object({
  wallet: z.string().min(1),
  circleSymbol: z.string().min(1),
  tokens: z.number().int().nonnegative().optional()
});
