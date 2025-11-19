// ...existing code...
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Proposal = {
  _id: string
  title: string
  votes: number
}

export default function Governanca() {
  const { data, error, mutate } = useSWR<{ data: Proposal[] }>(process.env.NEXT_PUBLIC_API_URL + '/api/governance', fetcher);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock de métricas e configurações
  const metrics = {
    membros: 142,
    receita: 710,
    ativos: 87,
    royalties: 428,
    retencao: 78,
    bloqueado: 3500,
    treasury: 285,
    propostasAbertas: 3,
    thresholdVoto: 51,
    poolLiquidez: 1200,
    royaltiesRate: 5,
    saqueTaxa: 15,
  };

  async function criarProposta() {
    setLoading(true);
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/governance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: novoTitulo })
    });
    setNovoTitulo('');
    setLoading(false);
    mutate();
  }

  async function votar(id: string) {
    setLoading(true);
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/governance/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: id })
    });
    setLoading(false);
    mutate();
  }

  if (error) return <div className="error"><span role="img" aria-label="erro">❌</span> Erro ao carregar propostas</div>;
  if (!data) return <div className="loading-box"><span role="img" aria-label="carregando">⏳</span> Carregando...</div>;

  return (
    <main className="governanca-main">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Analytics & Governança</h1>
        </div>
        <div className="dashboard-welcome">
          <span className="dashboard-welcome-title">Analytics do Círculo</span><br />
          <span className="info-text">Métricas on-chain em tempo real. Cards clicáveis levam direto para ações rápidas.</span>
        </div>
        <div className="metrics-cards">
          <div className="card metric-card">Membros: <b>{metrics.membros}</b></div>
          <div className="card metric-card">Receita: <b>{metrics.receita} SUI</b></div>
          <div className="card metric-card">Royalties Recebidos: <b>{metrics.royalties} SUI</b></div>
          <div className="card metric-card">Taxa de Retenção: <b>{metrics.retencao}%</b></div>
          <div className="card metric-card">Valor Bloqueado: <b>{metrics.bloqueado} SUI</b></div>
        </div>
        <div className="quick-actions">
          <button className="button">Emitir NFT Mensal</button>
          <button className="button">Nova Proposta</button>
          <button className="button">Ajustar Preço</button>
          <button className="button">Ver Propostas</button>
        </div>
        <hr className="divider" />
        <h2 className="dashboard-section-title">Governança do Círculo</h2>
        <div className="propostas-list">
          {data.data.length === 0 ? (
            <div className="info-text">Nenhuma proposta encontrada.</div>
          ) : (
            data.data.map(p => (
              <div className="card proposta-card" key={p._id}>
                <div className="card-title">{p.title}</div>
                <div className="card-meta">Votos: <b>{p.votes}</b></div>
                <button className="button" onClick={() => votar(p._id)} disabled={loading}>Votar</button>
              </div>
            ))
          )}
        </div>
        <div className="nova-proposta-box">
          <input className="input-proposta" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} placeholder="Nova proposta" />
          <button className="button" onClick={criarProposta} disabled={loading || !novoTitulo}>Criar proposta</button>
        </div>
        <hr className="divider" />
        <h2 className="dashboard-section-title">Configurações Avançadas</h2>
        <div className="advanced-settings">
          <div className="card config-card">
            <b>Tokenomics</b><br />
            Royalties: {metrics.royaltiesRate}%<br />
            Taxa de Saque: {metrics.saqueTaxa}% (24h) → 2%<br />
            Pool de Liquidez: {metrics.poolLiquidez} SUI
          </div>
          <div className="card config-card">
            <b>Governança</b><br />
            Threshold de Voto: {metrics.thresholdVoto}%<br />
            Propostas Abertas: {metrics.propostasAbertas} ativas<br />
            DAO Treasury: {metrics.treasury} SUI
          </div>
          <div className="card config-card">
            <b>Integrações</b><br />
            <label><input type="checkbox" /> Discord Bot (gated access)</label><br />
            <label><input type="checkbox" /> Telegram Premium Group</label><br />
            <label><input type="checkbox" /> API para Parceiros</label><br />
            <button className="button config-btn">Configurar</button>
          </div>
        </div>
      </div>
    </main>
  );
}
