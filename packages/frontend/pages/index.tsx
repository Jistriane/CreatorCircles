import useSWR from 'swr';
import Link from 'next/link';
import WalletConnect from '../components/WalletConnect';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Circle = {
  id: string;
  name: string;
  tokenSymbol: string;
  memberCount: number;
};

const mockCircles: Circle[] = [
  { id: '1', name: 'Dev Circle', tokenSymbol: 'DVC', memberCount: 142 },
  { id: '2', name: 'Artistas Web3', tokenSymbol: 'ART', memberCount: 87 },
  { id: '3', name: 'Makers Sui', tokenSymbol: 'MSUI', memberCount: 53 },
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
              <div className="card circle-card" key={c.id || idx}>
                <div className="card-title">
                  <span role="img" aria-label="circle">🟣</span> {c.name}
                </div>
                <div className="card-meta">Token: <b>{c.tokenSymbol}</b> &nbsp;|&nbsp; Membros: <b>{c.memberCount}</b></div>
                <button className="button">Entrar no círculo</button>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
