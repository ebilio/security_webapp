# 🔄 Sistema di Backup

Questa directory contiene i backup del progetto Security WebApp.

## 📁 Struttura

```
backup/
├── README.md                          # Questo file
├── snapshots/                         # Snapshot completi con timestamp
│   ├── 2025-12-21_WORKING_STATE/     # Versione TESTATA e FUNZIONANTE
│   │   ├── backend_src/
│   │   ├── frontend_src/
│   │   ├── backend.env
│   │   ├── BACKUP_INFO.md
│   │   └── ...
│   └── [altri snapshot futuri]
├── antivirus-detector.ts.backup       # Backup singoli file (legacy)
└── windows-security.ts.backup
```

## 🎯 Versione Certificata Funzionante

**Snapshot Principale**: `snapshots/2025-12-21_WORKING_STATE/`

Questa è la versione **testata e certificata come funzionante** al 21 Dicembre 2025.

### Caratteristiche:
- ✅ Backend stabile (porta 3001)
- ✅ Frontend funzionante (porta 5173)
- ✅ WebSocket connesso correttamente
- ✅ Timeout su tutte le chiamate PowerShell
- ✅ Performance ottimizzate
- ✅ Nessun blocco WSL

**Riferimenti:**
- Documentazione stato: `/WORKING_STATE.md`
- Changelog modifiche: `/CHANGELOG_2024-12-20.md`

## 🔧 Come Creare un Nuovo Backup

### Metodo Automatico (RACCOMANDATO)

```bash
# Dalla root del progetto
./create-backup.sh "descrizione_delle_modifiche"

# Esempi:
./create-backup.sh "prima_di_aggiungere_feature_X"
./create-backup.sh "before_refactoring_api"
./create-backup.sh "working_state_dopo_test"
```

Lo script:
1. Crea una directory con timestamp
2. Copia tutto il codice sorgente (backend + frontend)
3. Copia le configurazioni (.env, package.json)
4. Crea un file BACKUP_INFO.md con dettagli
5. Mostra statistiche e istruzioni ripristino

### Metodo Manuale

```bash
# Crea directory backup con timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
mkdir -p backup/snapshots/${TIMESTAMP}_descrizione

# Copia file
cp -r backend/src backup/snapshots/${TIMESTAMP}_descrizione/backend_src
cp -r frontend/src backup/snapshots/${TIMESTAMP}_descrizione/frontend_src
cp backend/.env backup/snapshots/${TIMESTAMP}_descrizione/backend.env
```

## 🔄 Come Ripristinare un Backup

### 1. Ferma l'Applicazione

```bash
# Premi Ctrl+C nel terminale dove gira npm run dev
```

### 2. Ripristina i File

```bash
# Dalla root del progetto
BACKUP="backup/snapshots/2025-12-21_WORKING_STATE"

# Ripristina backend
cp -r $BACKUP/backend_src/* backend/src/

# Ripristina frontend
cp -r $BACKUP/frontend_src/* frontend/src/

# Ripristina configurazione
cp $BACKUP/backend.env backend/.env
```

### 3. Riavvia l'Applicazione

```bash
npm run dev
```

### 4. Verifica Funzionamento

```bash
# Test backend
curl http://localhost:3001/health

# Test frontend
# Apri http://localhost:5173 nel browser
```

## 📅 Quando Creare un Backup

**SEMPRE prima di:**
- ✅ Modificare file critici (security-assessment, rating-engine, etc.)
- ✅ Aggiungere nuove funzionalità
- ✅ Fare refactoring significativo
- ✅ Aggiornare dipendenze importanti
- ✅ Modificare configurazioni WebSocket/API
- ✅ Cambiare logica di timeout o chiamate PowerShell

**CONSIGLIATO dopo:**
- ✅ Completare una feature e testarla con successo
- ✅ Risolvere un bug critico
- ✅ Raggiungere uno stato stabile dopo modifiche

## 🗂️ Gestione Backup

### Pulizia Backup Vecchi

```bash
# Lista tutti i backup ordinati per data
ls -lt backup/snapshots/

# Rimuovi backup specifico (ATTENZIONE!)
rm -rf backup/snapshots/2025-XX-XX_nome_backup

# Mantieni solo ultimi 5 backup
cd backup/snapshots
ls -t | tail -n +6 | xargs -I {} rm -rf {}
```

### Dimensione Backup

```bash
# Vedi dimensione totale backup
du -sh backup/

# Vedi dimensione di ogni snapshot
du -sh backup/snapshots/*
```

## 🚨 Backup di Emergenza Rapido

Se l'app si è rotta e devi tornare all'ultimo stato funzionante:

```bash
# ONE-LINER per ripristino versione certificata
cp -r backup/snapshots/2025-12-21_WORKING_STATE/backend_src/* backend/src/ && cp -r backup/snapshots/2025-12-21_WORKING_STATE/frontend_src/* frontend/src/ && cp backup/snapshots/2025-12-21_WORKING_STATE/backend.env backend/.env && echo "✅ Ripristino completato! Riavvia con: npm run dev"
```

## 📝 Changelog Backup

| Data | Snapshot | Descrizione | Stato |
|------|----------|-------------|-------|
| 2025-12-21 17:54 | `2025-12-21_WORKING_STATE` | Versione testata e funzionante post-fix crash | ✅ CERTIFICATO |
| 2024-12-20 | `antivirus-detector.ts.backup` | Backup pre-fix timeout antivirus | 📦 Legacy |
| 2024-12-20 | `windows-security.ts.backup` | Backup pre-fix Get-WindowsUpdate | 📦 Legacy |

## 🔍 File Inclusi in Ogni Backup

Ogni snapshot completo contiene:

```
snapshot/
├── backend_src/                # Codice sorgente backend
│   ├── modules/
│   │   ├── security-assessment/
│   │   ├── rating-engine/
│   │   └── system-info/
│   ├── routes/
│   ├── middleware/
│   ├── types/
│   └── server.ts
├── frontend_src/              # Codice sorgente frontend
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── backend.env                # Configurazione backend
├── backend_package.json       # Dipendenze backend
├── frontend_package.json      # Dipendenze frontend
├── root_package.json          # Dipendenze root
├── README.md                  # Documentazione progetto
├── WORKING_STATE.md           # Stato applicazione (se presente)
├── CHANGELOG_*.md             # Changelog (se presenti)
└── BACKUP_INFO.md             # Info su questo backup
```

## ⚠️ Importante

1. **Non committare backup su Git**: I backup sono locali, `.gitignore` li esclude
2. **Testa dopo ripristino**: Verifica sempre che l'app funzioni dopo un restore
3. **Backup esterni**: Per sicurezza extra, copia snapshot importanti fuori dal progetto
4. **Documenta modifiche**: Aggiorna WORKING_STATE.md dopo modifiche importanti

## 🆘 Supporto

Se hai problemi con i backup:
1. Controlla che lo script sia eseguibile: `chmod +x create-backup.sh`
2. Verifica permessi cartelle: `ls -la backup/`
3. Controlla spazio disco: `df -h`
4. Consulta i log: controllare output dello script

---

**Ultimo aggiornamento**: 21 Dicembre 2025
