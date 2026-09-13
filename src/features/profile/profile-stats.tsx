import { UserProfileData } from "./profile.types";

export function ProfileStats({ profile }: { profile: UserProfileData }) {
  const isPlayer = profile.role === "PLAYER";
  const isMarshal = profile.role === "MARSHAL";
  const isManager = profile.role === "MANAGER";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
      {isPlayer && (
        <>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Total Bookings
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.totalBookings || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Reservations secured</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Active Slots
            </div>
            <div className="text-2xl font-serif font-bold text-[#5a8357] mt-0.5">
              {profile.stats.upcomingBookings || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Upcoming games</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Court Time
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.totalHoursBooked || 0} hr
            </div>
            <div className="text-[11px] text-neutral-500">Total time on rubber</div>
          </div>
        </>
      )}

      {isMarshal && (
        <>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Check-Ins Verified
            </div>
            <div className="text-2xl font-serif font-bold text-[#5a8357] mt-0.5">
              {profile.stats.checkInsProcessed || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Desk arrivals processed</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Walk-Ins Created
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.walkInsCreated || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Counter walk-in players</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Arena Bookings
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.totalBookings || 0}
            </div>
            <div className="text-[11px] text-neutral-500">System reservations</div>
          </div>
        </>
      )}

      {isManager && (
        <>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Active Courts
            </div>
            <div className="text-2xl font-serif font-bold text-[#5a8357] mt-0.5">
              {profile.stats.courtsActive || 4} Courts
            </div>
            <div className="text-[11px] text-neutral-500">Tournament rubber mats</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Total Bookings
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.totalBookings || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Lifetime reservations</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-black/6 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Completed Games
            </div>
            <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">
              {profile.stats.checkInsProcessed || 0}
            </div>
            <div className="text-[11px] text-neutral-500">Checked-in games</div>
          </div>
        </>
      )}
    </div>
  );
}
