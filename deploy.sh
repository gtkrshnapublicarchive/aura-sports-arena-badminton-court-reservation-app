#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════════════════════════════"
echo "   Aura Sports Arena - Single-Enter Deployment Engine          "
echo "═══════════════════════════════════════════════════════════════"

# 1. Prepare Environment
if [ ! -f .env ]; then
  echo "[*] Initializing .env from .env.example..."
  cp .env.example .env
fi

# 2. Spin up containerized PostgreSQL on port 5434
echo "[*] Launching containerized PostgreSQL database (aura_postgres)..."
docker compose up -d postgres

# 3. Healthcheck wait loop
echo "[*] Waiting for PostgreSQL database readiness..."
MAX_RETRIES=30
RETRY_COUNT=0
until docker inspect --format='{{json .State.Health.Status}}' aura_postgres 2>/dev/null | grep -q '"healthy"'; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "[x] Database failed to achieve healthy status within timeout."
    exit 1
  fi
  sleep 1
done
echo "[OK] PostgreSQL is healthy on port 5434."

# 4. Dependency installation & Prisma schema sync
echo "[*] Syncing Prisma schema with PostgreSQL database..."
npx prisma db push --skip-generate
npx prisma generate

# 5. Database seeding
echo "[*] Seeding 4 synthetic rubber courts and schedule slots..."
npx tsx prisma/seed.ts

# 6. Production build verification
echo "[*] Compiling Next.js 16 production build..."
npm run build

echo "───────────────────────────────────────────────────────────────"
echo "[OK] Deployment successfully verified and ready."
echo "     Application URL: http://localhost:3000"
echo "     Health Endpoint: http://localhost:3000/api/health"
echo "     Staff Gateway:   http://localhost:3000/marshal/login"
echo "     Staff Account:   marshal@aura.local / password123"
echo "     Player Account:  julian@example.com / password123"
echo "═══════════════════════════════════════════════════════════════"
