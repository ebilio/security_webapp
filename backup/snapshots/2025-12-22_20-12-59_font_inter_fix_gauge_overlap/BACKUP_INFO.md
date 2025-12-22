# Backup Info

**Data**: 2025-12-22 20:13:00
**Timestamp**: 2025-12-22_20-12-59
**Descrizione**: font_inter_fix_gauge_overlap

## Contenuto Backup

- `backend_src/` - Codice sorgente backend completo
- `frontend_src/` - Codice sorgente frontend completo
- `backend.env` - Configurazione backend
- `backend_package.json` - Dipendenze backend
- `frontend_package.json` - Dipendenze frontend
- `root_package.json` - Dipendenze root
- `README.md` - Documentazione progetto
- `WORKING_STATE.md` - Stato applicazione
- `CHANGELOG_*.md` - Changelog modifiche

## Come Ripristinare

```bash
# 1. Ferma l'applicazione (Ctrl+C)

# 2. Ripristina i file
cp -r backup/snapshots/2025-12-22_20-12-59_font_inter_fix_gauge_overlap/backend_src/* backend/src/
cp -r backup/snapshots/2025-12-22_20-12-59_font_inter_fix_gauge_overlap/frontend_src/* frontend/src/
cp backup/snapshots/2025-12-22_20-12-59_font_inter_fix_gauge_overlap/backend.env backend/.env

# 3. Riavvia
npm run dev
```

## Verifica Integrità

Controllo file copiati:
- Backend files: 17 file
- Frontend files: 13 file

## Note

Questo backup è stato creato automaticamente prima di modifiche al codice.
Conserva questo backup finché non hai verificato che le nuove modifiche funzionano.
