
import React from 'react';

export default function EmitirNFT() {
  return (
    <main>
      <h1 className="card-title">Emitir NFT Mensal</h1>
      <div className="card" style={{maxWidth:480,margin:'32px auto'}}>
        <form>
          <label className="input-proposta">Nome do NFT
            <input type="text" placeholder="NFT Mensal" className="input-proposta" maxLength={32} />
          </label>
          <label className="input-proposta">Descrição
            <textarea placeholder="Descrição do NFT mensal" className="input-proposta" rows={2} maxLength={120} />
          </label>
          <label className="input-proposta">Imagem
            <input type="file" accept="image/*" className="input-file" />
          </label>
          <button type="submit" className="button" style={{marginTop:16}}>Emitir NFT</button>
        </form>
      </div>
    </main>
  );
}
