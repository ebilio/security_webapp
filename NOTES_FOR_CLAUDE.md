# 📝 Note per Claude - Security WebApp

> **Per Claude Code**: Leggi questo file PRIMA di fare qualsiasi modifica al progetto.

---

## 🟢 STATO CORRENTE: APPLICAZIONE FUNZIONANTE E TESTATA

**Data ultimo test**: 21 Dicembre 2025, ore 22:14
**Versione**: CYBERPUNK REDESIGN - CERTIFICATA
**Backup principale**: `backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/`
**Ultimo aggiornamento**: Redesign completo frontend con tema cyberpunk green/orange hacker style

---

## ⚠️ REGOLE CRITICHE - LEGGI PRIMA DI MODIFICARE

### 🚨 COSA NON FARE MAI (causerà crash/blocchi)

1. ❌ **NON riabilitare Get-WindowsUpdate**
   - File: `backend/src/modules/security-assessment/windows-security.ts`
   - Motivo: È LENTISSIMO (minuti), blocca WSL completamente
   - Usa SOLO il check veloce del servizio `wuauserv` (già implementato)

2. ❌ **NON rimuovere timeout dalle chiamate PowerShell**
   - File: `antivirus-detector.ts`, `windows-security.ts`, `firewall-checker.ts`
   - Motivo: Senza timeout, i processi PowerShell possono bloccarsi all'infinito
   - Helper: `execWithTimeout()` deve rimanere su TUTTE le chiamate

3. ❌ **NON modificare la soglia definizioni antivirus aggiornate**
   - File: `backend/src/modules/security-assessment/antivirus-detector.ts:153`
   - Motivo: `defByte < 0x10` è lo standard per "aggiornato" (valori 0-15)
   - Valore attuale: `defByte < 0x10` - NON MODIFICARE

   ❌ **NON modificare priorità selezione antivirus**
   - File: `backend/src/modules/security-assessment/antivirus-detector.ts:187-193`
   - Motivo: Antivirus terze parti (AVG, ESET) devono avere priorità su Defender
   - Logica: thirdPartyEnabled || anyEnabled || runningAVs[0] - NON MODIFICARE

5. ❌ **NON rimuovere palette cyberpunk da Tailwind**
   - File: `frontend/tailwind.config.js`
   - Motivo: L'intero tema dipende dal namespace `cyber` con colori
   - Mantieni: cyber.bg.*, cyber.green.*, cyber.orange.*, cyber.gray.*

6. ❌ **NON rimuovere import Google Fonts**
   - File: `frontend/src/index.css`
   - Motivo: Font Rajdhani è il font principale dell'app
   - Mantieni: `@import url('https://fonts.googleapis.com/...')`

7. ❌ **NON rimuovere SVG filter #glow da RatingGauge**
   - File: `frontend/src/components/RatingDisplay/RatingGauge.tsx`
   - Motivo: Effetto neon critico per l'estetica cyberpunk
   - Mantieni: `<filter id="glow">` e `filter="url(#glow)"`

4. ❌ **NON cambiare porta WebSocket senza aggiornare frontend**
   - Backend: `backend/.env` → PORT=3001
   - Frontend: `frontend/src/services/websocket.ts:10` → porta 3001
   - Devono SEMPRE coincidere

5. ❌ **NON rimuovere l'helper execWithTimeout()**
   - È presente in 3 file (vedi sopra)
   - È CRITICO per la stabilità del sistema
   - Timeout configurati: 3-10 secondi a seconda dell'operazione

### ✅ COSA FARE SEMPRE

1. ✅ **Crea SEMPRE un backup prima di modificare**
   ```bash
   ./create-backup.sh "descrizione_modifica"
   ```

2. ✅ **Mantieni i timeout su TUTTE le chiamate di sistema**
   - Usa sempre `execWithTimeout()` per PowerShell/exec
   - Timeout minimo raccomandato: 3 secondi
   - Timeout massimo raccomandato: 10 secondi

3. ✅ **Testa SUBITO dopo ogni modifica**
   ```bash
   # Backend
   curl http://localhost:3001/health
   curl http://localhost:3001/api/scan/complete

   # Verifica WSL stabile
   ps aux | grep powershell  # Deve essere vuoto dopo scan
   ```

4. ✅ **Verifica che WSL rimanga responsivo**
   - Se bash si blocca = hai rotto qualcosa
   - Ctrl+C e fai rollback immediato

5. ✅ **Se qualcosa si rompe, ROLLBACK immediato**
   ```bash
   # Ferma app
   Ctrl+C

   # Ripristina ultima versione funzionante CERTIFICATA (Cyberpunk)
   cp -r backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/backend_src/* backend/src/
   cp -r backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/frontend_src/* frontend/src/
   cp backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/backend.env backend/.env

   # Riavvia
   npm run dev
   ```

