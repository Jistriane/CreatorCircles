import { useEffect, useState } from 'react';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [diagnostic, setDiagnostic] = useState<string>('');

  // Detecta apenas SlushWallet
  function detectSlushWallet() {
    if (typeof window !== 'undefined' && (window as any).slushWallet) {
      setWallet((window as any).slushWallet);
      setDiagnostic('✅ SlushWallet detectada!');
    } else {
      setWallet(null);
      setDiagnostic('❌ SlushWallet não encontrada. Instale a extensão SlushWallet.');
    }
  }

  useEffect(() => {
    detectSlushWallet();
    // Opcional: re-detectar ao focar a janela
    window.addEventListener('focus', detectSlushWallet);
    return () => window.removeEventListener('focus', detectSlushWallet);
  }, []);

  async function connect() {
    if (!wallet) {
      alert('SlushWallet não encontrada. Instale a extensão.');
      return;
    }
    setConnecting(true);
    try {
      const result = await wallet.connect();
      const account = result?.address || (result?.accounts?.[0]?.address ?? null);
      if (account) {
        setAddress(account);
        setDiagnostic('✅ Conectado à SlushWallet!');
      } else {
        setDiagnostic('❌ Nenhuma conta retornada pela SlushWallet.');
      }
    } catch (err) {
      setDiagnostic('❌ Erro ao conectar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    if (!wallet) return;
    setAddress(null);
    try {
      if (wallet.disconnect) wallet.disconnect();
      setDiagnostic('✅ Desconectado da SlushWallet.');
    } catch (err) {
      setDiagnostic('Erro ao desconectar: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div className="wallet-connect">
      {address ? (
        <>
          <span className="wallet-status">Conectado (SlushWallet)</span>
          <span className="wallet-address" title={address}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button className="button" onClick={disconnect}>Desconectar</button>
        </>
      ) : wallet ? (
        <button className="button" onClick={connect} disabled={connecting}>
          {connecting ? 'Conectando...' : 'Conectar SlushWallet'}
        </button>
      ) : (
        <div className="wallet-error">
          <p>❌ SlushWallet não encontrada</p>
          <p className="info-text">{diagnostic}</p>
          <a 
            href="https://chrome.google.com/webstore/detail/slush-wallet/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-link"
          >
            📥 Instalar SlushWallet
          </a>
        </div>
      )}
    </div>
  );
}
