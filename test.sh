#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════════════════════════════"
echo "   Aura Sports Arena - Quality & Concurrency Test Runner       "
echo "═══════════════════════════════════════════════════════════════"

echo "[*] Step 1: TypeScript type checking..."
npx tsc --noEmit
echo "[OK] TypeScript validation passed."

echo "[*] Step 2: Database healthcheck..."
docker inspect --format='{{json .State.Health.Status}}' aura_postgres 2>/dev/null | grep -q '"healthy"' || {
  echo "[*] Database container not running or unhealthy. Starting..."
  docker compose up -d postgres
  sleep 3
}
echo "[OK] PostgreSQL container verified."

echo "[*] Step 3: Concurrency & Business Rules Test Suite..."
npx tsx tests/concurrency-and-rules.test.ts

echo "───────────────────────────────────────────────────────────────"
echo "[OK] All regression and concurrency test suites PASSED."
echo "═══════════════════════════════════════════════════════════════"
