================================================================================
  You opened the "client" folder in PowerShell
================================================================================

  install.ps1 lives ONE LEVEL UP (in the main receiptiq folder), not here.

  Option A — go to the project root, then install / run everything:

    cd ..
    npm install
    npm run dev

  Option B — stay in THIS folder (client):

    npm run install-all
    npm run dev:all

  Option C — run the root installer from here:

    .\install.ps1

  Your app URL (frontend):  http://localhost:5173/
  API health check:         http://localhost:5000/api/health

  Do NOT type "PASTE\FULL\PATH" — that was a placeholder in the docs.
  Use:  cd ..   when you are already inside client.

================================================================================
