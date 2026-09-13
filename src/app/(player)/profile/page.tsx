import { requireAuth } from "@/core/auth/guards";
import { getUserProfile } from "@/features/profile/get-profile.query";
import { Navbar } from "@/components/ui/navbar";
import { ProfileHeader } from "@/features/profile/profile-header";
import { PlayerSettingsForm } from "@/features/profile/player-settings-form";
import { MarshalSettingsForm } from "@/features/profile/marshal-settings-form";
import { ManagerSettingsForm } from "@/features/profile/manager-settings-form";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const authUser = await requireAuth();
  const profile = await getUserProfile(authUser.userId);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
            Account Management
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
            Profile Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Role-tailored settings and operational preferences for Aura Sports Arena.
          </p>
        </div>

        <ProfileHeader profile={profile} />

        {profile.role === "PLAYER" && <PlayerSettingsForm profile={profile} />}
        {profile.role === "MARSHAL" && <MarshalSettingsForm profile={profile} />}
        {profile.role === "MANAGER" && <ManagerSettingsForm profile={profile} />}
      </main>
    </div>
  );
}
