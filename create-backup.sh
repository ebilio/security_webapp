#!/bin/bash

# Script di Backup Automatico per Security WebApp
# Uso: ./create-backup.sh "descrizione_modifica"

# Colori per output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ottieni timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Ottieni descrizione (opzionale)
DESCRIPTION=${1:-"backup_automatico"}
DESCRIPTION_SAFE=$(echo "$DESCRIPTION" | tr ' ' '_' | tr -cd '[:alnum:]_-')

# Nome directory backup
BACKUP_DIR="backup/snapshots/${TIMESTAMP}_${DESCRIPTION_SAFE}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Backup Security WebApp${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${YELLOW}Timestamp:${NC} $TIMESTAMP"
echo -e "${YELLOW}Descrizione:${NC} $DESCRIPTION"
echo -e "${YELLOW}Directory:${NC} $BACKUP_DIR"
echo ""

# Crea directory backup
mkdir -p "$BACKUP_DIR"

# Backup backend
echo -e "${BLUE}[1/6]${NC} Backup backend/src..."
cp -r backend/src "$BACKUP_DIR/backend_src"

# Backup frontend
echo -e "${BLUE}[2/6]${NC} Backup frontend/src..."
cp -r frontend/src "$BACKUP_DIR/frontend_src"

# Backup configurazione
echo -e "${BLUE}[3/6]${NC} Backup configurazioni..."
cp backend/.env "$BACKUP_DIR/backend.env" 2>/dev/null || echo "# No .env found" > "$BACKUP_DIR/backend.env"
cp backend/package.json "$BACKUP_DIR/backend_package.json"
cp frontend/package.json "$BACKUP_DIR/frontend_package.json"
cp package.json "$BACKUP_DIR/root_package.json"

# Backup file documentazione
echo -e "${BLUE}[4/6]${NC} Backup documentazione..."
cp README.md "$BACKUP_DIR/" 2>/dev/null || true
cp WORKING_STATE.md "$BACKUP_DIR/" 2>/dev/null || true
cp CHANGELOG_*.md "$BACKUP_DIR/" 2>/dev/null || true

# Crea file info backup
echo -e "${BLUE}[5/6]${NC} Creazione BACKUP_INFO.md..."
cat > "$BACKUP_DIR/BACKUP_INFO.md" << EOF
# Backup Info

**Data**: $(date +"%Y-%m-%d %H:%M:%S")
**Timestamp**: $TIMESTAMP
**Descrizione**: $DESCRIPTION

## Contenuto Backup

- \`backend_src/\` - Codice sorgente backend completo
- \`frontend_src/\` - Codice sorgente frontend completo
- \`backend.env\` - Configurazione backend
- \`backend_package.json\` - Dipendenze backend
- \`frontend_package.json\` - Dipendenze frontend
- \`root_package.json\` - Dipendenze root
- \`README.md\` - Documentazione progetto
- \`WORKING_STATE.md\` - Stato applicazione
- \`CHANGELOG_*.md\` - Changelog modifiche

## Come Ripristinare

\`\`\`bash
# 1. Ferma l'applicazione (Ctrl+C)

# 2. Ripristina i file
cp -r $BACKUP_DIR/backend_src/* backend/src/
cp -r $BACKUP_DIR/frontend_src/* frontend/src/
cp $BACKUP_DIR/backend.env backend/.env

# 3. Riavvia
npm run dev
\`\`\`

## Verifica Integrità

Controllo file copiati:
- Backend files: $(find "$BACKUP_DIR/backend_src" -type f | wc -l) file
- Frontend files: $(find "$BACKUP_DIR/frontend_src" -type f | wc -l) file

## Note

Questo backup è stato creato automaticamente prima di modifiche al codice.
Conserva questo backup finché non hai verificato che le nuove modifiche funzionano.
EOF

# Lista file backuppati
echo -e "${BLUE}[6/6]${NC} Verifica backup..."
BACKEND_FILES=$(find "$BACKUP_DIR/backend_src" -type f 2>/dev/null | wc -l)
FRONTEND_FILES=$(find "$BACKUP_DIR/frontend_src" -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

echo ""
echo -e "${GREEN}✅ Backup completato con successo!${NC}"
echo ""
echo -e "${YELLOW}Statistiche:${NC}"
echo -e "  - Backend files: ${BACKEND_FILES}"
echo -e "  - Frontend files: ${FRONTEND_FILES}"
echo -e "  - Dimensione totale: ${TOTAL_SIZE}"
echo -e "  - Location: ${BACKUP_DIR}"
echo ""
echo -e "${YELLOW}Per ripristinare:${NC}"
echo -e "  cp -r ${BACKUP_DIR}/backend_src/* backend/src/"
echo -e "  cp -r ${BACKUP_DIR}/frontend_src/* frontend/src/"
echo ""
echo -e "${BLUE}================================${NC}"
