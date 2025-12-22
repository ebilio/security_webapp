# 🚀 Guida: Aprire e Avviare con Visual Studio Code

## ⚠️ IMPORTANTE: Non usare Live Server!

Live Server **NON funziona** per questo progetto perché:
- ❌ Non può eseguire il backend Node.js/Express
- ❌ Non può compilare TypeScript
- ❌ Non supporta React + Vite
- ❌ Non gestisce il proxy API

## ✅ Metodo Corretto (3 passi)

### 1️⃣ Apri il progetto in VSCode

**Opzione A - Da VSCode:**
1. Apri VSCode
2. File → Open Folder
3. Seleziona la cartella `security webapp`

**Opzione B - Da Esplora File:**
1. Vai alla cartella `security webapp`
2. Tasto destro → "Open with Code"

**Opzione C - Da terminale:**
```bash
cd "/mnt/c/Users/Asus/Desktop/Codice/security webapp"
code .
```

### 2️⃣ Installa le dipendenze (PRIMA VOLTA)

Apri il terminale integrato di VSCode (`` Ctrl + ` `` o View → Terminal):

```bash
npm run install:all
```

Questo installerà:
- Dipendenze root (concurrently)
- Dipendenze backend (Express, TypeScript, systeminformation, etc.)
- Dipendenze frontend (React, Vite, TailwindCSS, etc.)

⏱️ Tempo: ~2-3 minuti

### 3️⃣ Avvia l'applicazione

Nel terminale di VSCode:

```bash
npm run dev
```

Questo comando:
- ✅ Avvia il backend su `http://localhost:3000`
- ✅ Avvia il frontend su `http://localhost:5173`
- ✅ Apre automaticamente il browser
- ✅ Abilita hot reload (modifiche live)

## 📱 Aprire nel browser

Dopo aver eseguito `npm run dev`, l'app si apre automaticamente.

Se non si apre, vai manualmente su:
```
http://localhost:5173
```

## 🎮 Comandi Utili

### Avvio e sviluppo
```bash
npm run dev              # Avvia backend + frontend insieme
npm run dev:backend      # Solo backend (porta 3000)
npm run dev:frontend     # Solo frontend (porta 5173)
```

### Build production
```bash
npm run build            # Build completo
npm run build:backend    # Build solo backend
npm run build:frontend   # Build solo frontend
```

### Utilità
```bash
cd backend && npm run lint     # Controlla errori backend
cd frontend && npm run lint    # Controlla errori frontend
```

## 🔄 Uso con Terminali Multipli (Alternativa)

Se preferisci avviare backend e frontend separatamente:

**Terminale 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminale 2 (Frontend):**
```bash
cd frontend
npm run dev
```

In VSCode puoi aprire terminali multipli con il `+` nella barra terminale.

## 🐛 Debugging in VSCode

Ho configurato il debugging per te!

1. Vai alla tab "Run and Debug" (Ctrl+Shift+D)
2. Seleziona "Debug Backend"
3. Premi F5

Questo ti permette di:
- Mettere breakpoint nel codice backend
- Ispezionare variabili
- Step through del codice

## 📁 Workspace VSCode Consigliato

Per un'esperienza ottimale, puoi usare il terminale split:

1. Apri terminale (`` Ctrl + ` ``)
2. Clicca sull'icona "Split Terminal" (in alto a destra)
3. Terminale 1: `npm run dev:backend`
4. Terminale 2: `npm run dev:frontend`

Oppure usa semplicemente `npm run dev` in un solo terminale!

## 🎨 Estensioni VSCode Consigliate

Quando apri il progetto, VSCode ti suggerirà di installare:

1. **ESLint** - Linting JavaScript/TypeScript
2. **Prettier** - Code formatting
3. **TypeScript** - Supporto TypeScript
4. **Tailwind CSS IntelliSense** - Autocomplete TailwindCSS

Clicca "Install All" quando appare il popup!

## ⚡ Hot Reload (Modifiche in Tempo Reale)

Quando avvii con `npm run dev`:

- **Frontend**: Modifiche a file `.tsx`, `.ts`, `.css` si ricaricano **istantaneamente** nel browser
- **Backend**: Modifiche a file `.ts` backend **riavviano automaticamente** il server (grazie a nodemon)

Prova a:
1. Modificare un colore in `frontend/src/components/Dashboard/Dashboard.tsx`
2. Salvare (Ctrl+S)
3. Vedere il cambiamento istantaneo nel browser!

## 📊 Struttura nel VSCode Explorer

```
security-webapp/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 modules/      ← Logica business
│   │   ├── 📁 routes/       ← API endpoints
│   │   └── 📄 server.ts     ← Entry point backend
│   └── 📄 package.json
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/   ← Componenti React
│   │   ├── 📁 services/     ← API client
│   │   └── 📄 App.tsx       ← Entry point frontend
│   └── 📄 package.json
│
├── 📄 package.json          ← Scripts principali
└── 📄 README.md
```

## 🛠 Troubleshooting

### ❌ "command not found: npm"
**Soluzione**: Installa Node.js da https://nodejs.org/ (versione LTS)

### ❌ "Port 3000 already in use"
**Soluzione**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero_pid> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### ❌ "Cannot find module"
**Soluzione**:
```bash
npm run install:all
```

### ❌ Modifiche frontend non si vedono
**Soluzione**:
1. Salva il file (Ctrl+S)
2. Controlla la console del browser per errori (F12)
3. Ricarica la pagina (Ctrl+R)

### ❌ Backend non risponde
**Soluzione**: Controlla il terminale backend per errori, assicurati che giri su porta 3000

## ✅ Checklist Primo Avvio

- [ ] Aperto VSCode nella cartella `security webapp`
- [ ] Eseguito `npm run install:all` (solo la prima volta)
- [ ] Eseguito `npm run dev`
- [ ] Vedo output "Server running" e "Vite dev server running"
- [ ] Aperto browser su http://localhost:5173
- [ ] Vedo la dashboard con il bottone "Avvia Scansione"
- [ ] Cliccato "Avvia Scansione" e vedo il gauge con il rating

## 🎯 Workflow Sviluppo Tipico

```bash
# Mattina: Apri VSCode
code .

# Avvia dev server
npm run dev

# Lavora sul codice...
# (modifiche automaticamente ricaricate)

# Fine giornata: Chiudi terminali
Ctrl+C (2 volte) nel terminale
```

## 📚 Risorse Utili

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TypeScript**: https://typescriptlang.org
- **TailwindCSS**: https://tailwindcss.com
- **Express**: https://expressjs.com

---

**Buon coding! 🚀**
