
import WalletConnect from '../components/WalletConnect';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Circle = {
  id: string;
  name: string;
  tokenSymbol: string;
  memberCount: number;
  description?: string;
  entryPrice?: number;
  benefits?: string[];
  image?: string;
};

const BENEFITS = [
  'Chat VIP Exclusivo',
  'NFT Mensal de Colecionador',
  'Mentorias 1:1',
  'Airdrops de Projetos Parceiros',
];

function CirclePreview({ circle }: { circle: Partial<Circle> }) {
  if (!circle.name) return null;
  return (
    <div className="card circle-card preview-card">
      {circle.image && (
        <img src={circle.image} alt="Preview" className="preview-img" />
      )}
      <div className="card-title">{circle.name} ({circle.tokenSymbol})</div>
      <div className="card-meta">{circle.description}</div>
      <div className="card-meta">Preço de Entrada: <b>{circle.entryPrice} SUI</b></div>
      <div className="card-meta">Fornecimento Inicial: <b>{circle.memberCount}</b></div>
      <div className="card-meta">Benefícios: {circle.benefits?.map(b => <span key={b} className="benefit-item">• {b}</span>)}</div>
    </div>
  );
}

export default function Dashboard() {
  // Formulário de criação de círculo
  const [form, setForm] = useState({
    name: '',
    tokenSymbol: '',
    description: '',
    entryPrice: 5,
    memberCount: 10000,
    benefits: [] as string[],
    image: '',
  });
  const [previewImg, setPreviewImg] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { data, error } = useSWR<{ data: Circle[] }>(process.env.NEXT_PUBLIC_API_URL + '/api/circles', fetcher);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleBenefitChange(benefit: string) {
    setForm(f => ({
      ...f,
      benefits: f.benefits.includes(benefit)
        ? f.benefits.filter(b => b !== benefit)
        : [...f.benefits, benefit],
    }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImg(ev.target?.result as string);
        setForm(f => ({ ...f, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleCreateCircle() {
    setCreating(true);
    setStatus(null);
    try {
      // Simulação de chamada à API
      await new Promise(res => setTimeout(res, 1200));
      setStatus('Círculo criado com sucesso!');
      setForm({
        name: '',
        tokenSymbol: '',
        description: '',
        entryPrice: 5,
        memberCount: 10000,
        benefits: [],
        image: '',
      });
      setPreviewImg('');
    } catch (e: any) {
      setStatus('Erro ao criar círculo');
    }
    setCreating(false);
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard do Criador</h1>
          <WalletConnect />
        </div>
        <div className="dashboard-welcome">
          <span className="dashboard-welcome-title">Lançar Novo Círculo</span><br />
          <span className="info-text">Preencha o formulário abaixo para criar seu círculo. Preview mostra como ficará no marketplace.</span>
        </div>
        <form className="circle-form">
          <div className="form-group">
            <label>Nome: <input name="name" value={form.name} onChange={handleChange} className="input-proposta" placeholder="DevCircle" maxLength={32} /></label>
          </div>
          <div className="form-group">
            <label>Símbolo: <input name="tokenSymbol" value={form.tokenSymbol} onChange={handleChange} className="input-proposta" placeholder="DVC" maxLength={8} /></label>
          </div>
          <div className="form-group">
            <label>Descrição:<br /><textarea name="description" value={form.description} onChange={handleChange} className="input-proposta" placeholder="Comunidade para devs Web3 no Sui" maxLength={120} rows={2} /></label>
          </div>
          <div className="form-group">
            <label>Preço de Entrada: <input type="number" name="entryPrice" value={form.entryPrice} onChange={handleChange} className="input-proposta" min={1} max={100} /></label> <span className="info-text">SUI</span>
          </div>
          <div className="form-group">
            <label>Fornecimento Inicial: <input type="number" name="memberCount" value={form.memberCount} onChange={handleChange} className="input-proposta" min={1} max={1000000} /></label>
          </div>
          <div className="form-group">
            <label>Benefícios:</label><br />
            {BENEFITS.map(b => (
              <label key={b} className="benefit-label">
                <input type="checkbox" checked={form.benefits.includes(b)} onChange={() => handleBenefitChange(b)} /> {b}
              </label>
            ))}
          </div>
          <div className="form-group">
            <label>Upload Imagem do Círculo:
              <input type="file" accept="image/*" onChange={handleImageUpload} className="input-file" />
            </label>
          </div>
          <div className="form-group">
            <span className="info-text">💰 Taxa de Criação: 0.5 SUI</span>
          </div>
          <button type="button" className="button" onClick={handleCreateCircle} disabled={creating || !form.name || !form.tokenSymbol}>Criar Círculo</button>
          <button type="button" className="button preview-btn" onClick={e => e.preventDefault()}>Preview</button>
          {creating && <span className="info-text"> Processando...</span>}
          {status && <div className="info-text">{status}</div>}
        </form>
        <CirclePreview circle={{ ...form, image: previewImg }} />
        <hr className="divider" />
        <h2 className="dashboard-section-title">Seus círculos</h2>
        {error && <div className="error">Erro ao carregar</div>}
        {!data && <div className="loading-box">Carregando...</div>}
        {data && (
          <div className="circle-list">
            {data.data.map((c, idx) => (
              <div className="card circle-card" key={c.id || idx}>
                <div className="card-title"><span role="img" aria-label="circle">🟣</span> {c.name}</div>
                <div className="card-meta">Token: <b>{c.tokenSymbol}</b> &nbsp;|&nbsp; Membros: <b>{c.memberCount}</b></div>
                {/* ...ações rápidas, saldo, histórico, etc... */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
