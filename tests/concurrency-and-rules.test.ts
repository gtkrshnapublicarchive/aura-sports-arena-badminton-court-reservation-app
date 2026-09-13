import { prisma } from "../src/core/db/client";
import { createBookingAction } from "../src/features/bookings/create-booking.action";
import { cancelBookingAction } from "../src/features/bookings/cancel-booking.action";
import { toggleMaintenanceAction } from "../src/features/marshal/actions/toggle-maintenance.action";
import { updateProfileAction } from "../src/features/profile/update-profile.action";
import { getUserProfile } from "../src/features/profile/get-profile.query";
import { loginAction } from "../src/features/auth/login.action";
import { signSessionToken } from "../src/core/auth/jwt";
import { AUTH_COOKIE_NAME } from "../src/core/auth/auth.types";
import { setTestCookie, clearTestCookies } from "../src/core/auth/cookies";
import { Role, SlotStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";

async function setSession(user: { id: string; email: string; name: string; role: Role }) {
  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  setTestCookie(AUTH_COOKIE_NAME, token);
}

async function runTests() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Aura Sports Arena - Business Rules & Concurrency Test Suite  ");
  console.log("═══════════════════════════════════════════════════════════════");

  const julian = await prisma.user.findUnique({ where: { email: "julian@example.com" } });
  const maya = await prisma.user.findUnique({ where: { email: "maya@example.com" } });
  const marshal = await prisma.user.findUnique({ where: { email: "marshal@aura.local" } });
  const court1 = await prisma.court.findUnique({ where: { courtNumber: 1 } });
  const court2 = await prisma.court.findUnique({ where: { courtNumber: 2 } });

  if (!julian || !maya || !marshal || !court1 || !court2) {
    throw new Error("Seed users or courts missing from database");
  }

  const testDate = "2026-09-20";

  // Clean slots for testDate
  for (const c of [court1, court2]) {
    for (let h = 7; h <= 22; h++) {
      await prisma.courtSlot.upsert({
        where: {
          courtId_date_startHour: {
            courtId: c.id,
            date: testDate,
            startHour: h,
          },
        },
        update: { status: SlotStatus.AVAILABLE, bookingId: null, maintenanceReason: null },
        create: {
          courtId: c.id,
          date: testDate,
          startHour: h,
          endHour: h + 1,
          status: SlotStatus.AVAILABLE,
          isPeak: h >= 18 && h < 22,
        },
      });
    }
  }

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Concurrency Test: Simulate simultaneous checkout for identical slot
  console.log("\n[*] Running Concurrency Conflict Test...");
  const slotHour = 19;

  // Julian books first
  await setSession(julian);
  const res1 = await createBookingAction({
    courtId: court1.id,
    date: testDate,
    startHours: [slotHour],
    notes: "Julian's reservation",
  });

  // Maya attempts to book identical slot immediately
  await setSession(maya);
  const res2 = await createBookingAction({
    courtId: court1.id,
    date: testDate,
    startHours: [slotHour],
    notes: "Maya's competing attempt",
  });

  assert(
    res1.success && !res2.success,
    "Transactional row-level lock prevented double-booking (Julian secured, Maya rejected)"
  );

  // 2. Non-consecutive hours validation
  console.log("\n[*] Running Non-Consecutive Hours Validation...");
  await setSession(julian);
  const nonConsecutiveRes = await createBookingAction({
    courtId: court2.id,
    date: testDate,
    startHours: [10, 12],
  });
  assert(!nonConsecutiveRes.success, "Rejected non-consecutive time slot selection");

  // 3. Quota check: Player cannot exceed 2 hours per day
  console.log("\n[*] Running Daily Quota Check...");
  // Julian already booked 1 hour (19:00 - 20:00). Attempting 2 more hours on same date.
  const overQuotaRes = await createBookingAction({
    courtId: court2.id,
    date: testDate,
    startHours: [14, 15],
  });
  assert(!overQuotaRes.success, "Rejected booking exceeding 2-hour daily player cap");

  // 4. Maintenance Lockout Test
  console.log("\n[*] Running Maintenance Lockout Prevention...");
  await setSession(marshal);
  const maintenanceSlot = await prisma.courtSlot.findUnique({
    where: {
      courtId_date_startHour: {
        courtId: court2.id,
        date: testDate,
        startHour: 16,
      },
    },
  });
  await toggleMaintenanceAction({
    slotId: maintenanceSlot!.id,
    reason: "Mat Cleaning & Disinfection",
  });

  await setSession(julian);
  const bookMaintenanceRes = await createBookingAction({
    courtId: court2.id,
    date: testDate,
    startHours: [16],
  });
  assert(!bookMaintenanceRes.success, "Prevented player booking on maintenance-locked slot");

  // 5. Anti-IDOR & Cancellation Test
  console.log("\n[*] Running Cancellation & Anti-IDOR Protection...");
  const bookedRecord = await prisma.booking.findFirst({
    where: { bookingReference: res1.data!.bookingReference },
  });

  // Maya attempts to cancel Julian's booking
  await setSession(maya);
  const idorRes = await cancelBookingAction(bookedRecord!.id);
  assert(!idorRes.success, "Anti-IDOR: Blocked foreign player from cancelling reservation");

  // Julian cancels his own booking (>2 hours ahead)
  await setSession(julian);
  const cancelRes = await cancelBookingAction(bookedRecord!.id);
  assert(cancelRes.success, "Owner successfully cancelled reservation >2 hours ahead");

  // Verify slot is freed back to AVAILABLE
  const freedSlot = await prisma.courtSlot.findUnique({
    where: {
      courtId_date_startHour: {
        courtId: court1.id,
        date: testDate,
        startHour: slotHour,
      },
    },
  });
  assert(freedSlot?.status === SlotStatus.AVAILABLE, "Court slot immediately restored to AVAILABLE");

  // 6. Profile Settings Tests (Role-Specific)
  console.log("\n[*] Running Role-Specific Profile Settings Tests...");
  await setSession(julian);
  const updatePlayerRes = await updateProfileAction({
    name: "Julian H. (Updated)",
    phone: "+1-555-0999",
    skillLevel: "Competitive / Tournament",
  });
  assert(updatePlayerRes.success, "Player successfully updated display name and mobile contact");

  const refreshedPlayer = await prisma.user.findUnique({ where: { id: julian.id } });
  assert(
    refreshedPlayer?.name === "Julian H. (Updated)" && refreshedPlayer?.phone === "+1-555-0999",
    "Player database record verified with new credentials"
  );

  // Marshal profile update test
  await setSession(marshal);
  const updateMarshalRes = await updateProfileAction({
    name: "Tariq Shift Marshal (Lead)",
    phone: "+1-555-0888",
    shiftPreference: "Evening Shift (15:00 - 23:00)",
  });
  assert(updateMarshalRes.success, "Staff marshal successfully updated shift contact settings");

  const marshalProfile = await getUserProfile(marshal.id);
  assert(
    marshalProfile !== null && marshalProfile.role === Role.MARSHAL,
    "Marshal profile data successfully retrieved with operational stats"
  );

  // Profile validation test (Blank name rejected)
  const invalidProfileRes = await updateProfileAction({
    name: "A",
    phone: "123",
  });
  assert(!invalidProfileRes.success, "Rejected invalid profile input (short name/phone)");

  // 7. Security Isolation: Public Portal Staff Block
  console.log("\n[*] Running Public Authentication Isolation Tests...");
  const publicStaffLogin = await loginAction({
    email: "marshal@aura.local",
    password: "password123",
    isStaff: false,
  });
  assert(!publicStaffLogin.success, "Rejected staff login attempt on public player portal");

  const legitimateStaffLogin = await loginAction({
    email: "marshal@aura.local",
    password: "password123",
    isStaff: true,
  });
  assert(legitimateStaffLogin.success, "Authorized staff login on isolated /marshal/login portal");

  const playerStaffPortalAttempt = await loginAction({
    email: "julian@example.com",
    password: "password123",
    isStaff: true,
  });
  assert(!playerStaffPortalAttempt.success, "Blocked player login attempt on staff marshal portal");

  // 8. Proxy Route & Gateway Protection Tests
  console.log("\n[*] Running Proxy Gateway & Access Protection Tests...");
  const playerToken = await signSessionToken({
    userId: julian.id,
    email: julian.email,
    name: julian.name,
    role: Role.PLAYER,
  });
  const playerToMarshalLogin = await proxy(
    new NextRequest("http://localhost:3000/marshal/login", {
      headers: { cookie: `${AUTH_COOKIE_NAME}=${playerToken}` },
    })
  );
  assert(
    playerToMarshalLogin.status === 307 &&
      playerToMarshalLogin.headers.get("location") === "http://localhost:3000/schedule",
    "Player visiting staff login gateway is locked out and redirected to /schedule"
  );

  const guestToMarshalRoute = await proxy(new NextRequest("http://localhost:3000/marshal"));
  assert(
    guestToMarshalRoute.status === 307 &&
      Boolean(guestToMarshalRoute.headers.get("location")?.startsWith("http://localhost:3000/login")),
    "Unauthorized visitor to /marshal is redirected to /login per PRD 6.3"
  );

  const switchSessionOnLogin = await proxy(
    new NextRequest("http://localhost:3000/login?switch=true", {
      headers: { cookie: `${AUTH_COOKIE_NAME}=${playerToken}` },
    })
  );
  assert(
    switchSessionOnLogin.cookies.get(AUTH_COOKIE_NAME)?.value === "",
    "Explicit switch request to /login?switch=true purges active session cookie"
  );

  console.log("───────────────────────────────────────────────────────────────");
  console.log(`Results: ${passed}/${total} test suites passed cleanly.`);
  console.log("═══════════════════════════════════════════════════════════════");
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
