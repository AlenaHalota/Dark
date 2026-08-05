dark-reel — scaffold

To finish setup locally, run the following in a terminal (PowerShell may block npm scripts; use Command Prompt or update execution policy):

Backend

```bash
cd backend
npm install
# run the local backend server without SAM CLI
npm run local
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Tests (Playwright)

```bash
cd tests
# requires Playwright installed globally or in project; install with
# npm i -D @playwright/test
npx playwright test
```
