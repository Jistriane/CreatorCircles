import WalletConnect from '../components/WalletConnect';
function HistoricoCompras({ userId }: { userId: string }) {
  const { data, error } = useSWR<{ data: any[] }>(`/api/purchases?userId=${userId}`, fetcher)
  if (error) return <div className="error"><span role="img" aria-label="erro">❌</span> Erro ao carregar histórico</div>
  if (!data) return <div className="loading-box"><span role="img" aria-label="carregando">⏳</span> Carregando histórico...</div>
  if (!data.data || data.data.length === 0) return <div className="info-text">Nenhum histórico encontrado.</div>
  return (
    <div className="compras-box">
      <h3>Histórico de compras</h3>
      <ul>
        {data.data.map((p, i) => (
          <li key={i}>Circle: {p.circleId} — {new Date(p.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  )
}
function ComprarToken({ circleId }: { circleId: string }) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function comprar() {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/buy-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circleId })
      })
      const data = await res.json()
      if (data.success) setStatus('Compra realizada!')
      else setStatus('Falha na compra')
    } catch (e: any) {
      setStatus('Erro: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="comprar-box">
      <button className="button" onClick={comprar} disabled={loading}>Comprar token</button>
      {loading && <span className="info-text"> Processando...</span>}
      {status && <div className="info-text">{status}</div>}
    </div>
  )
}
import { useState } from 'react'
function SaldoSui({ address }: { address: string }) {
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function consultarSaldo() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sui-balance?address=' + address)
      const data = await res.json()
      if (data.balance) setBalance(data.balance)
      else setError('Saldo não encontrado')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="saldo-box">
      <button className="button" onClick={consultarSaldo} disabled={loading}>Consultar saldo SUI</button>
      {loading && <span className="info-text"> Carregando...</span>}
      {balance && <div className="info-text">Saldo SUI: {balance}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  )
}
import useSWR from 'swr'
// ...existing code...

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Circle = {
  id: string
  name: string
  tokenSymbol: string
  memberCount: number
}

export default function Dashboard() {
  const { data, error } = useSWR<{ data: Circle[] }>(process.env.NEXT_PUBLIC_API_URL + '/api/circles', fetcher)

  return (
    <main className="dashboard-main">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard do Criador</h1>
          <WalletConnect />
        </div>
        <div className="dashboard-welcome">
          <span className="dashboard-welcome-title">Bem-vindo ao Dashboard!</span><br />
          <span className="info-text">Aqui você verá suas informações, círculos e histórico de compras.</span>
        </div>
        {error && <div className="error">Erro ao carregar</div>}
        {!data && <div className="loading-box">Carregando...</div>}
        {data && (
          <>
            <h2 className="dashboard-section-title">Seus círculos</h2>
            <div className="circle-list">
              {data.data.map((c, idx) => (
                <div className="card circle-card" key={c.id || idx}>
                  <div className="card-title"><span role="img" aria-label="circle">🟣</span> {c.name}</div>
                  <div className="card-meta">Token: <b>{c.tokenSymbol}</b> &nbsp;|&nbsp; Membros: <b>{c.memberCount}</b></div>
                  <SaldoSui address={process.env.NEXT_PUBLIC_CREATOR_ADDRESS || ''} />
                  <ComprarToken circleId={c.id} />
                  <HistoricoCompras userId={process.env.NEXT_PUBLIC_CREATOR_ADDRESS || ''} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
