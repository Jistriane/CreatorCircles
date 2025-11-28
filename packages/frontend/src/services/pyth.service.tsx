// Busca preço SUI/USD via HTTP diretamente da API pública do Pyth
export async function getSuiPrice(): Promise<number> {
  try {
    // ID do feed SUI/USD
    const priceId = '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744';
    const url = `https://hermes.pyth.network/api/latest_price_feeds?ids[]=${priceId}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data[0] && data[0].price) {
      const price = data[0].price.price;
      const expo = data[0].price.expo;
      return price * Math.pow(10, expo);
    }
    return 0;
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
