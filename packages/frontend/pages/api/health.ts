// Health check endpoint Next.js
import { NextApiRequest, NextApiResponse } from 'next';
import { SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({ url: process.env.SUI_RPC_URL! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const checks = {
    sui_rpc: false,
    ipfs_gateway: false,
    database: false,
  };

  try {
    // Check 1: Sui RPC
    const chainId = await client.getChainIdentifier();
    checks.sui_rpc = chainId !== null;

    // Check 2: IPFS Gateway
    const ipfsResponse = await fetch('https://gateway.pinata.cloud/ipfs/QmTest');
    checks.ipfs_gateway = ipfsResponse.ok;

    // Check 3: Database (se usar)
    // const dbPing = await db.ping();
    checks.database = true; // placeholder

    const allHealthy = Object.values(checks).every(status => status);

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error),
      checks,
    });
  }
}
