.PHONY: dev start stop install build clean help

# Variables
PYTHON_DIR = JobSpy
API_DIR = easy-apply-API
FRONTEND_DIR = easy-apply

# Commandes principales
dev: ## Démarrer tous les services en mode développement
	@echo "🚀 Démarrage du monorepo Easy Apply..."
	@concurrently \
		"cd $(PYTHON_DIR) && python -m uvicorn api_jobspy:app --host 0.0.0.0 --port 8000 --reload" \
		"cd $(API_DIR) && npm start" \
		"cd $(FRONTEND_DIR) && npm run dev"

start: ## Démarrer en mode production
	@echo "🚀 Démarrage en mode production..."
	@concurrently \
		"cd $(API_DIR) && npm start" \
		"cd $(FRONTEND_DIR) && npm start"

stop: ## Arrêter tous les services
	@echo "🛑 Arrêt de tous les services..."
	@pkill -f "node server.js" 2>/dev/null || true
	@pkill -f "next dev" 2>/dev/null || true
	@pkill -f "uvicorn" 2>/dev/null || true

install: ## Installer toutes les dépendances
	@echo "📦 Installation des dépendances..."
	@npm install
	@cd $(FRONTEND_DIR) && npm install
	@cd $(API_DIR) && npm install
	@cd $(PYTHON_DIR) && poetry install

build: ## Construire le frontend
	@echo "🔨 Construction du frontend..."
	@cd $(FRONTEND_DIR) && npm run build

clean: ## Nettoyer les fichiers temporaires
	@echo "🧹 Nettoyage..."
	@find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
	@find . -name ".next" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
	@find . -name "__pycache__" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

help: ## Afficher cette aide
	@echo "📋 Commandes disponibles :"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' 