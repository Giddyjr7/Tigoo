#!/usr/bin/env bash
# Sets VITE_API_BASE_URL on Vercel (production + preview) and triggers a
# rebuild, so the deployed frontend picks up the live Render backend URL.
#
# Vite bakes VITE_* vars in at build time, so adding the var alone isn't
# enough — this script also redeploys.
#
# Required env vars (set these in your shell before running, do not hardcode them here):
#   VERCEL_TOKEN       - Personal Access Token: https://vercel.com/account/tokens
#   VERCEL_ORG_ID       - Settings > General on your Vercel team/account
#   VERCEL_PROJECT_ID   - Settings > General on the "tigoo" Vercel project
#
# Usage:
#   export VERCEL_TOKEN=xxxxx
#   export VERCEL_ORG_ID=xxxxx
#   export VERCEL_PROJECT_ID=xxxxx
#   ./scripts/set-vercel-env.sh

set -euo pipefail

: "${VERCEL_TOKEN:?Set VERCEL_TOKEN first (https://vercel.com/account/tokens)}"
: "${VERCEL_ORG_ID:?Set VERCEL_ORG_ID first (Vercel project Settings > General)}"
: "${VERCEL_PROJECT_ID:?Set VERCEL_PROJECT_ID first (Vercel project Settings > General)}"

API_BASE_URL="${1:-https://tigoo.onrender.com}"

for ENVIRONMENT in production preview; do
  echo "Setting VITE_API_BASE_URL ($ENVIRONMENT) = $API_BASE_URL"
  # Remove any existing value first so this script is safely re-runnable.
  npx vercel env rm VITE_API_BASE_URL "$ENVIRONMENT" --yes --token="$VERCEL_TOKEN" >/dev/null 2>&1 || true
  echo "$API_BASE_URL" | npx vercel env add VITE_API_BASE_URL "$ENVIRONMENT" --token="$VERCEL_TOKEN"
done

echo "Triggering production rebuild so the new env var takes effect..."
npx vercel --prod --yes --token="$VERCEL_TOKEN"

echo "Done."
