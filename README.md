# AppRepo — Your Toolbox

A minimal tool hub landing page. Displays your apps as a searchable, filterable card grid with favorites support.

## Features

- Search bar with real-time filtering
- Category filter tabs (Productivity, Data, Development, Design)
- Hover animations and responsive layout

## Quick Start

```bash
npm install
npm run build
```

Serve the `dist/` folder. Use `npm run watch` for development.

Deploy to local web server:

```bash
npm run deploy:local
```

This copies `dist/` contents to `/var/www/local/apprepo.eu/`.

## Project Structure

```
src/main.js      → App entry point (imports CSS)
src/style.css    → Styles
index.html       → HTML template
rollup.config.mjs → Build config
dist/            → Production output (hashed assets)
```
