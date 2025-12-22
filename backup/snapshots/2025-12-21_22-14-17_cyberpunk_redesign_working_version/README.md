# 🔒 Security & Network Assessment Web App

Web application full-stack per valutare la sicurezza di rete e dispositivi, con sistema di rating completo basato su vulnerabilità rilevate e configurazioni di sicurezza.

## 📋 Caratteristiche

### ✅ Funzionalità Implementate (MVP)

- **System Info Collection**: Raccolta completa informazioni hardware, software, OS e rete
- **Browser Fingerprinting**: Analisi dettagliata browser, privacy score, canvas/WebGL fingerprint
- **Security Assessment**: Rilevamento antivirus, firewall, vulnerabilità software
- **Rating Engine**: Sistema di valutazione 0-100 con breakdown per categoria
- **Dashboard UI**: Interfaccia moderna con gauge animato, grafici e pannelli dettagliati
- **Real-time Updates**: WebSocket per progresso scansioni in tempo reale

### 🎯 Categorie di Valutazione

1. **Browser Security (25%)**: Browser moderno, privacy extensions, cookie settings
2. **System Security (30%)**: Antivirus, firewall, OS aggiornato
3. **Network Security (25%)**: Porte chiuse, encryption, password router
4. **Software Security (20%)**: Software aggiornato, CVE, servizi disabilitati

## 🛠 Tech Stack

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Socket.io** - WebSocket real-time
- **systeminformation** - System info collection
- **Helmet** - Security headers

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-veloce
- **TailwindCSS** - Utility-first CSS
- **React Query** - Data fetching
- **Zustand** - State management
- **Recharts** - Grafici e visualizzazioni
- **FingerprintJS** - Browser fingerprinting

## 📦 Installazione

### Prerequisiti

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0
- **Nmap** (opzionale, per network scanning avanzato)

### Setup Rapido

```bash
# 1. Installa tutte le dipendenze (root, backend, frontend)
npm run install:all

# 2. Avvia in modalità development (avvia backend e frontend simultaneamente)
npm run dev
```

L'applicazione sarà disponibile su:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000

### Setup Manuale

Se preferisci avviare backend e frontend separatamente:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in un altro terminale)
cd frontend
npm install
npm run dev
```

## 🚀 Utilizzo

1. **Avvia l'applicazione**: `npm run dev` dalla root
2. **Apri il browser**: Vai su http://localhost:5173
3. **Avvia Scansione**: Clicca sul bottone "Avvia Scansione"
4. **Visualizza Risultati**:
   - Rating complessivo con gauge animato
   - Breakdown dettagliato per categoria
   - Punti di forza e raccomandazioni
   - Info sistema, sicurezza e browser

## 📊 Struttura Progetto

```
security-webapp/
├── backend/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── modules/
│   │   │   ├── system-info/   # Raccolta info sistema
│   │   │   ├── security-assessment/  # Valutazione sicurezza
│   │   │   └── rating-engine/ # Calcolo rating
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # TypeScript types
│   │   └── server.ts          # Entry point
│   └── package.json
│
├── frontend/                   # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/     # Dashboard principale
│   │   │   ├── RatingDisplay/ # Gauge e breakdown
│   │   │   ├── SystemInfo/    # Pannello info sistema
│   │   │   ├── SecurityAssessment/  # Pannello sicurezza
│   │   │   └── BrowserFingerprint/  # Pannello browser
│   │   ├── services/          # API client, fingerprint, WS
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
└── package.json               # Root package.json
```

## 🔧 Configurazione

### Backend (.env)

Crea un file `.env` in `backend/` (oppure usa `.env.example`):

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NVD_API_KEY=                    # Opzionale per CVE lookup
```

## 📡 API Endpoints

### REST API

```
GET  /api/system/info           - Info sistema completo
GET  /api/system/public-ip      - IP pubblico
POST /api/scan/security         - Avvia security assessment
GET  /api/scan/security/:id     - Risultati assessment
POST /api/rating/calculate      - Calcola rating
GET  /api/scan/complete         - Scansione completa
GET  /health                    - Health check
```

### WebSocket Events

**Client → Server:**
- `scan:start` - Avvia scansione completa

**Server → Client:**
- `scan:progress` - Progresso scansione (stage, %, message)
- `scan:complete` - Scansione completata
- `scan:error` - Errore durante scansione

## ⚙️ Permessi e Considerazioni

### Windows
- **Antivirus Detection**: Richiede PowerShell (già disponibile)
- **Firewall Check**: Comando `netsh` (nessun privilegio speciale)

### Linux/macOS
- **Antivirus/Firewall Check**: Alcuni comandi potrebbero richiedere `sudo`
- **Network Scanning**: Nmap richiede privilegi elevati per alcune scansioni

### Privacy
- ✅ Nessun dato viene memorizzato persistentemente
- ✅ Tutte le scansioni sono in-memory
- ✅ Nessuna comunicazione con servizi esterni (eccetto IP pubblico)
- ✅ Opzionale: export risultati JSON locale

## 🎨 Screenshots

### Dashboard Principale
- Gauge animato con rating complessivo
- Breakdown categorie con progress bars
- Punti di forza e raccomandazioni

### Pannelli Dettagliati
- **System Info**: Hardware (CPU, RAM, GPU), OS, Network
- **Security Assessment**: Antivirus, Firewall, Vulnerabilità, Porte aperte
- **Browser Fingerprint**: Browser info, privacy score, fingerprints

## 🧪 Testing

```bash
# Backend
cd backend
npm run lint
npm run build

# Frontend
cd frontend
npm run lint
npm run build
```

## 📈 Roadmap Future Features

### Fase 2 (Nice to Have)
- [ ] Network scanning completo con device discovery
- [ ] Port scanning dettagliato con service fingerprinting
- [ ] Integrazione CVE database (NVD API) per vulnerabilità
- [ ] Antivirus/Firewall detection migliorata

### Fase 3 (Advanced)
- [ ] Export report PDF/JSON
- [ ] Comparazione con baseline sicurezza
- [ ] Storico scansioni (con database opzionale)
- [ ] Notifiche per vulnerabilità critiche

## 🤝 Contribuire

1. Fork il progetto
2. Crea il tuo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Note di Sviluppo

### Build Production

```bash
# Build completo (frontend + backend)
npm run build

# Build separati
npm run build:frontend
npm run build:backend
```

### Formatting

Il progetto usa **Prettier** e **ESLint** per code formatting:

```bash
# Backend
cd backend
npm run format
npm run lint

# Frontend
cd frontend
npm run format
npm run lint
```

## ⚠️ Limitazioni Note (MVP)

1. **Network Scanning**: Implementazione base senza Nmap integration
2. **CVE Database**: Nessuna integrazione API CVE (richiede rate limiting)
3. **Multi-platform**: Alcuni check potrebbero non funzionare su tutti gli OS
4. **Storico**: Nessun database, scansioni solo in-memory

## 📄 Licenza

MIT License - Vedi `LICENSE` file per dettagli

## 🙋 Supporto

Per problemi o domande:
1. Controlla la documentazione
2. Verifica i prerequisiti (Node.js, npm)
3. Controlla i log del backend per errori
4. Apri una issue su GitHub

---

**Made with ❤️ using React, TypeScript, and Node.js**

🔐 *Mantieni il tuo sistema sicuro!*
