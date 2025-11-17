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
  const { data, error, mutate } = useSWR<{ data: Proposal[] }>(process.env.NEXT_PUBLIC_API_URL + '/api/governance', fetcher)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [loading, setLoading] = useState(false)

  async function criarProposta() {
    setLoading(true)
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/governance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: novoTitulo })
    })
    setNovoTitulo('')
    setLoading(false)
    mutate()
  }

  async function votar(id: string) {
    setLoading(true)
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/governance/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: id })
    })
    setLoading(false)
    mutate()
  }

  if (error) return <div className="error"><span role="img" aria-label="erro">❌</span> Erro ao carregar propostas</div>;
  if (!data) return <div className="loading-box"><span role="img" aria-label="carregando">⏳</span> Carregando...</div>;

  return (
    <main className="governanca-main">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Governança</h1>
        </div>
        <div className="dashboard-welcome">
          <span className="dashboard-welcome-title">Painel de Governança</span><br />
          <span className="info-text">Aqui você poderá votar, propor mudanças e acompanhar decisões dos círculos.</span>
        </div>
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
      </div>
    </main>
  )
}
