// Integração Pyth Oracle para preço SUI

import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://hermes.pyth.network');
const pythPublicKey = getPythProgramKeyForCluster('pythnet');
const pythClient = new PythHttpClient(connection, pythPublicKey);


export async function getSuiPrice(): Promise<number> {
  try {
    // Price feed ID do SUI/USD
    const data = await pythClient.getData();
    for (let symbol of data.symbols) {
      if (symbol === 'Crypto.SUI/USD') {
        const price = data.productPrice.get(symbol);
        if (price) {
          return price.price ?? 0;
        }
      }
    }
    return 0;
  } catch (error) {
    console.error('Erro ao buscar preço SUI:', error);
    return 0;
  }
}

// Componente de exibição

import React, { useEffect, useState } from 'react';
export function PriceDisplay() {
  const [suiPrice, setSuiPrice] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(async () => {
      const price = await getSuiPrice();
      setSuiPrice(price);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return React.createElement('div', { className: 'price-ticker' }, `💰 SUI: ${suiPrice.toFixed(4)}`);
}
