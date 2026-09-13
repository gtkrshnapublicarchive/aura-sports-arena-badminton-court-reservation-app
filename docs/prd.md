> **FICTIONAL CONTENT DISCLAIMER**
> Everything in this document is entirely fictional and used solely as a case study / template example. This includes, but is not limited to: the brand name ("Aura Sports Arena"), the location/address ("12 Veloce Boulevard, Aurelia City"), all names of people (players, court marshals, personas), and the currency ("Aurum" / AUR). None of these refer to any real business, real place, real person, or real currency. Any resemblance to actual entities is purely coincidental.

---

### Category: Badminton Court Reservation

# Product Requirements Document (PRD)
## Badminton Court Reservation App: Aura Sports Arena

**Category:** Badminton Court Reservation
**Document Version:** 1.0
**Status:** Draft
**Date:** September 12, 2026
**Product Type:** Internal/dedicated application for a single sports arena (not a SaaS/multi-tenant product)

---

## 1. Overview

### 1.1 Arena Identity (Fictional Case Study)
This document is written for the operational requirements of **Aura Sports Arena**, a fictional indoor racket sports center used as a case study:

| Attribute | Detail |
|---|---|
| Arena Name | Aura Sports Arena |
| Location | 12 Veloce Boulevard, Aurelia City (fictional) |
| Number of Badminton Courts | 4 synthetic rubber courts (Court 1 through Court 4) |
| Operating Hours | Monday - Sunday, 07:00 - 23:00 (local time) |
| Active Staff Count | 3 shift court marshals + 1 facility manager |
| Currency | Aurum (AUR), a fictional currency used for court rates and rental equipment |

### 1.2 Product Name
Aura Sports Arena Court Reservation System: an internal web application built specifically for this single sports center's court scheduling and desk operations.

### 1.3 Important Note: Not a SaaS Product
This application is **not a multi-tenant SaaS product** intended to be marketed to multiple commercial sports complexes. It is tailored **exclusively for Aura Sports Arena**:
- There is no concept of a "tenant" or "arena account"; a single instance of the application exists for this facility.
- Court inventories, lighting schedules, opening hours, and equipment add-ons are directly configured for Aura Sports Arena.
- No facility onboarding flows, white-labeling engines, or subscription tiers are required.
- Visual styling and nomenclature adhere directly to Aura Sports Arena brand standards.

### 1.4 Background
Aura Sports Arena provides 4 indoor badminton courts with tournament-grade LED lighting and synthetic shock-absorbing flooring. Currently, court scheduling is conducted manually via instant messaging and phone calls, resulting in:
- Double-booking conflicts during prime evening hours (18:00 - 22:00).
- Court marshals manually switching lighting circuits without a centralized reservation sheet.
- High no-show rates without advance notice, leaving prime court slots idle.
- Lack of clear historical metrics regarding peak demand and racket rental volume.

### 1.5 Goals
- Allow badminton players to view real-time court schedules and reserve 1-hour time blocks online.
- Enable court marshals to manage daily court allocations, verify player check-ins, and control court lighting schedules.
- Support optional equipment rental selection (rackets and shuttlecock tubes) attached to court bookings.
- Eliminate double-booking errors across all 4 courts.

### 1.6 Non-Goals
- This application does NOT include an integrated automated payment gateway in version 1; all bookings are held in the system and payment settlement in AUR occurs at the reception desk upon player check-in.
- This application does NOT support other sports (such as tennis or futsal) or additional branch locations.
- This application does NOT include a public player matchmaking or tournament bracket ladder engine.

---

## 2. Problem Statement

### 2.1 Problems to Solve
- Players travel to the arena without certainty of court availability, often finding all 4 courts occupied.
- Court marshals spend significant shift time answering repetitive messaging queries regarding court availability.
- No automated validation exists to enforce consecutive hour booking limits, leading to court monopolization by individual teams.
- Unattended court reservations prevent walk-in players from utilizing vacant slots.

### 2.2 Supporting Insights
- Peak hours occur on weekday evenings (18:00 - 22:00) and throughout weekends (08:00 - 20:00).
- Evening players frequently request rental equipment at the counter without advance preparation, causing check-in counter congestion.

---

## 3. Target Users & Personas

### 3.1 User Roles
This application serves **two primary user roles**:

| Role | Description |
|---|---|
| Player | A badminton player who reserves court slots and manages their bookings |
| Court Marshal / Admin | An arena employee who manages court assignments, check-ins, and daily desk operations |

### 3.2 Personas

