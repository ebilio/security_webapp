# Changelog - 20 Dicembre 2024

## Problema Iniziale
La webapp crashava completamente, bloccava WSL e quando eseguita con VSCode bloccava bash.

## Cause Identificate

### 1. Chiamate PowerShell senza timeout (CRITICO)
- **File**: `backend/src/modules/security-assessment/antivirus-detector.ts`
- **Problema**: Loop di chiamate `sc.exe query` per ogni antivirus senza timeout
- **Impatto**: Blocco totale del sistema

### 2. Get-WindowsUpdate MOLTO lento (CRITICO)
- **File**: `backend/src/modules/security-assessment/windows-security.ts`
- **Problema**: Comando PowerShell `Get-WindowsUpdate` impiegava minuti e bloccava tutto
- **Impatto**: Causa principale del blocco WSL

### 3. Nessun timeout su tutte le chiamate execAsync
- **File**: Tutti i file in `backend/src/modules/security-assessment/`
- **Problema**: Se PowerShell si bloccava, l'intera app si bloccava
- **Impatto**: Sistema inutilizzabile

### 4. WebSocket porta sbagliata
- **File**: `frontend/src/services/websocket.ts`
- **Problema**: Frontend connetteva a porta 3000, backend in ascolto su 3001
- **Impatto**: Scansione non partiva mai, barra progresso bloccata

## Soluzioni Implementate

### Backend - Timeout e Ottimizzazioni

#### 1. Aggiunto helper `execWithTimeout()`
File modificati:
- `backend/src/modules/security-assessment/antivirus-detector.ts`
- `backend/src/modules/security-assessment/windows-security.ts`
- `backend/src/modules/security-assessment/firewall-checker.ts`

```typescript
async function execWithTimeout(command: string, timeoutMs: number = 5000): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error && !error.killed) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
    }, timeoutMs);

    child.on('exit', () => {
      clearTimeout(timeout);
    });
  });
}
```

#### 2. Ottimizzato antivirus-detector.ts (linee 149-174)
- Limitato a massimo 2 antivirus da controllare (prima controllava tutti)
- Timeout di 3 secondi per ogni check servizio
- Timeout di 8 secondi per PowerShell CimInstance query

#### 3. Disabilitato Windows Update check lento (windows-security.ts:43-66)
- **PRIMA**: Usava `Get-WindowsUpdate` (LENTISSIMO, causava blocchi)
- **DOPO**: Controlla solo se il servizio `wuauserv` è in esecuzione (veloce!)
- Timeout: 5 secondi

#### 4. Timeout su tutti i comandi
- Windows Firewall: 8 secondi
- BitLocker: 10 secondi
- UAC: 8 secondi
- Tutti gli altri check: 3-5 secondi

### Frontend - Fix WebSocket

#### File: `frontend/src/services/websocket.ts:10`
```typescript
// PRIMA
this.socket = io('http://localhost:3000', {

// DOPO
this.socket = io('http://localhost:3001', {
```

## Backup Creati

Directory: `./backup/`
- `antivirus-detector.ts.backup`
- `windows-security.ts.backup`

## Risultati Test

### Performance API
| Endpoint | Tempo | Stato |
|----------|-------|-------|
| `/health` | < 1s | ✅ OK |
| `/api/system/info` | 7.3s | ✅ OK |
| `/api/scan/security` | 10.8s | ✅ OK |
| `/api/scan/complete` | 11s | ✅ OK |

### Stress Test
- 3 richieste consecutive completate (8-9s ciascuna)
- Nessun blocco o timeout
- Sistema stabile

### Sistema WSL
- ✅ WSL responsive e stabile
- ✅ **0 processi PowerShell bloccati** (prima causa del crash)
- ✅ Memoria disponibile: 2.6GB
- ✅ Bash non si blocca più

### Frontend
- ✅ WebSocket si connette correttamente
- ✅ Barra di progresso avanza (25% → 50% → 75% → 100%)
- ✅ Scansione completa in ~3 secondi
- ✅ Risultati visualizzati correttamente

## Confronto Prima/Dopo

### PRIMA (versione con bug)
- ❌ Webapp crashava completamente
- ❌ Bloccava WSL
- ❌ Bash si bloccava in VSCode
- ❌ Processi PowerShell rimanevano hanging
- ❌ Possibili timeout di minuti o blocchi infiniti
- ❌ Scansione frontend non partiva

### DOPO (versione ottimizzata)
- ✅ Webapp funziona perfettamente
- ✅ WSL stabile
- ✅ Bash responsive
- ✅ Tutti i comandi hanno timeout (3-10 secondi)
- ✅ Scan completo in ~11 secondi
- ✅ Scansione frontend funziona con barra progresso

## File Modificati

### Backend
1. `backend/src/modules/security-assessment/antivirus-detector.ts`
   - Aggiunto `execWithTimeout()` helper
   - Limitato check antivirus a massimo 2
   - Timeout su tutte le chiamate PowerShell

2. `backend/src/modules/security-assessment/windows-security.ts`
   - Aggiunto `execWithTimeout()` helper
   - Disabilitato `Get-WindowsUpdate` (troppo lento)
   - Usa solo check veloce del servizio wuauserv
   - Timeout su UAC e BitLocker

3. `backend/src/modules/security-assessment/firewall-checker.ts`
   - Aggiunto `execWithTimeout()` helper
   - Timeout su tutti i check firewall (Windows/Linux/Mac)

### Frontend
1. `frontend/src/services/websocket.ts`
   - Corretto porta WebSocket da 3000 a 3001

## Come Avviare

```bash
# Dalla root del progetto
npm run dev

# Backend: http://localhost:3001
# Frontend: http://localhost:5173
```

## Note per il Futuro

1. **Non riabilitare Get-WindowsUpdate** - è troppo lento e causa blocchi
2. **Mantenere i timeout** su tutte le chiamate di sistema
3. **Limite di 2 antivirus** è sufficiente e previene problemi di performance
4. **Porta backend**: 3001 (configurata in `backend/.env`)
5. **Tutti i backup** sono in `./backup/` se serve fare rollback

## Stato Finale
✅ **TUTTO FUNZIONANTE E STABILE**
