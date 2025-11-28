
import React, { useState } from 'react';

export default function AjustarPreco() {
  const [preco, setPreco] = useState(5);
  return (
    <main>
      <h1 className="card-title">Ajustar Preço</h1>
      <div className="card" style={{maxWidth:480,margin:'32px auto'}}>
        <form>
          <label className="input-proposta">Novo Preço de Entrada (SUI)
            <input type="number" value={preco} onChange={e => setPreco(Number(e.target.value))} min={1} max={1000} className="input-proposta" />
          </label>
          <button type="submit" className="button" style={{marginTop:16}}>Salvar Preço</button>
        </form>
      </div>
    </main>
  );
}
