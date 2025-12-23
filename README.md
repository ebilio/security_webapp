# Security Assessment Web App

**Applicazione web client-side per valutazione sicurezza del browser**

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-web-orange)

Una web app moderna e gratuita che analizza la sicurezza del **TUO browser** direttamente dal client, senza bisogno di backend.

🔗 **Live Demo**: https://security-webapp-2hc7.vercel.app

---

## ✨ Caratteristiche

- 🌐 **100% Client-Side**: Nessun server, tutto gira nel browser
- 🔒 **Privacy-First**: Nessun dato inviato a server (eccetto API pubbliche per IP)
- ⚡ **Ultra Veloce**: Servito via CDN globale (Vercel)
- 🆓 **Completamente Gratuito**: Hosting e utilizzo
- 🎨 **Design Cyberpunk**: UI moderna e accattivante
- 📊 **Rating Dettagliato**: Analisi completa della sicurezza

---

## 🔍 Cosa Analizza

### Informazioni Browser
- ✅ User Agent e piattaforma
- ✅ Lingua e fuso orario
- ✅ Risoluzione schermo e pixel ratio
- ✅ Feature detection (WebGL, WebRTC, Storage, ecc.)

### Hardware (accessibile da browser)
- ✅ CPU cores
- ✅ Memoria dispositivo (se disponibile)
- ✅ Touch points

### Connessione & Rete
- ✅ IP pubblico
- ✅ Geolocalizzazione (paese, città)
- ✅ ISP
- ✅ Tipo di connessione
- ✅ Velocità stimata

### Security Assessment
- ✅ HTTPS vs HTTP
- ✅ Mixed content detection
- ✅ Cookie e storage
- ✅ Do Not Track
- ✅ WebRTC leak risk
- ✅ Browser fingerprint entropy

### Rating Categorie
- 🔐 **Sicurezza Browser** (30%)
- 🌐 **Sicurezza Connessione** (35%)
- 🕵️ **Privacy** (25%)
- 🚀 **Supporto Features** (10%)

---

## 🚀 Deploy su Vercel (Gratis)

### Auto-Deploy da GitHub

1. Fork questo repository
2. Vai su [vercel.com/new](https://vercel.com/new)
3. Importa il tuo fork
4. Deploy! ✅

Vercel leggerà automaticamente `vercel.json` e `build.sh`.

### Deploy Manuale

```bash
npm install -g vercel
git clone https://github.com/yourusername/security_webapp
cd security_webapp
vercel --prod
```

---

## 💻 Sviluppo Locale

### Prerequisiti

- Node.js 18+
- npm o yarn

### Setup

```bash
# Clona il repository
git clone https://github.com/yourusername/security_webapp
cd security_webapp

# Installa dipendenze frontend
cd frontend
npm install

# Avvia dev server
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

---

## 📁 Struttura Progetto

```
security_webapp/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard/
│   │   │   ├── RatingDisplay/
│   │   │   └── BrowserFingerprint/
│   │   ├── services/       # Business logic
│   │   │   ├── clientInfo.ts      # Raccolta info client
│   │   │   ├── ratingEngine.ts    # Calcolo rating
│   │   │   └── fingerprint.ts     # Browser fingerprinting
│   │   └── types/          # TypeScript types
│   └── dist/               # Build output
├── build.sh                # Vercel build script
├── vercel.json             # Vercel config
├── DEPLOY.md               # Deployment guide
└── README.md               # This file
```

---

## 🛠️ Tecnologie Usate

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **FingerprintJS** - Browser fingerprinting

### APIs Esterne
- **ipify.org** - IP pubblico detection
- **ipwho.is** - Geolocalizzazione IP

### Hosting
- **Vercel** - Static hosting + CDN

---

## 📊 Come Funziona

```
1. Utente apre l'app
   ↓
2. Clicca "Avvia Scansione"
   ↓
3. App raccoglie info dal browser:
   - getBrowserFingerprint()
   - getSystemInfo()
   - getNetworkInfo() → API esterna per IP
   - performSecurityAssessment()
   ↓
4. Calcola rating basato su:
   - Sicurezza browser
   - Sicurezza connessione
   - Privacy features
   - Supporto tecnologie moderne
   ↓
5. Mostra risultati:
   - Rating complessivo
   - Breakdown per categoria
   - Rischi rilevati
   - Raccomandazioni
```

---

## 🔒 Privacy & Sicurezza

### Cosa NON Viene Raccolto
- ❌ Nessun dato personale
- ❌ Nessun tracking
- ❌ Nessun cookie di terze parti
- ❌ Nessun analytics (se non aggiunti da te)

### Chiamate Esterne
L'app fa solo **2 chiamate API esterne**:
1. `ipify.org` - Per ottenere il tuo IP pubblico
2. `ipwho.is` - Per geolocalizzare l'IP

Entrambe sono chiamate **pubbliche e anonime**.

---

## 🎯 Limitazioni

Essendo una **web app**, non può accedere a:
- ❌ Antivirus installati (privilegio OS)
- ❌ Firewall (privilegio OS)
- ❌ Software installati (privacy browser)
- ❌ Uso RAM/CPU reale (sandbox browser)

Può solo analizzare ciò che il **browser espone** via Web APIs.

---

## 📈 Roadmap

- [ ] Salvataggio storico scansioni (localStorage)
- [ ] Confronto tra scansioni
- [ ] Export PDF report
- [ ] Dark/Light mode toggle
- [ ] Multi-lingua (EN, IT, ES, FR)
- [ ] PWA support
- [ ] Statistiche aggregate (opzionale con backend minimale)

---

## 🤝 Contribuire

Contributi sono benvenuti! Per favore:

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📝 License

Distribuito sotto licenza MIT. Vedi `LICENSE` per più informazioni.

---

## 🙏 Credits

- **FingerprintJS** - Browser fingerprinting
- **ipify** - IP detection
- **ipwho.is** - IP geolocation
- **Vercel** - Hosting
- **TailwindCSS** - Styling

---

## 📧 Contatti

GitHub: [@ebilio](https://github.com/ebilio/security_webapp)

---

⭐ Se ti piace il progetto, lascia una stella su GitHub!
