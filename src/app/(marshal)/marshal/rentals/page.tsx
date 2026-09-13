import { requireMarshal } from "@/core/auth/guards";
import { getAllRentalItemsForStaff } from "@/features/rentals/get-rentals.query";
import { StaffRentalManager } from "@/features/rentals/staff-rental-manager";
import { Navbar } from "@/components/ui/navbar";

export default async function MarshalRentalsPage() {
  const staff = await requireMarshal();
  const rentalItems = await getAllRentalItemsForStaff();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5a8357] animate-pulse" />
            <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
              Front Desk Operations
            </span>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
            Equipment Rental Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Operator: {staff.name} ({staff.role}) - Manage rental racket and shuttlecock availability and counter rates.
          </p>
        </div>

        <StaffRentalManager initialItems={rentalItems} />
      </main>
    </div>
  );
}