**Persona 1 (Player): Julian, 29, Amateur League Player**
- Plays badminton twice weekly with colleagues after work hours.
- Requires instant visual visibility of court availability for weekday 19:00 - 21:00 slots before organizing his group.
- Books via mobile browser during lunch breaks and cancels early if teammates cannot attend.

**Persona 2 (Court Marshal): Tariq, 23, Shift Marshal**
- Manages the reception desk, distributes rental rackets, and ensures games conclude on schedule.
- Needs a centralized high-density dashboard showing who occupies each of the 4 courts at any given hour.
- Needs rapid single-click actions to mark check-in, record no-shows, and release abandoned courts.

### 3.3 Key Use Cases
- Player: Check court slot availability, book court with optional racket add-ons, view upcoming reservations, cancel reservation.
- Court Marshal / Admin: View daily 4-court schedule board, check in arriving players, record no-shows, toggle court maintenance status.

---

## 4. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Online Booking Share | At least 75% of total court reservations booked online within 60 days | (Online reservations) / (Total completed reservations) |
| Double-Booking Incidents | 0 occurrences | System scheduling conflict log audit |
| Check-in Processing Time | Reduced to under 30 seconds per arriving party | Front desk time tracking survey |
| Unattended No-Show Rate | Maintained under 10% of total bookings | (No-show marked reservations) / (Total reservations) |

---

## 5. Requirements / Specifications

### 5.1 Functional Requirements for Players

1. **Authentication & Profile**
   - Players can register with email, phone number, and password.
   - Players can log in and log out with secure session persistence.
   - Players can update their display name and contact phone number.

2. **Court Availability Calendar**
   - Players can select a date (up to 7 days in advance) to view the 4-court availability grid.
   - Court status is clearly presented in 1-hour increments: Available / Reserved / Maintenance.
   - Clear distinction between standard off-peak hours and peak evening hours (18:00 - 22:00).

3. **Booking Submission**
   - Players select date, court number (Court 1 - Court 4), and time slot (minimum 1 hour, maximum 2 consecutive hours per day).
   - Players can optionally attach rental items: Rackets (quantity 0 to 4) and Shuttlecock Tubes (quantity 0 to 2).
   - System recalculates total estimated counter settlement in AUR.
   - Strict server-side concurrency check locks the selected court slot before confirmation.

4. **Self-Service Booking Management**
   - Players can view active upcoming reservations and past history.
   - Players can cancel an upcoming booking up to 2 hours prior to the scheduled start time.
   - Players cannot inspect or alter bookings belonging to other players.

### 5.2 Functional Requirements for Court Marshals / Admin

1. **Staff Authentication**
   - Marshals log in via a dedicated staff portal route with isolated staff role credentials.

2. **Master Court Schedule Board**
   - High-density matrix displaying all 4 courts horizontally across hourly operational rows (07:00 to 23:00).
   - Real-time color indicators for slot statuses: Vacant, Booked, Checked-In, Completed, Cancelled, Maintenance.
   - Hover and click inspection showing player name, phone contact, and requested rental gear.

3. **Front Desk Check-In & Overrides**
   - Marshals mark players as "Checked-In" upon counter arrival and gear handover.
   - Marshals mark bookings as "No-Show" if players fail to arrive within 15 minutes of the hour, immediately freeing the court for walk-in players.
   - Marshals can create walk-in manual reservations directly on the master schedule.

4. **Court Maintenance Management**
   - Facility managers can lock any court (or specific hourly blocks) for mat cleaning or lighting maintenance.

### 5.3 Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Court availability grid must render within 1.5 seconds under standard broadband and 4G connections |
| Scalability | System must support concurrent browsing of 100 players during evening schedule release windows |
| Concurrency Control | ACID row-level locking (`SELECT ... FOR UPDATE`) prevents simultaneous booking of identical court slots |
| Security | Player contact data encrypted at rest; strict session expiration (30 days player, 8 hours staff) |
| Compatibility | Full mobile responsiveness for player view; optimized widescreen layout for front desk marshal desktop |
| Availability | 99.5% uptime during operating hours (07:00 - 23:00) |

### 5.4 Technology Stack Specification

