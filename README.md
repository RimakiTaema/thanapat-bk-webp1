# thanapat-bk-webp1

this web is pre revamp of main page

## GitHub Pages CI

This repository includes a GitHub Actions workflow that builds Tailwind CSS and deploys the site to the `gh-pages` branch.

How it works:

- On push to `main` (or `master`), the workflow runs `npm ci` and `npm run build:css`.
- The built site (repository root, including `assets/tailwind.css`) is pushed to the `gh-pages` branch.

After you push these changes, enable GitHub Pages in the repository settings and set the source to the `gh-pages` branch (root). The workflow uses the automatically provided `GITHUB_TOKEN` so no extra secrets are required.
