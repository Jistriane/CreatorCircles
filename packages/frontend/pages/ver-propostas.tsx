
import React from 'react';

const propostas = [
  { id: 1, titulo: 'Reduzir taxa de entrada', votos: 42 },
  { id: 2, titulo: 'Aumentar benefícios mensais', votos: 31 },
  { id: 3, titulo: 'Parceria com projeto X', votos: 27 },
];

export default function VerPropostas() {
  return (
    <main>
      <h1 className="card-title">Ver Propostas</h1>
      <div style={{maxWidth:600,margin:'32px auto'}}>
        {propostas.map(p => (
          <div className="card proposta-card" key={p.id}>
            <div className="card-title">{p.titulo}</div>
            <div className="card-meta">Votos: <b>{p.votos}</b></div>
            <button className="button">Votar</button>
          </div>
        ))}
      </div>
    </main>
  );
}