| Layer / Component | Technology Choice | Version / Tooling | Architectural Rationale |
|---|---|---|---|
| Fullstack Framework | Next.js | 15+ (App Router) | React Server Components (RSC) for instantaneous schedule rendering; Server Actions for atomic booking mutations. |
| Language & Runtime | TypeScript / Node.js | TypeScript 5+ / Node.js 22 LTS | End-to-end static type contracts from database schema to UI components. |
| UI & Styling Engine | Tailwind CSS | 4.x | Utility-first responsive styling with clean sports-matrix layout and neutral editorial palettes. |
| Relational Database | PostgreSQL | 16+ Alpine | Native transactional concurrency and row-level locking essential to prevent court double-booking race conditions. |
| ORM & Data Layer | Prisma ORM | Latest Stable | Type-safe migrations, declarative relational models, and automated seeding of the 4 arena courts. |
| Containerization | Docker & Docker Compose | Docker Compose v2 | Reproducible multi-stage container orchestration pairing web runtime with healthchecked PostgreSQL. |
| Validation & Contracts | Zod | 3.x | Strict boundary validation on reservation dates, consecutive hour constraints, and rental counts. |
| Authentication | NextAuth.js / Auth.js | 5.x | Cookie-based JWT sessions with distinct role assertions for Player and Marshal accounts. |

#### Architectural Decisions
- **Fullstack Next.js Monolith:** Consolidates customer booking interfaces and marshal operational tooling into a single codebase, eliminating dual-service coordination overhead.
- **PostgreSQL Row-Level Locking:** All booking Server Actions execute inside an explicit Prisma transaction with row-level locks on the specific court-hour tuple, eliminating race conditions when multiple players attempt simultaneous checkout.

---

## 6. Access Control & Permission Matrix

### 6.1 Page Access Matrix

| Page / Feature | Guest (Unauthenticated) | Player | Court Marshal / Admin |
|---|---|---|---|
| Landing & Arena Info Page | [Allowed] Visible | [Allowed] Visible | [Denied] Redirected to Marshal Console |
| Court Availability Grid | [Allowed] View Only | [Allowed] View & Book | [Denied] Not in staff navigation |
| Court Booking Checkout | [Denied] Redirects to Login | [Allowed] Full Access | [Denied] Staff use walk-in booking tool |
| My Bookings History | [Denied] Not Available | [Allowed] Own Records Only | [Denied] Staff use Master Schedule |
| Master Schedule Board | [Denied] Not Available | [Denied] Excluded from DOM | [Allowed] Full Access |
| Front Desk Check-in Action | [Denied] Not Available | [Denied] Excluded from DOM | [Allowed] Full Access |
| Court Maintenance Lockout | [Denied] Not Available | [Denied] Excluded from DOM | [Allowed] Full Access |

### 6.2 Mandatory Principles
- **DOM Exclusion:** Elements linking to Marshal screens are completely omitted from the Player DOM, never merely concealed via CSS.
- **Zero Normal Access-Denied Loops:** Legitimate navigation paths never lead to access denial; unauthorized URL attempts trigger a prompt redirect.
- **Two-Layer Validation:** UI visibility checks are coupled with server-side session role verification inside every Server Action.
- **Anti-IDOR Protection:** Players can access only reservations associated with their own user ID; querying foreign reservation IDs yields an explicit 404 response.

### 6.3 Acceptance Criteria Related to Access
- Player users attempting direct navigation to `/marshal/schedule` are intercepted and redirected to `/login` without exposing court schedule telemetry.
- Mutation endpoints for check-in and maintenance lockout reject any payload not backed by a verified Marshal session.

---

## 7. User Flow (Text Description)

### 7.1 Player Flow: Reserving a Badminton Court
1. Player opens the Aura Sports Arena application.
2. Player logs in with their registered credentials.
3. Player navigates to the "Book a Court" schedule grid.
4. Player selects a date and clicks an "Available" 1-hour slot on Court 1, 2, 3, or 4.
5. Player optionally selects an adjacent consecutive hour (if available, max 2 hours total).
6. Player selects optional rental gear (e.g., 2 Rackets, 1 Shuttlecock Tube).
7. Player reviews reservation summary and counter balance notice in AUR.
8. System executes transactional validation to verify slot availability.
9. If available: reservation is persisted with status `Booked`, and a digital booking voucher is presented.
10. If conflicted: player is informed that the slot was claimed and is prompted to choose another slot.

### 7.2 Player Flow: Cancelling a Reservation
1. Player logs in and navigates to "My Bookings".
2. Player views active upcoming court reservations.
3. Player clicks "Cancel Reservation" on a target booking.
4. System verifies that current time is at least 2 hours prior to scheduled court start time.
5. If valid: status updates to `Cancelled`, freeing the court slot immediately for other players.
6. If within 2 hours: cancellation is disallowed and system advises contacting arena marshals directly.

