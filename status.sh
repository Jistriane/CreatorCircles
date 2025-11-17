#!/bin/bash
# Script para verificar o status do CreatorCircles

echo -e "\033[1;34m=== Status do CreatorCircles ===\033[0m\n"

# Verificar processos
echo -e "\033[1;33m[PROCESSOS]\033[0m"
BACKEND_PID=$(lsof -ti:3000 2>/dev/null)
FRONTEND_PID=$(lsof -ti:3001 2>/dev/null)

if [ -n "$BACKEND_PID" ]; then
  echo -e "✅ Backend: \033[1;32mRODANDO\033[0m (PID: $BACKEND_PID, Porta: 3000)"
else
  echo -e "❌ Backend: \033[1;31mPARADO\033[0m"
fi

if [ -n "$FRONTEND_PID" ]; then
  echo -e "✅ Frontend: \033[1;32mRODANDO\033[0m (PID: $FRONTEND_PID, Porta: 3001)"
else
  echo -e "❌ Frontend: \033[1;31mPARADO\033[0m"
fi

# Testar endpoints
echo -e "\n\033[1;33m[ENDPOINTS]\033[0m"
if curl -s -f http://localhost:3000/api/circles > /dev/null 2>&1; then
  echo -e "✅ Backend API: \033[1;32mRESPONDENDO\033[0m (http://localhost:3000/api/circles)"
else
  echo -e "❌ Backend API: \033[1;31mNÃO RESPONDE\033[0m"
fi

if curl -s -f http://localhost:3001 > /dev/null 2>&1; then
  echo -e "✅ Frontend: \033[1;32mRESPONDENDO\033[0m (http://localhost:3001)"
else
  echo -e "❌ Frontend: \033[1;31mNÃO RESPONDE\033[0m"
fi

# Logs recentes
echo -e "\n\033[1;33m[LOGS RECENTES - BACKEND]\033[0m"
tail -5 "packages/backend/CreatorCircles Backend.log" 2>/dev/null || echo "Arquivo de log não encontrado"

echo -e "\n\033[1;33m[LOGS RECENTES - FRONTEND]\033[0m"
tail -5 "packages/frontend/CreatorCircles Frontend.log" 2>/dev/null || echo "Arquivo de log não encontrado"

echo -e "\n\033[1;34m=== Fim do Status ===\033[0m"
