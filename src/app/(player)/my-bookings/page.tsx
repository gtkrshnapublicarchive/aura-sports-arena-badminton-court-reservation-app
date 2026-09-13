import { requirePlayer } from "@/core/auth/guards";
import { getPlayerBookings } from "@/features/bookings/get-my-bookings.query";
import { Navbar } from "@/components/ui/navbar";
import { MyBookingsList } from "@/features/bookings/my-bookings-list";

export default async function MyBookingsPage() {
  const player = await requirePlayer();
  const bookings = await getPlayerBookings(player.userId);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full">
            Player Dashboard
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
            My Court Reservations
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review active court slots, equipment add-ons, and desk settlement in Aurum (AUR).
          </p>
        </div>

        <MyBookingsList bookings={bookings} />
      </main>
    </div>
  );
}
