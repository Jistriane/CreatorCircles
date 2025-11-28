
import React, { useState } from 'react';

export default function NovaProposta() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  return (
    <main>
      <h1 className="card-title">Nova Proposta</h1>
      <div className="card" style={{maxWidth:480,margin:'32px auto'}}>
        <form>
          <label className="input-proposta">Título
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título da proposta" className="input-proposta" maxLength={64} />
          </label>
          <label className="input-proposta">Descrição
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição da proposta" className="input-proposta" rows={2} maxLength={180} />
          </label>
          <button type="submit" className="button" style={{marginTop:16}}>Criar Proposta</button>
        </form>
      </div>
    </main>
  );
}
