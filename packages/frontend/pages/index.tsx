
import useSWR from 'swr';
import Link from 'next/link';
import WalletConnect from '../components/WalletConnect';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());


type Circle = {
  id: string;
  name: string;
  tokenSymbol: string;
  memberCount: number;
  creator?: string;
  entryPrice?: number;
  hot?: boolean;
  benefits?: string[];
};

const mockCircles: Circle[] = [
  { id: '1', name: 'DevCircle', tokenSymbol: 'DVC', memberCount: 142, creator: 'Alice', entryPrice: 5, hot: true, benefits: ['Chat VIP', 'NFT Mensal'] },
  { id: '2', name: 'ArtFi', tokenSymbol: 'ART', memberCount: 89, creator: 'Clara', entryPrice: 3, hot: true, benefits: ['Mentorias', 'Airdrops'] },
  { id: '3', name: 'Makers Sui', tokenSymbol: 'MSUI', memberCount: 53, creator: 'Bob', entryPrice: 2, hot: false, benefits: ['NFT Mensal'] },
];


export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const { data, error } = useSWR<{ data?: Circle[] }>(`${API_URL}/api/circles`, fetcher);

  let circles: Circle[] = [];
  if (data && Array.isArray(data.data)) {
    circles = data.data;
  } else if (!data && !error) {
    circles = mockCircles;
  }

  // Modal de confirmação
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  function handleEnter(circle: Circle) {
    setSelectedCircle(circle);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setModalOpen(false);
    setSelectedCircle(null);
  }
  function handleConfirmEnter() {
    // Simulação de entrada
    setModalOpen(false);
    setSelectedCircle(null);
    alert('Entrada confirmada!');
  }

  return (
    <>
      <header className="main-header">
        <div className="logo-area">
          <img src="/logo.svg" alt="Logo CreatorCircles" className="logo-img" />
          <h1>CreatorCircles</h1>
        </div>
        <nav className="main-nav">
          <Link href="/" className="nav-link">Explorar Círculos</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/governanca" className="nav-link">Governança</Link>
          <WalletConnect />
        </nav>
      </header>
      <main>
        <h2 className="explore-title">
          <span role="img" aria-label="explorar">🌐</span> Explorar Círculos
        </h2>
        {error && (
          <div className="error">
            <span role="img" aria-label="erro">❌</span> Erro ao carregar: {error.message || 'Erro desconhecido'}<br />
            Verifique se o backend está rodando em <code>{API_URL}</code>.<br />
            <span className="info-text">Dica: execute <b>npm run dev</b> na raiz do projeto.</span>
          </div>
        )}
        {!data && !error && (
          <div className="loading-box">
            <span role="img" aria-label="carregando">⏳</span> Carregando dados reais...<br />
            <span className="info-text">Exibindo dados de exemplo</span>
          </div>
        )}
        <div className="circles-list">
          {circles.length === 0 ? (
            <div className="card">Nenhum círculo encontrado.</div>
          ) : (
            circles.map((c, idx) => (
              <div className={`card circle-card${c.hot ? ' hot-badge' : ''}`} key={c.id || idx}>
                <div className="card-title">
                  <span role="img" aria-label="circle">🟣</span> {c.name}
                  {c.hot && <span className="badge-hot">🔥 Hot</span>}
                </div>
                <div className="card-meta">Token: <b>{c.tokenSymbol}</b> &nbsp;|&nbsp; Membros: <b>{c.memberCount}</b></div>
                <div className="card-meta">Criador: <b>{c.creator}</b></div>
                <div className="card-meta">Preço de Entrada: <b>{c.entryPrice} SUI</b></div>
                <div className="card-meta">Benefícios: {c.benefits?.map(b => <span key={b} className="benefit-item">• {b}</span>)}</div>
                <button className="button" onClick={() => handleEnter(c)}>Entrar Agora</button>
              </div>
            ))
          )}
        </div>
        {modalOpen && selectedCircle && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Confirmar entrada no círculo</h3>
              <div className="modal-info">
                <b>{selectedCircle.name}</b> ({selectedCircle.tokenSymbol})<br />
                Preço de entrada: <b>{selectedCircle.entryPrice} SUI</b><br />
                Membros: <b>{selectedCircle.memberCount}</b><br />
                Benefícios: {selectedCircle.benefits?.map(b => <span key={b} className="benefit-item">• {b}</span>)}<br />
                <span className="info-text">Você será redirecionado para a wallet para confirmar a transação.</span>
              </div>
              <div className="modal-actions">
                <button className="button" onClick={handleConfirmEnter}>Confirmar</button>
                <button className="button modal-cancel" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
