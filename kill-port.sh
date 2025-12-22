#!/bin/bash
# Script per liberare la porta 3000

echo "🔍 Cerco processi sulla porta 3000..."

# Trova e termina processi sulla porta 3000
PID=$(lsof -ti:3000 2>/dev/null)

if [ -n "$PID" ]; then
  echo "⚠️  Trovato processo $PID sulla porta 3000"
  echo "🔪 Termino il processo..."
  kill -9 $PID 2>/dev/null
  sleep 1
  echo "✅ Processo terminato!"
else
  echo "✅ Porta 3000 già libera!"
fi

# Termina tutti i processi node/nodemon rimasti
killall -9 node nodemon ts-node 2>/dev/null || true

echo "🎉 Porta 3000 libera! Puoi avviare il server."
