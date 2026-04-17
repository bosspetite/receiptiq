================================================================================
  You opened the "server" folder in PowerShell
================================================================================

  install-all and dev:all run from the PARENT folder (the main receiptiq root).

  Option A — go to project root:

    cd ..
    npm install
    npm run dev

  Option B — stay in THIS folder (server):

    npm run install-all
    npm run dev:all

  Option C — only the API (no Vite / no browser UI):

    npm install
    npm run dev

  Frontend URL:  http://localhost:5173/
  API health:    http://localhost:5000/api/health

================================================================================
