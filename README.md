# Aura Sports Arena - Badminton Court Reservation System

> **Fictional Case Study Disclaimer**
> Aura Sports Arena, Aurelia City (12 Veloce Boulevard), Aurum (AUR) currency, court marshals, and all user personas described in this project are entirely fictional case study entities.

---

## 1. Executive Summary

Aura Sports Arena is an internal fullstack web application built specifically for a dedicated 4-court indoor racket sports facility. It replaces manual phone and messaging scheduling with an automated, concurrency-controlled booking engine and reception desk management board.

* **Facility Scope:** 4 tournament-grade synthetic rubber courts (Court 1 through Court 4).
* **Operating Hours:** Daily 07:00 - 23:00 (16 hourly booking slots per day).
* **Currency:** Aurum (AUR) - online reservations are held with zero credit card transaction fees and settled physically at the reception desk upon check-in.
* **Architecture:** Fullstack Next.js 16 monolith (App Router, Turbopack) with PostgreSQL row-level locks.

---

## 2. Technology Stack

* **Framework:** Next.js 16 (React Server Components, Server Actions, Turbopack)
* **Language:** TypeScript 5.8+ / Node.js 22 LTS
* **Database & ORM:** PostgreSQL 16 Alpine + Prisma ORM 6.12.0
* **Styling & Design System:** Tailwind CSS 4.x adhering to Warm Editorial Light (`#fbfbfa` canvas, Fraunces serif display, DM Sans UI, solid `#252724` buttons, 1px hairline borders, `#5a8357` organic sage accents)
* **Authentication:** Stateless cookie-based JWT sessions (`jose` + `bcryptjs`) with strict role segregation
* **Containerization:** Docker Compose v2 multi-stage containers with healthchecks

---

## 3. Core Business Rules & Concurrency Controls

1. **Zero Double-Booking Guarantee:**
   All court booking Server Actions execute within a serializable PostgreSQL transaction utilizing `SELECT ... FOR UPDATE` row-level locks across the requested court-hour slots.
2. **Consecutive Hours Enforcement:**
   Players can book 1 hour or a maximum of 2 adjacent consecutive hours per transaction.
3. **Daily Player Quota:**
   Players are capped at a maximum of 2 hours per calendar day across all courts to eliminate hoarding.
4. **Self-Service Cancellation Window:**
   Players may cancel an upcoming booking up to 2 hours prior to start time. Within 2 hours, cancellations are locked and require front desk marshal assistance.
5. **Anti-IDOR Protection:**
   Players can only access and cancel their own reservations; foreign reservation queries return 404 responses.
6. **No-Show Release Protocol:**
   If a player has not arrived within 15 minutes past start time, court marshals can trigger a 1-click "Mark No-Show" action that frees the court slot immediately for waiting walk-in players.
7. **Maintenance Lockouts:**
   Facility managers and marshals can lock specific court-hour blocks for mat disinfection or LED lighting maintenance, immediately preventing player bookings.
8. **Staff Portal Public Isolation:**
   Staff/marshal authentication interfaces are completely segregated to `/marshal/login`. Public player login screens (`/login`) contain zero staff tabs or credentials, and server actions reject non-player logins through public forms.

---

## 4. Single-Enter Shell Orchestration

The application contains self-contained shell bundles allowing full setup, redeployment, and testing:

### Deploy pristine stack
```bash
./deploy.sh
```
* Spins up containerized PostgreSQL on port `5434:5432`.
* Executes database healthcheck wait loop until healthy.
* Synchronizes Prisma schema and seeds 4 courts, rental catalog, test accounts, and 448 hourly slots across 7 days.
* Verifies Next.js 16 production build.

### Redeploy stack
```bash
./redeploy.sh
```

### Run automated test suite
```bash
./test.sh
```
* Executes TypeScript type checking.
* Validates database container readiness.
* Runs 15/15 automated concurrency, anti-IDOR, and business rule regression tests.

---

## 5. Seeded Test Credentials

| Role | Email | Password | Access Path |
|---|---|---|---|
| Player | `julian@example.com` | `password123` | `/login` -> `/schedule` |
| Player | `maya@example.com` | `password123` | `/login` -> `/schedule` |
| Shift Marshal | `marshal@aura.local` | `password123` | `/marshal/login` -> `/marshal` |
| Facility Manager | `manager@aura.local` | `password123` | `/marshal/login` -> `/marshal` |

---

## 6. Project Directory Structure

```
.
├── deploy.sh                  # Single-enter deployment script
├── redeploy.sh                # Zero-friction redeployment script
├── test.sh                    # Automated regression & concurrency test runner
├── docker-compose.yml         # Containerized PostgreSQL 16 Alpine
├── Dockerfile                 # Multi-stage production container build
├── docs/
│   └── prd.md                 # Product Requirements Document
├── prisma/
│   ├── schema.prisma          # Database schema (Courts, Slots, Bookings, Rentals, Users)
│   └── seed.ts                # Seed script for 4 courts, users, and 7-day schedule
├── src/
│   ├── app/                   # Next.js 16 App Router pages
│   │   ├── (player)/          # Player routes (schedule, my-bookings, profile)
│   │   ├── (marshal)/         # Staff routes (marshal master board, marshal login)
│   │   ├── api/health/        # Container readiness healthcheck endpoint
│   │   └── page.tsx           # Editorial landing page
│   ├── components/ui/         # Atomic UI primitives (button, badge, input, select, navbar)
│   ├── core/                  # Core auth (JWT, guards, session) and database client
│   ├── features/              # Semantic feature modules (auth, bookings, courts, marshal, profile, rentals)
│   └── proxy.ts               # Next.js 16 route proxy and access guards
└── tests/
    └── concurrency-and-rules.test.ts # Automated test runner (15 test suites)
```