### 7.3 Marshal Flow: Check-in and No-Show Handling
1. Marshal logs in to the Master Schedule Board at the reception desk.
2. Marshal views today's schedule column for Court 1 through Court 4.
3. Arriving player presents their name or booking reference.
4. Marshal clicks "Check-In" on the slot, issues rental gear, and collects counter settlement in AUR.
5. If player has not arrived 15 minutes past start time: marshal clicks "Mark No-Show", which cancels the held booking and re-opens the court slot for walk-in patrons.

---

## 8. Prohibited Flows / Anti-Patterns

1. **Over-Quota Reservation:** A player attempting to book more than 2 consecutive hours on a single day is rejected with a validation error.
2. **Post-Deadline Cancellation:** A player cancelling less than 2 hours before game time is blocked by the application.
3. **Double Allocation:** Two concurrent sessions booking the exact same court-hour combination must never both receive confirmation.
4. **Maintenance Override by Player:** Players booking courts tagged as `Maintenance` is strictly prevented at database level.

---

## 9. Scope

### 9.1 In-Scope (Version 1 / MVP)
- Online schedule grid for 4 badminton courts across daily 07:00 - 23:00 hours.
- 1-hour time-slot booking engine with max 2 consecutive hours enforcement.
- Equipment rental selection (rackets, shuttlecock tubes) linked to bookings.
- Player self-service cancellation window (up to 2 hours prior).
- Staff Master Schedule Board with live status toggling (Checked-In, No-Show, Maintenance).
- Local containerized deployment with PostgreSQL and seeded court data.

### 9.2 Out-of-Scope (Future Versions)
- Automated online payment gateway integrations.
- Multi-branch sports complex management.
- Ladder leagues, tournament matchmaking, and automated scoreboards.
- SMS gateway integration (in-app notifications and email summaries only).

---

## 10. Dependencies & Constraints

### 10.1 Dependencies
- Pre-seeded court data for Court 1, Court 2, Court 3, and Court 4.
- Standard Node.js LTS and Docker Compose environment.

### 10.2 Constraints
- Single physical facility scope; all court allocations operate in the single local time zone of Aurelia City.
- Operating hours are fixed at 07:00 to 23:00 daily; off-hours bookings are rejected by validation logic.

---

## 11. Development Phases (Sequential, Not Time-Boxed)

| Order | Phase | Description | Completion Criteria |
|---|---|---|---|
| Phase 1 | Schema & Seed Foundation | Define Prisma models for Courts, Slots, Bookings, and RentalItems with seed scripts for the 4 courts | Seed script initializes 4 courts and operating hours cleanly in PostgreSQL |
| Phase 2 | Authentication & Role Guards | Implement NextAuth.js session handling with Player and Marshal role segregation | Route middleware blocks unauthorized role access and DOM excludes restricted links |
| Phase 3 | Player Schedule & Booking Engine | Construct interactive 4-court schedule board with transactional Server Actions | Player can book 1 to 2 consecutive court hours with atomic conflict prevention |
| Phase 4 | Equipment Add-ons & Self-Service | Integrate racket/shuttlecock options and player reservation cancellation logic | Player can attach rental items and cancel bookings outside the 2-hour window |
| Phase 5 | Marshal Command Console | Build reception desk Master Schedule Board with check-in, no-show, and maintenance actions | Marshals can toggle slot states in real time and execute walk-in bookings |
| Phase 6 | End-to-End Orchestration & Testing | Package containerized Docker Compose stack with healthchecks and write regression test suites | Single shell script spins up pristine container stack passing all concurrency tests |

---

## 12. Risks & Open Questions

### 12.1 Risks
- **High Concurrency Contention:** Multiple players attempting to claim the same Friday evening slot simultaneously. *Mitigation:* Explicit row-level database locking inside transaction boundary.
- **Walk-in Desynchronization:** Marshals forgetting to record walk-in games, causing online players to book physically occupied courts. *Mitigation:* Frictionless 1-click walk-in reservation button on marshal dashboard.

### 12.2 Open Questions
- Should repeat no-show players be automatically throttled from booking future weekend peak slots? (Deferred to policy review post-launch).

---

## 13. Stakeholders

| Role | Responsibility |
|---|---|
| Product Lead | Defines functional requirements, user flows, and operational boundaries |
| Fullstack Engineer | Implements Next.js application, Prisma schema, Server Actions, and UI components |
| QA Engineer | Authors automated concurrency test suites and validates role access matrices |
| Arena Operations Manager | Verifies operational alignment with reception desk workflows and court marshals |