---

## 📊 Configurazione Corrente (TESTATA)

### Porte
- **Backend API**: 3001
- **Frontend Dev**: 5173
- **WebSocket**: 3001 (stesso del backend)

### Timeout Configurati (NON MODIFICARE senza backup)

| Componente | Timeout | File | Riga |
|------------|---------|------|------|
| Antivirus service check | 3s | antivirus-detector.ts | ~160 |
| PowerShell CimInstance | 8s | antivirus-detector.ts | ~171 |
| Windows Firewall | 8s | firewall-checker.ts | ~45 |
| BitLocker | 10s | windows-security.ts | ~83 |
| UAC | 8s | windows-security.ts | ~119 |
| Windows Update service | 5s | windows-security.ts | ~50 |

### Limitazioni Performance (MANTENERE)
- Max 2 antivirus controllati
- Get-WindowsUpdate DISABILITATO (usa wuauserv)
- Scan completo: ~11 secondi

---

## 🗂️ Struttura File Critici

### Backend - File DA NON TOCCARE senza backup

```
backend/src/modules/security-assessment/
├── antivirus-detector.ts      ⚠️ CRITICO - ha execWithTimeout()
├── windows-security.ts         ⚠️ CRITICO - Get-WindowsUpdate DISABILITATO
└── firewall-checker.ts         ⚠️ CRITICO - ha execWithTimeout()
```

### Frontend - File DA NON TOCCARE senza backup

```
frontend/tailwind.config.js           ⚠️ CRITICO - palette cyberpunk completa
frontend/src/index.css                ⚠️ CRITICO - tema scuro + componenti custom
frontend/src/services/
└── websocket.ts                      ⚠️ CRITICO - porta 3001

frontend/src/components/RatingDisplay/
└── RatingGauge.tsx                   ⚠️ CRITICO - SVG con effetti neon
```

### Altri file modificabili con cautela

```
backend/src/modules/
├── rating-engine/             ✅ Relativamente sicuro
│   ├── scorer.ts
│   └── weights.ts
└── system-info/               ✅ Relativamente sicuro
    ├── hardware-info.ts
    └── os-info.ts

frontend/src/components/       ✅ Sicuro (solo UI)
├── Dashboard/
├── RatingDisplay/
├── SystemInfo/
├── SecurityAssessment/
└── BrowserFingerprint/
```

---

## 🔧 Workflow per Modifiche

### 1. PRIMA di modificare

```bash
# Crea backup
./create-backup.sh "nome_feature_o_modifica"

# Verifica app funzionante
npm run dev
# Testa su http://localhost:5173
# Click "Avvia Scansione" → deve completarsi in ~3s
```

### 2. DURANTE la modifica

- Modifica UN file alla volta
- Testa SUBITO dopo ogni modifica
- Se bash si blocca → Ctrl+C e rollback
- Verifica nessun processo PowerShell hanging: `ps aux | grep powershell`

### 3. DOPO la modifica

```bash
# Test completo
curl http://localhost:3001/health
curl http://localhost:3001/api/scan/complete

# Verifica frontend
# http://localhost:5173 → Click "Avvia Scansione"
# Deve: completarsi in ~3s, barra progresso funzionante

# Se tutto OK, aggiorna snapshot funzionante
./create-backup.sh "working_state_dopo_feature_X"
# Aggiorna WORKING_STATE.md con nuovo snapshot
```

---

## 🛡️ Sistema di Backup

### Script Automatico
```bash
# Uso base
./create-backup.sh "descrizione"

# Esempi
./create-backup.sh "before_adding_CVE_lookup"
./create-backup.sh "working_state_after_tests"
./create-backup.sh "pre_refactoring"
```

### Backup Principale (Certificato)
- **Location**: `backup/snapshots/2025-12-21_WORKING_STATE/`
- **Stato**: ✅ TESTATO E FUNZIONANTE
- **Include**: Backend completo + Frontend completo + Config

### Rollback Rapido (Emergenza)
```bash
# ONE-LINER per ripristino versione certificata CYBERPUNK
cp -r backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/backend_src/* backend/src/ && cp -r backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/frontend_src/* frontend/src/ && cp backup/snapshots/2025-12-21_22-14-17_cyberpunk_redesign_working_version/backend.env backend/.env && echo "✅ Ripristino completato!"

# Oppure tema LIGHT pre-redesign
cp -r backup/snapshots/2025-12-21_22-01-07_before_cyberpunk_redesign/backend_src/* backend/src/ && cp -r backup/snapshots/2025-12-21_22-01-07_before_cyberpunk_redesign/frontend_src/* frontend/src/ && cp backup/snapshots/2025-12-21_22-01-07_before_cyberpunk_redesign/backend.env backend/.env && echo "✅ Ripristino tema light completato!"
```

