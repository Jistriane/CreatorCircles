// Hook para criar círculo via PTB (Programmable Transaction Block)
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { useNetworkVariable } from '../config/sui.config';

export function useCreateCircle() {
  const client = useSuiClient();
  const packageId = useNetworkVariable('packageId');
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

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
    // Transfere AdminCap para criador
    tx.transferObjects([tx.objectRef('0x...adminCap')], tx.pure(tx.sender));
    try {
      const result = await signAndExecute(
        { transactionBlock: tx },
        {
          onSuccess: (result) => {
            console.log('Círculo criado:', result.digest);
            // Indexa evento via GraphQL
          },
          onError: (error) => {
            console.error('Erro:', error);
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  return { createCircle };
}
