#!/bin/bash
# Script para parar o CreatorCircles

echo -e "\033[1;33m[PARANDO] CreatorCircles...\033[0m\n"

# Função para matar processos em portas específicas
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "[INFO] Matando processo na porta $port (PID: $pid)"
    kill -9 $pid 2>/dev/null || true
    sleep 1
  else
    echo "[INFO] Nenhum processo na porta $port"
  fi
}

# Parar backend
kill_port 3000

# Parar frontend
kill_port 3001

# Matar processos npm/node relacionados
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node dist/server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo -e "\n\033[1;32m[SUCESSO] Todos os serviços foram parados!\033[0m"
