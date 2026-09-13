#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════════════════════════════"
echo "   Aura Sports Arena - Zero-Friction Redeployment Script       "
echo "═══════════════════════════════════════════════════════════════"

ACTIVE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "[*] Active branch: ${ACTIVE_BRANCH}"

echo "[*] Resetting untracked artifacts..."
git reset --hard HEAD || true

echo "[*] Tearing down running containers..."
docker compose down || true

echo "[*] Triggering fresh deployment..."
bash deploy.sh
