# 🚀 Guida al Deployment su Render.com

Questa guida ti accompagna passo-passo nel deployment della Security WebApp su Render.com.

## 📋 Prerequisiti

1. **Account Render.com** - [Registrati gratuitamente](https://render.com/register)
2. **Repository GitHub** - Il progetto deve essere su GitHub
3. **File configurati** ✅ - Il progetto ha già tutto configurato!

## 🎯 Deployment Automatico (Consigliato)

### 1. Prepara il Repository GitHub

```bash
# Dalla cartella del progetto
cd "security webapp"

# Inizializza git se non l'hai già fatto
git init

# Aggiungi tutti i file
git add .

# Crea il primo commit
git commit -m "Initial commit - Security WebApp with Render config"

# Crea un nuovo repository su GitHub (vai su github.com)
# Poi collega il repository locale:
git remote add origin https://github.com/TUO-USERNAME/security-webapp.git
git branch -M main
git push -u origin main
```

### 2. Deploy su Render

1. **Vai su [Render Dashboard](https://dashboard.render.com/)**

2. **Clicca "New +" → "Blueprint"**

3. **Connetti il tuo repository GitHub**
   - Autorizza Render ad accedere a GitHub
   - Seleziona il repository `security-webapp`

4. **Render rileverà automaticamente `render.yaml`**
   - Clicca "Apply" per procedere

5. **Configura le variabili d'ambiente** (opzionale)
   - `NVD_API_KEY`: Se hai una chiave API per CVE lookup
   - Render userà automaticamente le variabili in `render.yaml`

6. **Avvia il deployment**
   - Clicca "Create Web Service"
   - Attendi 5-10 minuti per il primo build

### 3. Aggiorna CORS_ORIGIN

Dopo il primo deployment, Render ti assegnerà un URL tipo:
```
https://security-webapp-xxxx.onrender.com
```

**IMPORTANTE**: Aggiorna la variabile d'ambiente `CORS_ORIGIN`:

1. Vai su **Dashboard Render** → Tuo servizio
2. **Environment** → **Edit**
3. Modifica `CORS_ORIGIN` con il tuo URL Render
4. Clicca **Save Changes** (riavvierà automaticamente)

### 4. Testa l'Applicazione

Apri l'URL assegnato da Render nel browser:
```
https://security-webapp-xxxx.onrender.com
```

✅ Dovresti vedere la dashboard della Security WebApp!

---

## 🛠 Deployment Manuale (Alternativo)

Se preferisci non usare Blueprint, puoi deployare manualmente:

### 1. Crea Web Service

1. **Dashboard Render** → **New +** → **Web Service**
2. **Connect Repository** (autorizza GitHub)
3. **Seleziona** il tuo repository

### 2. Configura il Servizio

**Build & Deploy:**
```
Name: security-webapp
Region: Frankfurt (o Oregon/Singapore)
Branch: main
Runtime: Node
Build Command: npm run install:all && npm run build
Start Command: npm start
```

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://security-webapp-xxxx.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Advanced:**
```
Plan: Free
Auto-Deploy: Yes
Health Check Path: /health
```

### 3. Deploy

Clicca **Create Web Service** e attendi il build.

---

## 🔧 Post-Deployment

### Verifiche di Funzionamento

1. **Health Check**
   ```bash
   curl https://TUO-URL.onrender.com/health
   # Risposta: {"status":"ok","timestamp":"..."}
   ```

2. **API Test**
   ```bash
   curl https://TUO-URL.onrender.com/api/system/public-ip
   ```

3. **Dashboard**
   - Apri l'URL nel browser
   - Clicca "Avvia Scansione"
   - Verifica che WebSocket funzioni

### Monitoraggio

**Dashboard Render:**
- **Logs**: Visualizza log real-time
- **Metrics**: CPU, memoria, richieste
- **Events**: Storia dei deploy

**Alerts:**
- Configura notifiche email per errori
- Settings → Notifications

---

## ⚙️ Configurazioni Avanzate

### Dominio Personalizzato

1. **Dashboard** → Tuo servizio → **Settings**
2. **Custom Domain** → **Add Custom Domain**
3. Inserisci `tuodominio.com`
4. Configura DNS:
   ```
   Type: CNAME
   Name: www (o @)
   Value: security-webapp-xxxx.onrender.com
   ```

### Variabili d'Ambiente

Per aggiungere chiavi API o segreti:

1. **Dashboard** → **Environment**
2. **Add Environment Variable**
3. Inserisci chiave e valore
4. **Save** (riavvia automaticamente)

### Auto-Deploy

Il progetto è già configurato per auto-deploy:
- Ogni `git push` su `main` triggera un nuovo deploy
- Puoi disabilitarlo in **Settings** → **Auto-Deploy**

### Build Cache

Render usa cache automatica per velocizzare i build:
- `node_modules` viene cachato
- Primo build: ~5-10 minuti
- Build successivi: ~2-3 minuti

---

## 📊 Piano Gratuito - Limitazioni

### ✅ Cosa Include (Free Tier)
- **750 ore/mese** (sufficiente per un progetto)
- **512 MB RAM**
- **0.1 CPU**
- **Build illimitati**
- **SSL/HTTPS automatico**

### ⚠️ Limitazioni
- **Sleep dopo 15 min di inattività**
  - Si riattiva in ~30 secondi alla prima richiesta
  - Puoi fare upgrade a $7/mese per evitare sleep

- **Bandwidth**: 100 GB/mese (più che sufficiente)

### 💡 Evitare Sleep (Free)
Crea un cron job che pinga il tuo servizio ogni 14 minuti:
```bash
# Usa cron-job.org o UptimeRobot (gratis)
GET https://TUO-URL.onrender.com/health
```

---

## 🔄 Aggiornamenti e Manutenzione

### Deploy Nuove Modifiche

```bash
# Modifica il codice localmente
# Testa in locale: npm run dev

# Commit e push
git add .
git commit -m "Fix: descrizione modifiche"
git push origin main

# Render rileva automaticamente e redeploya
```

### Rollback a Versione Precedente

1. **Dashboard** → **Events**
2. Trova il deploy funzionante
3. **Rollback** → **Confirm**

### View Logs

```bash
# In tempo reale dal dashboard
Dashboard → Logs

# Oppure usa Render CLI
npm install -g render-cli
render login
render logs security-webapp
```

---

## 🐛 Troubleshooting

### Problema: Build Fallisce

**Soluzione:**
1. Controlla i log nel Dashboard
2. Verifica che `npm run build` funzioni in locale
3. Controlla che tutte le dipendenze siano in `package.json`

### Problema: App non si Avvia

**Soluzione:**
1. Verifica che `PORT=10000` sia impostato
2. Controlla che `npm start` funzioni dopo il build locale
3. Verifica i log per errori di runtime

### Problema: CORS Errors

**Soluzione:**
1. Aggiorna `CORS_ORIGIN` con l'URL Render corretto
2. Verifica che non ci siano trailing slash
3. Redeploya il servizio

### Problema: WebSocket non Connette

**Soluzione:**
1. Verifica che l'URL WebSocket usi `wss://` (non `ws://`)
2. Controlla che Socket.IO client punti all'URL corretto
3. Render supporta WebSocket di default

### Problema: Applicazione Lenta

**Cause possibili:**
- Sleep mode del piano free (primo caricamento lento)
- Backend che raccoglie info sistema (normale, ~3 secondi)

**Soluzione:**
- Upgrade a piano paid ($7/mese) per evitare sleep
- Ottimizza raccolta dati se troppo lenta

---

## 📞 Supporto

### Documentazione Render
- [Guida Deploy Node.js](https://render.com/docs/deploy-node-express-app)
- [Blueprint YAML](https://render.com/docs/blueprint-spec)
- [Environment Variables](https://render.com/docs/environment-variables)

### Community
- [Render Community Forum](https://community.render.com/)
- [Discord Render](https://discord.gg/render)

### Progetto
- GitHub Issues del tuo repository
- Controlla `README.md` per info generali

---

## ✨ Prossimi Passi

Dopo il deployment:

1. ✅ Testa tutte le funzionalità
2. 📊 Configura monitoring (Render Metrics)
3. 🔒 Aggiungi dominio personalizzato (opzionale)
4. 📧 Configura notifiche email (Settings → Notifications)
5. 🔄 Setup backup automatico del codice (già fatto con GitHub)

**Congratulazioni! La tua Security WebApp è online! 🎉**

---

## 📝 Note Finali

- **Database**: Al momento l'app non usa database (tutto in-memory)
- **Persistenza**: I risultati scansioni non vengono salvati
- **Scalabilità**: Per traffico alto, considera upgrade a piano superiore
- **Sicurezza**: SSL/HTTPS è automatico con Render
- **Backup**: Codice su GitHub = backup automatico

Per domande o problemi, apri una issue su GitHub!
