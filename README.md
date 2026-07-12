# om-periodic-table

Structure of atom and its place in periodic table.

Om's Atom Lab — an interactive React app for exploring the periodic table and atomic structure.

**Live site:** https://ommishra-1970.github.io/om-periodic-table/

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via the workflow in
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). If the build needs the Gemini API key,
add it as a repository secret named `GEMINI_API_KEY` under
**Settings → Secrets and variables → Actions**.
