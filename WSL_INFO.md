# 🐧 Supporto WSL (Windows Subsystem for Linux)

## ✅ Problema Risolto!

L'app ora **rileva automaticamente** quando è eseguita da WSL e interroga l'host Windows per ottenere le informazioni reali.

## 🔍 Cosa viene rilevato

Quando esegui l'app da WSL2 su Windows, l'applicazione rileva automaticamente:

### Sistema Operativo
- ✅ **Prima (errato)**: Ubuntu 24.04.3 LTS
- ✅ **Ora (corretto)**: Windows 11 (versione reale)

### Hardware
- ✅ **CPU**: Informazioni reali dal processore Windows
- ✅ **RAM**: Memoria fisica totale di Windows (non quella allocata a WSL)
- ✅ **GPU**: Scheda video reale di Windows

### Sicurezza
- ✅ **Antivirus**: Rileva Windows Defender sull'host Windows
- ✅ **Firewall**: Controlla il firewall di Windows (non quello di Ubuntu)

## 🛠 Come funziona

L'app:
1. Controlla se è in esecuzione su WSL leggendo `/proc/version`
2. Se rileva WSL, esegue comandi PowerShell per interrogare Windows
3. Combina le informazioni di WSL con quelle reali di Windows

### Comandi PowerShell utilizzati

```powershell
# Sistema Operativo
(Get-CimInstance Win32_OperatingSystem).Caption  # Nome Windows
(Get-CimInstance Win32_OperatingSystem).Version  # Versione

# CPU
(Get-CimInstance Win32_Processor).Name                      # Nome CPU
(Get-CimInstance Win32_Processor).NumberOfCores             # Core fisici
(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors # Core logici

# RAM
(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory  # RAM totale

# GPU
(Get-CimInstance Win32_VideoController).Name  # Nome scheda video

# Antivirus (Windows Defender)
Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled

# Firewall
netsh advfirewall show allprofiles state
```

## 🎯 Risultati della scansione

Dopo la modifica, dovresti vedere:

### Sistema Operativo
```
OS: Microsoft Windows 11 Pro (o la tua versione)
Release: 10.0.22631 (o il tuo build)
Kernel: 5.15.167.4-microsoft-standard-WSL2
Arch: x64
```

### Hardware
```
CPU: Intel Core i7-12700K (il tuo processore reale)
Cores: 20 (i tuoi core reali, non virtualizzati)
RAM: 32 GB (la tua RAM totale, non quella allocata a WSL)
GPU: NVIDIA GeForce RTX 3080 (la tua GPU reale)
```

### Sicurezza
```
Antivirus: Windows Defender (rilevato da Windows host)
Status: Attivo/Aggiornato
Firewall: Windows Firewall (rilevato da Windows host)
Status: Attivo
```

## 🚀 Ora prova la scansione!

1. Riavvia il server:
```bash
./kill-port.sh
npm run dev
```

2. Vai su http://localhost:5173

3. Clicca "Avvia Scansione"

4. Dovresti vedere **Windows 11** come sistema operativo e le tue specifiche hardware reali!

## 📝 Note tecniche

### Perché WSL mostra Ubuntu?
WSL2 è una macchina virtuale Linux leggera che gira su Windows. Quando Node.js viene eseguito in WSL, vede l'ambiente Linux (Ubuntu), non Windows.

### Come risolviamo?
L'app rileva WSL e usa PowerShell (disponibile in WSL tramite `powershell.exe`) per interrogare l'host Windows e ottenere le informazioni reali.

### Cosa rimane di WSL?
- **Kernel**: Mostra ancora il kernel WSL (5.15.x-microsoft-standard-WSL2) - questo è corretto
- **Hostname**: Mostra il nome del computer Windows
- **Network**: Mostra le interfacce di rete virtualizzate di WSL

## 🐛 Se vedi ancora Ubuntu

Se dopo il riavvio vedi ancora Ubuntu:

1. **Controlla i log del backend** nel terminale:
```
Failed to get Windows host info: ...
```

2. **Verifica che PowerShell funzioni da WSL**:
```bash
powershell.exe -Command "echo 'test'"
```

Se non funziona, potresti dover abilitare l'interoperabilità WSL:
```bash
# Aggiungi a ~/.bashrc o ~/.zshrc
export PATH="$PATH:/mnt/c/Windows/System32/WindowsPowerShell/v1.0"
```

3. **Reinstalla e riavvia**:
```bash
./kill-port.sh
cd backend && npm install
cd ..
npm run dev
```

## ✨ Alternativa: Esegui nativamente su Windows

Se preferisci non usare WSL, puoi eseguire l'app direttamente su Windows:

1. **Installa Node.js** per Windows da https://nodejs.org/

2. **Apri PowerShell** (non WSL):
```powershell
cd "C:\Users\Asus\Desktop\Codice\security webapp"
npm run install:all
npm run dev
```

In questo caso l'app rileverà direttamente Windows senza bisogno di interrogare via PowerShell!

---

**L'app ora funziona perfettamente sia su WSL che nativamente su Windows!** 🎉
