# Deploy su Vercel

Questa applicazione è ora un **frontend statico puro** che può essere deployato gratuitamente su Vercel.

## ✨ Caratteristiche

- 🌐 **100% Client-Side**: Nessun backend necessario
- 🚀 **Deploy Gratuito**: Hosting gratuito su Vercel
- ⚡ **Ultra Veloce**: Servito via CDN globale
- 🔒 **Privacy**: Nessun dato inviato a server esterni (eccetto per IP pubblico)

## 🚀 Deploy su Vercel

### Opzione 1: Deploy Automatico (Consigliata)

1. Vai su [vercel.com](https://vercel.com)
2. Fai login con GitHub
3. Clicca **"New Project"**
4. Seleziona questo repository: `ebilio/security_webapp`
5. Vercel rileverà automaticamente la configurazione da `vercel.json`
6. Clicca **"Deploy"**
7. Fatto! Il tuo sito sarà live in ~2 minuti

### Opzione 2: Vercel CLI

```bash
# Installa Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

## 📦 Cosa Viene Deployato

Solo il frontend React compilato:
- `frontend/dist/` → Build ottimizzata
- Nessun backend Node.js
- Nessun database

## 🔧 Configurazione

Il file `vercel.json` contiene:
- Build command: `cd frontend && npm run build`
- Output directory: `frontend/dist`
- SPA routing rewrites
- Security headers

## 🌐 Dopo il Deploy

Una volta deployato, l'app sarà disponibile su un URL tipo:
```
https://security-webapp-xyz.vercel.app
```

## 🔒 Cosa Fa l'App

L'app analizza il **TUO browser** (non il server):
- ✅ Fingerprinting del browser
- ✅ IP pubblico (tramite ipify.org)
- ✅ Informazioni connessione
- ✅ Feature detection
- ✅ Security assessment
- ✅ Rating di sicurezza

**Tutto viene eseguito nel tuo browser!**

## 🆚 Differenze con la Vecchia Versione

### Prima (con Render):
- Backend Node.js su Render
- WebSocket per progress updates
- Scansionava il **server** Render
- Costo: $7/mese

### Ora (con Vercel):
- Solo frontend statico
- Progress simulato client-side
- Scansiona il **tuo browser**
- Costo: **Gratis** 🎉

## 🔄 Aggiornamenti

Ogni push su `main` trigge rà un deploy automatico su Vercel.

## 📊 Performance

- **Build time**: ~30 secondi
- **Deploy time**: ~1 minuto
- **Load time**: <1 secondo (grazie al CDN)

## 💡 Pro Tips

1. **Custom Domain**: Puoi collegare un dominio personalizzato gratuitamente
2. **Environment Variables**: Non necessarie per questa app
3. **Analytics**: Vercel offre analytics gratuiti
4. **Preview Deployments**: Ogni PR crea un preview deploy automatico

## 🛠️ Sviluppo Locale

```bash
cd frontend
npm install
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

## 📝 Note

- L'app non salva dati
- Nessuna tracking analytics (se non aggiunti)
- Completamente open source
- Privacy-first approach
