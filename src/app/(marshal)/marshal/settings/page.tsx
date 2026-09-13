import { requireMarshal } from "@/core/auth/guards";
import { getUserProfile } from "@/features/profile/get-profile.query";
import { MarshalSettingsForm } from "@/features/profile/marshal-settings-form";
import { ManagerSettingsForm } from "@/features/profile/manager-settings-form";
import { ProfileHeader } from "@/features/profile/profile-header";
import { MarshalNavTabs } from "@/features/marshal/marshal-nav-tabs";
import { Navbar } from "@/components/ui/navbar";
import { Role } from "@prisma/client";

export default async function MarshalSettingsPage() {
  const staff = await requireMarshal();
  const profile = await getUserProfile(staff.userId);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5a8357] animate-pulse" />
              <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
                Desk Operations
              </span>
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
              Staff Desk & Shift Settings
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Operator: {profile.name} ({profile.role}) - Shift roster preferences, radio intercom frequency, and escalation contacts.
            </p>
          </div>

          <MarshalNavTabs />
        </div>

        <ProfileHeader profile={profile} />

        {profile.role === Role.MARSHAL && (
          <MarshalSettingsForm profile={profile} />
        )}
        {profile.role === Role.MANAGER && (
          <ManagerSettingsForm profile={profile} />
        )}
      </main>
    </div>
  );
}
