# Copilot instructions for this repository

## Build, test, and lint commands

- Install dependencies with `npm install` and `uv sync`.
- Run the local static dev server with `python3 server.py` and open `http://localhost:8081/src/`. Use `python3 server.py --port 9000` to change the port.
- There is no build step. GitHub Pages deploys the contents of `src/` directly.
- There is currently no automated test suite and no `npm test` script.
- Formatting check: `npm run format:check`
- Format everything: `npm run format`
- Full lint script: `npm run lint`
    - In CI, the YAML check is run as `npx yaml-lint src/**/*.yaml`.
- Run a single-file lint/check with the same tools CI uses:
    - JavaScript: `npx eslint src/app.js`
    - CSS: `npx stylelint src/style.css`
    - HTML: `npx htmlhint src/index.html`
    - YAML: `npx yaml-lint src/wealthy.yaml`
    - Python: `uv run ruff check server.py`

## High-level architecture

- This is a static browser app. `src/index.html` provides the full UI shell, `src/style.css` provides the visual design, and `src/app.js` contains the application logic.
- `server.py` is only a minimal local development server. It changes into `src/` and serves static files; it is not an application backend.
- Deployment is also static: `.github/workflows/static.yml` uploads `src/` to GitHub Pages, so production behavior depends entirely on files under `src/`.
- `src/app.js` is a single IIFE that owns:
    - four-step view navigation (`view-age`, `view-wealth`, `view-compare`, `view-result`)
    - DOM lookup and event wiring by fixed element IDs
    - wealth-to-corn calculations and result rendering
    - loading `age-groups.yaml` and `wealthy.yaml` in the browser via `fetch` + `jsyaml.load`
    - service worker registration
- Data is content-driven:
    - `src/age-groups.yaml` stores median household wealth by age group in euros
    - `src/wealthy.yaml` stores wealthy comparison entries in **billions** of euros; `app.js` multiplies each `wealth` value by `1e9`
- Offline support is manual. `src/sw.js` caches a fixed asset list, including CDN URLs. When adding or renaming app assets, update both `ASSETS` and `CACHE_NAME`.

## Key conventions

- Keep the app static and browser-local. The product promise in the UI and README is that calculations happen locally in the browser, with no user input sent to a server.
- Preserve the current DOM contract. `app.js` depends on hard-coded IDs, the `views` array, and the `steps` array staying aligned with `index.html`.
- Prefer safe DOM updates for user-visible text. The code already uses `textContent` and DOM node creation in places where values come from data files or inputs; follow that pattern instead of building HTML strings from dynamic values.
- Preserve German locale behavior. Number parsing/formatting is intentionally German-specific (`de-DE`, dots as thousands separators, commas as decimals).
- Keep data edits in the existing units and shapes:
    - `age-groups.yaml` entries use `label`, `ageMin`, `ageMax`, `medianWealth`
    - `wealthy.yaml` entries use `name` and `wealth` in billions
- Frontend JavaScript is plain browser JS, not a module or framework. ESLint is configured for browser globals plus the CDN-provided `jsyaml` and `bootstrap` globals.
- Formatting and style are opinionated:
    - Prettier uses 4-space indentation, semicolons, double quotes, trailing commas where valid in ES5, and `printWidth: 120`
    - Ruff runs with `select = ["ALL"]` on `server.py`
- The repo enforces branch hygiene with Husky:
    - direct commits and pushes to `main` are blocked
    - branch names must match `feature/...`, `fix/...`, `chore/...`, `hotfix/...`, or `release/...`
