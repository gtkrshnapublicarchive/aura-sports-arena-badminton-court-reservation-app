"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "./update-profile.action";
import { UserProfileData } from "./profile.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function PlayerSettingsForm({ profile }: { profile: UserProfileData }) {
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [skillLevel, setSkillLevel] = useState("League Player");
  const [dominantHand, setDominantHand] = useState("Right-handed");
  const [emergencyContact, setEmergencyContact] = useState("+1-555-0911");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await updateProfileAction({
        name,
        phone,
        skillLevel,
        dominantHand,
        emergencyContact,
      });

      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Update failed" });
        setIsLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Player profile updated successfully." });
      setIsLoading(false);
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <span className="text-[10px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
          Player Profile Settings
        </span>
        <h2 className="text-xl font-serif font-semibold text-[#252724] mt-2">
          Personal & Badminton Preferences
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Your contact phone is used by court marshals to verify bookings at the reception desk.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs border ${
            message.type === "success"
              ? "bg-[#eef2ec] border-[#dbe6d9] text-[#5a8357]"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Mobile Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Used for desk check-in verification."
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Badminton Skill Level"
          value={skillLevel}
          onChange={setSkillLevel}
          options={[
            "Recreational / Beginner",
            "Intermediate Club Player",
            "League Player",
            "Competitive / Tournament",
          ]}
        />

        <Select
          label="Dominant Hand"
          value={dominantHand}
          onChange={setDominantHand}
          options={["Right-handed", "Left-handed"]}
        />
      </div>

      <Input
        label="Emergency Contact Phone"
        value={emergencyContact}
        onChange={(e) => setEmergencyContact(e.target.value)}
        helperText="Optional emergency on-court contact number."
      />

      <div className="pt-2 border-t border-black/6 flex justify-end">
        <Button type="submit" isLoading={isLoading} className="px-6">
          Save Player Settings
        </Button>
      </div>
    </form>
  );
}
