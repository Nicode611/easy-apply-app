#!/bin/bash

# Script pour démarrer tous les services du monorepo Easy Apply
echo "🚀 Démarrage du monorepo Easy Apply..."

# Fonction pour arrêter tous les processus
cleanup() {
    echo "🛑 Arrêt de tous les services..."
    pkill -f "node server.js" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    pkill -f "uvicorn" 2>/dev/null
    exit 0
}

# Capturer Ctrl+C pour arrêter proprement
trap cleanup SIGINT

# Démarrer l'API Python JobSpy (port 8000)
echo "🐍 Démarrage de l'API Python JobSpy (port 8000)..."
cd JobSpy && python3 -m uvicorn api_jobspy:app --host 0.0.0.0 --port 8000 --reload &
PYTHON_PID=$!

# Attendre un peu que Python démarre
sleep 2

# Démarrer l'API Express (port 3001)
echo "⚡ Démarrage de l'API Express (port 3001)..."
cd ../easy-apply-API && npm start &
EXPRESS_PID=$!

# Attendre un peu que Express démarre
sleep 2

# Démarrer le frontend Next.js (port 3000)
echo "🌐 Démarrage du frontend Next.js (port 3000)..."
cd ../easy-apply && npm run dev &
NEXT_PID=$!

echo ""
echo "✅ Tous les services sont démarrés !"
echo "📱 Frontend: http://localhost:3000"
echo "🔌 API Express: http://localhost:3001"
echo "🐍 API Python: http://localhost:8000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Attendre que tous les processus se terminent
wait $PYTHON_PID $EXPRESS_PID $NEXT_PID 