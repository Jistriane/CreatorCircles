// Hook para criar círculo via PTB (Programmable Transaction Block)
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useNetworkVariable } from '../config/sui.config';

export function useCreateCircle() {
  // ...existing code...
  const packageId = useNetworkVariable('packageId');
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const createCircle = async (params: {
    name: string;
    symbol: string;
    description: string;
    entryPrice: number;
    maxMembers: number;
  }) => {
    const tx = new TransactionBlock();
    const entryPriceInMist = params.entryPrice * 1_000_000_000;
    tx.moveCall({
      target: `${packageId}::circle_core::create_circle`,
      arguments: [
        tx.pure(Array.from(new TextEncoder().encode(params.name))),
        tx.pure(Array.from(new TextEncoder().encode(params.symbol))),
        tx.pure(Array.from(new TextEncoder().encode(params.description))),
        tx.pure(Array.from(new TextEncoder().encode('https://ipfs.io/...'))),
        tx.pure(entryPriceInMist),
        tx.pure(params.maxMembers),
      ],
    });
    // ...existing code...
    const txBytes = await tx.build();
    const txBase64 = Buffer.from(txBytes).toString('base64');
    const result = await signAndExecute(
      { transaction: txBase64 },
      {
        onSuccess: (result: any) => {
          console.log('Círculo criado:', result.digest);
          // Indexa evento via GraphQL
        },
        onError: (error: any) => {
          console.error('Erro:', error);
        },
      }
    );
    return result;
  };

  return { createCircle };
}
