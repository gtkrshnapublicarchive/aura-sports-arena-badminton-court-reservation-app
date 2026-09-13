import { requireAuth } from "@/core/auth/guards";
import { getUserProfile } from "@/features/profile/get-profile.query";
import { Navbar } from "@/components/ui/navbar";
import { ProfileHeader } from "@/features/profile/profile-header";
import { PlayerSettingsForm } from "@/features/profile/player-settings-form";
import { getUserTestimonial } from "@/features/testimonials/queries/get-testimonials.query";
import { PlayerTestimonialForm } from "@/features/testimonials/player-testimonial-form";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const authUser = await requireAuth();
  const profile = await getUserProfile(authUser.userId);

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "PLAYER") {
    redirect("/marshal/settings");
  }

  const playerTestimonial = await getUserTestimonial(profile.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
            Account Management
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
            Player Profile Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your player credentials, badminton preferences, and public arena reviews.
          </p>
        </div>

        <ProfileHeader profile={profile} />

        <PlayerTestimonialForm
          initialTestimonial={playerTestimonial}
          userName={profile.name}
        />
        <PlayerSettingsForm profile={profile} />
      </main>
    </div>
  );
}
