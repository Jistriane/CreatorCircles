// Integração Wal.app + dApp Kit
import { useWalletKit } from '@mysten/wallet-kit';
import { WalletStandard } from '@wal/wallet-standard';
import { useEffect, useState } from 'react';

export function WalConnect() {
  const { wallets, currentWallet, connect, disconnect } = useWalletKit();
  const [walAccount, setWalAccount] = useState<any>(null);

  useEffect(() => {
    const initWal = async () => {
      const walAdapter = new WalletStandard({
        appName: 'CreatorCircles',
        appIcon: 'https://creatorcircles.io/logo.png',
      });
      // Registra adapter
    };
    initWal();
  }, []);

  const connectWallet = async () => {
    try {
      // Prioriza Wal.app se disponível
      const walWallet = wallets.find(w => w.name === 'Wal');
      if (walWallet) {
        await connect(walWallet.name);
      } else {
        // Fallback para Sui Wallet
        await connect(wallets[0].name);
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  return (
    <div className="wallet-connect">
      {!currentWallet ? (
        <button onClick={connectWallet} className="btn-primary">
          Conectar Carteira
        </button>
      ) : (
        <div className="wallet-info">
          <span>{currentWallet.accounts[0].address.slice(0, 6)}...</span>
          <button onClick={disconnect}>Desconectar</button>
        </div>
      )}
    </div>
  );
}
