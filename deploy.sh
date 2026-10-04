#!/usr/bin/env bash
# Build the app and copy the output to the repository root so GitHub Pages
# can serve it from the main branch. This script does not commit or push.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT/client"
npm install
npm run build

# Remove the previous build before copying the new one so stale hashed files do not pile up.
rm -rf "$ROOT/assets" "$ROOT/index.html" "$ROOT/favicon.svg" "$ROOT/vite.svg"
cp -R "$ROOT/client/dist/." "$ROOT/"

echo "Copied client/dist to the repository root."
echo "Review with 'git status', then commit and push when ready."
