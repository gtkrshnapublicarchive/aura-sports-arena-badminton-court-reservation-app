import { UserProfileData } from "./profile.types";
import { Badge } from "@/components/ui/badge";
import { ProfileStats } from "./profile-stats";
import { format } from "date-fns";
import Link from "next/link";

export function ProfileHeader({ profile }: { profile: UserProfileData }) {
  const isPlayer = profile.role === "PLAYER";
  const isMarshal = profile.role === "MARSHAL";
  const isManager = profile.role === "MANAGER";

  const initial = profile.name ? profile.name[0].toUpperCase() : "A";
  const memberSince = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "September 2026";

  return (
    <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#252724] text-white flex items-center justify-center font-serif text-2xl font-bold">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-semibold text-[#252724]">
                {profile.name}
              </h1>
              <Badge
                variant={isPlayer ? "sage" : isMarshal ? "warning" : "neutral"}
              >
                {isPlayer ? "Badminton Player" : isMarshal ? "Court Marshal" : "Facility Manager"}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {profile.email} - Member since {memberSince}
            </p>
          </div>
        </div>

        <div>
          {isMarshal || isManager ? (
            <Link
              href="/marshal"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Master Board</span>
            </Link>
          ) : (
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Schedule</span>
            </Link>
          )}
        </div>
      </div>

      {/* Role-Specific Stats Strip */}
      <ProfileStats profile={profile} />
    </div>
  );
}
