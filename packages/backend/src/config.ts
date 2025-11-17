// Validação simples de variáveis de ambiente essenciais
export function validateEnv() {
  const required = [
    'NODE_ENV',
    'NEXT_PUBLIC_API_URL'
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[env] Variáveis de ambiente ausentes: ${missing.join(', ')}`);
    // Em ambiente de teste, não encerra o processo
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
}

export function getPort(): number {
  const p = process.env.BACKEND_PORT || process.env.PORT || '3000';
  return Number(p);
}

export default { validateEnv, getPort };