---

## 📈 Performance Attese (Riferimento)

### API Response Times (TESTATI)
| Endpoint | Tempo | Status |
|----------|-------|--------|
| `/health` | < 1s | ✅ |
| `/api/system/info` | 7.3s | ✅ |
| `/api/scan/security` | 10.8s | ✅ |
| `/api/scan/complete` | 11s | ✅ |

### Frontend (TESTATO)
- Caricamento iniziale: < 2s
- Scansione completa: ~3s
- Barra progresso: Animata (25% → 50% → 75% → 100%)
- WebSocket: Connesso immediatamente

### Sistema (VERIFICATO)
- WSL: Stabile, nessun blocco
- Processi PowerShell: 0 dopo scan
- Memoria disponibile: > 2GB

Se ottieni risultati DIVERSI da questi, hai probabilmente rotto qualcosa.

---

## 🐛 Problemi Risolti (Non Reintrodurre)

### Crash Totale App (20 Dic 2024)
**Causa**: Loop chiamate PowerShell senza timeout
**Fix**: Aggiunto `execWithTimeout()` su tutte le chiamate
**File**: antivirus-detector.ts, windows-security.ts, firewall-checker.ts
**Non rimuovere**: L'helper è CRITICO

### Blocco WSL (20 Dic 2024)
**Causa**: `Get-WindowsUpdate` impiegava minuti
**Fix**: Disabilitato, usa solo check servizio `wuauserv`
**File**: windows-security.ts:43-66
**Non riattivare**: Get-WindowsUpdate è troppo lento

### WebSocket Non Connette (20 Dic 2024)
**Causa**: Frontend connetteva porta 3000, backend su 3001
**Fix**: Corretto frontend a porta 3001
**File**: frontend/src/services/websocket.ts:10
**Mantenere**: Porta 3001 in entrambi

---

## 📚 File di Riferimento

| File | Scopo |
|------|-------|
| `WORKING_STATE.md` | Stato dettagliato versione funzionante |
| `RESTORE_POINT_CYBERPUNK_2025-12-21.md` | Punto ripristino tema cyberpunk |
| `CYBERPUNK_REDESIGN_2025-12-21.md` | Dettaglio completo redesign cyberpunk |
| `CHANGELOG_2024-12-21.md` | Fix AVG detection backend |
| `CHANGELOG_2024-12-20.md` | Fix timeout PowerShell |
| `README.md` | Documentazione progetto completa |
| `backup/README.md` | Guida sistema backup |
| `NOTES_FOR_CLAUDE.md` | Questo file (riferimento rapido) |

---

## 🎯 Checklist Pre-Modifica

Prima di modificare QUALSIASI file:

- [ ] Ho letto questo file (NOTES_FOR_CLAUDE.md)?
- [ ] Ho creato un backup? (`./create-backup.sh "descrizione"`)
- [ ] So quale file sto per modificare?
- [ ] Il file è nella lista "critici"? (vedi sezione "File DA NON TOCCARE")
- [ ] Ho verificato che l'app funziona PRIMA della modifica?
- [ ] Ho un piano di rollback se qualcosa va storto?

Se anche solo UNA risposta è "No" → FERMA e completa la checklist.

---

## 🚀 Comandi Rapidi di Riferimento

```bash
# Avvia app (dalla root)
npm run dev

# Test backend
curl http://localhost:3001/health

# Test scan completo
curl http://localhost:3001/api/scan/complete

# Verifica processi PowerShell (deve essere vuoto)
ps aux | grep powershell

# Crea backup
./create-backup.sh "descrizione"

# Rollback emergenza
cp -r backup/snapshots/2025-12-21_WORKING_STATE/backend_src/* backend/src/ && cp -r backup/snapshots/2025-12-21_WORKING_STATE/frontend_src/* frontend/src/

# Lista backup disponibili
ls -lt backup/snapshots/
```

---

## 🔴 REGOLA D'ORO

> **Se non sei SICURO al 100% di quello che stai facendo:**
> 1. Crea un backup
> 2. Fai la modifica
> 3. Testa SUBITO
> 4. Se qualcosa si rompe, rollback IMMEDIATO
>
> **È meglio fare 10 backup inutili che perdere 1 ora a debuggare.**

---

**Ultimo aggiornamento**: 21 Dicembre 2025, ore 22:14
**Versione Note**: 2.0 (Cyberpunk Edition)
**Stato App**: ✅ FUNZIONANTE E CERTIFICATA
**Tema**: Cyberpunk Green/Orange Hacker Style
