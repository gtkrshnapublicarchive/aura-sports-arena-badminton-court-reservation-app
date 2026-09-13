import { PrismaClient, Role, SlotStatus, ItemType, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { format, addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("[*] Seeding Aura Sports Arena database...");

  // 1. Seed Courts
  const courtData = [
    { courtNumber: 1, name: "Court 1", surfaceType: "Synthetic Shock-Absorbing Rubber", hourlyRate: 50 },
    { courtNumber: 2, name: "Court 2", surfaceType: "Synthetic Shock-Absorbing Rubber", hourlyRate: 50 },
    { courtNumber: 3, name: "Court 3", surfaceType: "Synthetic Shock-Absorbing Rubber", hourlyRate: 50 },
    { courtNumber: 4, name: "Court 4", surfaceType: "Synthetic Shock-Absorbing Rubber", hourlyRate: 50 },
  ];

  const courts = [];
  for (const c of courtData) {
    const court = await prisma.court.upsert({
      where: { courtNumber: c.courtNumber },
      update: { name: c.name, surfaceType: c.surfaceType, hourlyRate: c.hourlyRate },
      create: c,
    });
    courts.push(court);
  }
  console.log(`[OK] Seeded ${courts.length} courts.`);

  // 2. Seed Rental Items
  const rentalData = [
    { name: "Pro Tournament Racket", itemType: ItemType.RACKET, ratePerUnit: 10, maxQuantityPerBooking: 4 },
    { name: "Aura Attack Racket", itemType: ItemType.RACKET, ratePerUnit: 15, maxQuantityPerBooking: 4 },
    { name: "AeroSensa Feather Shuttlecocks (Tube of 6)", itemType: ItemType.SHUTTLECOCK, ratePerUnit: 20, maxQuantityPerBooking: 2 },
    { name: "Synthetic Training Shuttlecocks (Tube of 6)", itemType: ItemType.SHUTTLECOCK, ratePerUnit: 12, maxQuantityPerBooking: 2 },
  ];

  const rentalItems = [];
  for (const r of rentalData) {
    const existing = await prisma.rentalItem.findFirst({ where: { name: r.name } });
    if (existing) {
      rentalItems.push(existing);
    } else {
      const created = await prisma.rentalItem.create({ data: r });
      rentalItems.push(created);
    }
  }
  console.log(`[OK] Seeded ${rentalItems.length} rental item options.`);

  // 3. Seed Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const marshal = await prisma.user.upsert({
    where: { email: "marshal@aura.local" },
    update: {},
    create: {
      email: "marshal@aura.local",
      phone: "+1-555-0199",
      name: "Tariq Shift Marshal",
      passwordHash,
      role: Role.MARSHAL,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@aura.local" },
    update: {},
    create: {
      email: "manager@aura.local",
      phone: "+1-555-0100",
      name: "Arena Facility Manager",
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const playerJulian = await prisma.user.upsert({
    where: { email: "julian@example.com" },
    update: {},
    create: {
      email: "julian@example.com",
      phone: "+1-555-0142",
      name: "Julian (Amateur League)",
      passwordHash,
      role: Role.PLAYER,
    },
  });

  const playerMaya = await prisma.user.upsert({
    where: { email: "maya@example.com" },
    update: {},
    create: {
      email: "maya@example.com",
      phone: "+1-555-0188",
      name: "Maya Lin",
      passwordHash,
      role: Role.PLAYER,
    },
  });

  console.log("[OK] Seeded users: Staff (marshal@aura.local, manager@aura.local) and Players (julian@example.com, maya@example.com).");

  // 4. Seed Slots for 7 Days (Today + 6 days forward)
  const now = new Date();
  const operatingHours = [];
  for (let hour = 7; hour <= 22; hour++) {
    operatingHours.push(hour);
  }

  let totalSlots = 0;
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const targetDate = addDays(now, dayOffset);
    const dateStr = format(targetDate, "yyyy-MM-dd");

    for (const court of courts) {
      for (const startHour of operatingHours) {
        const isPeak = startHour >= 18 && startHour < 22;
        await prisma.courtSlot.upsert({
          where: {
            courtId_date_startHour: {
              courtId: court.id,
              date: dateStr,
              startHour,
            },
          },
          update: {},
          create: {
            courtId: court.id,
            date: dateStr,
            startHour,
            endHour: startHour + 1,
            status: SlotStatus.AVAILABLE,
            isPeak,
          },
        });
        totalSlots++;
      }
    }
  }
  console.log(`[OK] Generated/Verified ${totalSlots} schedule slots for 7 days.`);

  // 5. Seed a sample booking for Julian on today or tomorrow
  const sampleDateStr = format(addDays(now, 1), "yyyy-MM-dd");
  const existingSampleBooking = await prisma.booking.findUnique({
    where: { bookingReference: "AUR-SMPL01" },
  });

  if (!existingSampleBooking) {
    const slot1 = await prisma.courtSlot.findUnique({
      where: {
        courtId_date_startHour: {
          courtId: courts[0].id,
          date: sampleDateStr,
          startHour: 19,
        },
      },
    });

    if (slot1) {
      const sampleBooking = await prisma.booking.create({
        data: {
          bookingReference: "AUR-SMPL01",
          userId: playerJulian.id,
          status: BookingStatus.BOOKED,
          totalAmount: 70, // 50 AUR court + 20 AUR rental
          notes: "Evening league practice",
          rentals: {
            create: [
              {
                rentalItemId: rentalItems[0].id,
                quantity: 2,
                unitRate: 10,
                subtotal: 20,
              },
            ],
          },
        },
      });

      await prisma.courtSlot.update({
        where: { id: slot1.id },
        data: {
          status: SlotStatus.BOOKED,
          bookingId: sampleBooking.id,
        },
      });
      console.log("[OK] Seeded sample booking AUR-SMPL01 for Julian.");
    }
  }

  // 6. Seed Testimonials
  const testimonials = [
    {
      userId: playerJulian.id,
      author: "Julian Hayes",
      role: "Amateur League Captain",
      tag: "Verified Player",
      quote:
        "Before this system, our post-work Thursday matches were constantly vulnerable to double-booking conflicts. Now I reserve Court 2 for 19:00 - 21:00 with two attack rackets right from my phone.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: playerMaya.id,
      author: "Maya Lin",
      role: "Weekend Club Organizer",
      tag: "Club Member",
      quote:
        "The real-time availability grid and instant cancellation transparency gave our 12-member club total certainty. We can check slots during lunchtime and confirm attendance immediately.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: marshal.id,
      author: "Tariq Shift Marshal",
      role: "Front Desk Operations",
      tag: "Arena Staff",
      quote:
        "At the desk, front-counter check-ins now take under 20 seconds. The 15-minute no-show release rule keeps courts occupied and makes walk-in players genuinely happy.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "Elena Rostova",
      role: "Mixed Doubles Competitor",
      tag: "Tournament Player",
      quote:
        "The shock-absorbing synthetic rubber flooring here provides unmatched traction and joint protection during explosive directional shifts and jump smashes.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "Marcus Chen",
      role: "Morning Routine Regular",
      tag: "Verified Player",
      quote:
        "Booking 07:00 AM dawn sessions before office hours is seamless. The lighting is warmed up and courts are swept clean every morning without fail.",
      rating: 4,
      isPublished: true,
    },
    {
      userId: null,
      author: "Sarah Jenkins",
      role: "Junior Academy Parent",
      tag: "Academy Parent",
      quote:
        "My twins train here on Saturday mornings. The reception team is incredibly respectful, the viewing lounge is comfortable, and court allocation is always punctual.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "David Thorne",
      role: "Senior League Veteran",
      tag: "Club Member",
      quote:
        "The high-bay LED lighting angle is carefully aligned. Even during high trajectory clears and back-court lift returns, you never lose sight of the shuttlecock to ceiling glare.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "Kenji Sato",
      role: "Collegiate Badminton Athlete",
      tag: "League Player",
      quote:
        "Laminar climate airflow is regulated to perfection. Zero artificial cross-draft means shuttle trajectory remains completely predictable and tournament-accurate.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "Aria Montgomery",
      role: "Casual Weekend Player",
      tag: "Verified Player",
      quote:
        "Being able to pre-reserve precision strung carbon attack rackets and a tube of feather shuttles with the court booking eliminates gear carrying hassles entirely.",
      rating: 5,
      isPublished: true,
    },
    {
      userId: null,
      author: "Lucas Vance",
      role: "Corporate Sparring Organizer",
      tag: "Draft Review",
      quote:
        "We host Friday night inter-department tournaments here. Court staff are very accommodating when we need adjacent courts reserved in consecutive time blocks.",
      rating: 4,
      isPublished: false,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: t.author },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log(`[OK] Seeded ${testimonials.length} arena testimonials.`);

  console.log("[*] Database seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
