# 🔧 Risoluzione Errori Comuni

## ❌ Errore: "EADDRINUSE: address already in use :::3000"

**Problema**: La porta 3000 è già occupata da un processo Node.js precedente.

### ✅ Soluzione Rapida

#### Metodo 1: Script automatico (CONSIGLIATO)
```bash
./kill-port.sh
```

Poi riavvia:
```bash
npm run dev
```

#### Metodo 2: Comando manuale (Linux/WSL/Mac)
```bash
# Trova e termina il processo sulla porta 3000
lsof -ti:3000 | xargs kill -9

# Oppure termina tutti i processi node
killall -9 node nodemon

# Poi riavvia
npm run dev
```

#### Metodo 3: Windows PowerShell
```powershell
# Trova il processo sulla porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Poi riavvia
npm run dev
```

#### Metodo 4: Windows CMD
```cmd
# Trova il processo
netstat -ano | findstr :3000

# Copia il PID (ultima colonna) e terminalo
taskkill /PID <numero_pid> /F

# Poi riavvia
npm run dev
```

---

## ❌ Errore: "nodemon app crashed"

**Problema**: Il backend ha un errore durante l'avvio.

### ✅ Controlli da fare:

1. **Verifica errori TypeScript**:
```bash
cd backend
npx tsc --noEmit
```

2. **Reinstalla dipendenze**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

3. **Controlla il file .env**:
```bash
cd backend
cp .env.example .env
```

4. **Verifica versione Node.js**:
```bash
node --version  # Deve essere >= 20.0.0
```

---

## ❌ Errore: "Cannot find module"

**Problema**: Dipendenze non installate.

### ✅ Soluzione:
```bash
# Dalla root del progetto
npm run install:all

# Oppure manualmente
cd backend && npm install
cd ../frontend && npm install
```

---

## ❌ Frontend non si connette al backend

**Problema**: CORS o proxy non configurato.

### ✅ Controlli:

1. **Backend in esecuzione**:
```bash
curl http://localhost:3000/health
# Deve rispondere: {"status":"ok",...}
```

2. **Verifica proxy Vite** (file `frontend/vite.config.ts`):
```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

3. **Verifica CORS backend** (file `backend/.env`):
```env
CORS_ORIGIN=http://localhost:5173
```

---

## ❌ Modifiche frontend non si vedono

**Problema**: Cache browser o Vite non rileva modifiche.

### ✅ Soluzioni:

1. **Hard refresh browser**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Cancella cache Vite**:
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

3. **Riavvia Vite**:
   - Nel terminale premi `Ctrl + C`
   - Poi `npm run dev`

---

## ❌ "npm: command not found"

**Problema**: Node.js/npm non installato.

### ✅ Soluzione:

1. Scarica Node.js LTS da: https://nodejs.org/
2. Installa versione 20.x o superiore
3. Verifica installazione:
```bash
node --version
npm --version
```

---

## 🐛 Debug Avanzato

### Vedere tutti i log backend:
```bash
cd backend
npm run dev
# I log appariranno nel terminale
```

### Vedere log frontend:
```bash
cd frontend
npm run dev
# Poi apri DevTools (F12) → Console
```

### Test API manualmente:
```bash
# Health check
curl http://localhost:3000/health

# System info
curl http://localhost:3000/api/system/info

# Public IP
curl http://localhost:3000/api/system/public-ip
```

---

## 🔄 Reset Completo (Ultima risorsa)

Se nulla funziona, reset completo:

```bash
# 1. Termina tutti i processi
killall -9 node nodemon
./kill-port.sh

# 2. Rimuovi node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# 3. Rimuovi lock files
rm -f package-lock.json backend/package-lock.json frontend/package-lock.json

# 4. Reinstalla tutto
npm run install:all

# 5. Riavvia
npm run dev
```

---

## 📞 Checklist Pre-Avvio

Prima di eseguire `npm run dev`, verifica:

- [ ] Node.js >= 20.0.0 installato (`node --version`)
- [ ] Porta 3000 libera (`lsof -ti:3000` → nessun output)
- [ ] Porta 5173 libera (`lsof -ti:5173` → nessun output)
- [ ] Dipendenze installate (`node_modules` esiste in root, backend, frontend)
- [ ] File `.env` presente in `backend/`
- [ ] Nessun processo node/nodemon attivo (`ps aux | grep node`)

---

## 💡 Tips

1. **Usa sempre `npm run dev` dalla root** - avvia backend e frontend insieme
2. **Controlla sempre i terminali** - errori appaiono lì
3. **Salva i file** (Ctrl+S) - Vite rileva modifiche solo dopo il salvataggio
4. **Usa DevTools** (F12) - per vedere errori frontend
5. **Libera le porte** - prima di ogni avvio usa `./kill-port.sh`

---

**Buon debugging! 🚀**
