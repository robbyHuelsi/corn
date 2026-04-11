# 🌽 Vermögen in Maiskörnern

Berechne Vermögensungleichheit, dargestellt in Maiskörnern. Alle Berechnungen lokal im Browser.

## Lokale Entwicklung einrichten

### Voraussetzungen

- [Node.js](https://nodejs.org/) (≥ 20)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python-Paketmanager)

### Setup

```bash
# 1. Repository klonen
git clone https://github.com/robbyHuelsi/corn.git
cd corn

# 2. Node-Dependencies installieren (inkl. Husky Git-Hooks)
npm install

# 3. Python-Environment + Ruff installieren
uv sync
```

Nach `npm install` werden die Git-Hooks automatisch über Husky eingerichtet (`prepare`-Script).

### Dev-Server starten

```bash
python3 server.py
# → http://localhost:8081/src/
```

### Verfügbare npm-Scripts

| Befehl                 | Beschreibung                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run lint`         | Alle Linter ausführen (ESLint, Stylelint, HTMLHint, yaml-lint, Ruff) |
| `npm run lint:fix`     | Linter mit Auto-Fix ausführen                                        |
| `npm run format`       | Alle Dateien mit Prettier formatieren                                |
| `npm run format:check` | Prüfen ob alle Dateien korrekt formatiert sind                       |

### Git-Hooks

Die Hooks werden automatisch über Husky aktiviert:

- **pre-commit** — Blockiert Commits auf `main`, prüft das Branch-Namensschema und führt `lint-staged` aus: Linter + Formatter laufen nur auf geänderten Dateien.
- **pre-push** — Blockiert direkte Pushes auf `main`.

Direkte Commits und Pushes auf `main` sind nicht erlaubt. Nutze einen Feature-Branch und erstelle einen Pull Request.

Erlaubtes Branch-Schema:

- `feature/<name>`
- `fix/<name>`
- `chore/<name>`
- `hotfix/<name>`
- `release/<name>`

### Manuell einzelne Tools ausführen

```bash
# JavaScript
npx eslint src/**/*.js
npx eslint --fix src/**/*.js

# CSS
npx stylelint src/**/*.css
npx stylelint --fix src/**/*.css

# HTML
npx htmlhint src/**/*.html

# YAML
npx yaml-lint src/**/*.yaml

# Python
uv run ruff check server.py
uv run ruff check --fix server.py
uv run ruff format server.py

# Prettier (alle Dateien)
npx prettier --check .
npx prettier --write .
```
