#!/bin/bash
# Script de inicialização completa do CreatorCircles
# Autor: GitHub Copilot

set -e

# Função para matar processos em portas específicas
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "[INFO] Matando processo na porta $port (PID: $pid)"
    kill -9 $pid 2>/dev/null || true
    sleep 1
  fi
}

run_in_background() {
  CMD="$1"
  TITLE="$2"
  echo "[INFO] Rodando $TITLE em background."
  nohup bash -c "$CMD" > "$TITLE.log" 2>&1 &
}

# Limpar processos anteriores
echo -e "\033[1;33m[LIMPEZA] Encerrando processos anteriores...\033[0m"
kill_port 3000
kill_port 3001
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node dist/server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2


# Backend
echo -e "\033[1;34m[CreatorCircles] Inicializando backend...\033[0m"
cd "$(dirname "$0")/packages/backend"
npm install
npm audit fix || true
npm run build
echo -e "\033[1;33m[TESTES] Executando testes do backend...\033[0m"
npm test || { echo -e "\033[1;31m[ERRO] Testes do backend falharam!\033[0m"; exit 1; }
run_in_background "npm run dev" "CreatorCircles Backend"
cd ../..

# Frontend
echo -e "\033[1;34m[CreatorCircles] Inicializando frontend...\033[0m"
cd "packages/frontend"
npm install
run_in_background "npm run dev" "CreatorCircles Frontend"
cd ../..

cat <<EOF

\033[1;32mSistema CreatorCircles inicializado!\033[0m
Backend: http://localhost:3000
Frontend: http://localhost:3001

Se algum terminal não abrir, execute manualmente:
  cd packages/backend && npm run dev
  cd packages/frontend && npm run dev

Veja os últimos logs dos serviços:
  tail -f "packages/backend/CreatorCircles Backend.log"
  tail -f "packages/frontend/CreatorCircles Frontend.log"
EOF
