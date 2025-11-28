// Integração Pyth Oracle para preço SUI
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';

const pythClient = new PythHttpClient(
  'https://hermes.pyth.network',
  getPythProgramKeyForCluster('pythnet')
);

export async function getSuiPrice(): Promise<number> {
  try {
    // Price feed ID do SUI/USD
    const priceIds = [
      '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744', // SUI/USD
    ];
    const priceData = await pythClient.getLatestPriceFeeds(priceIds);
    const suiPrice = priceData[0].getPriceUnchecked();
    return suiPrice.price * Math.pow(10, suiPrice.expo);
  } catch (error) {
    console.error('Erro ao buscar preço SUI:', error);
    return 0;
  }
}

// Componente de exibição
import { useEffect, useState } from 'react';
export function PriceDisplay() {
  const [suiPrice, setSuiPrice] = useState(0);
  useEffect(() => {
    const interval = setInterval(async () => {
      const price = await getSuiPrice();
      setSuiPrice(price);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="price-ticker">
      💰 SUI: {suiPrice.toFixed(4)}
    </div>
  );
}
