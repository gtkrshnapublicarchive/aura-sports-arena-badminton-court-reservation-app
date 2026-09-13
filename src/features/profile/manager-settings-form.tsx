"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "./update-profile.action";
import { UserProfileData } from "./profile.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ManagerSettingsForm({ profile }: { profile: UserProfileData }) {
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [facilityAnnouncement, setFacilityAnnouncement] = useState(
    "All 4 synthetic rubber courts operational. Prime evening hours (18:00 - 22:00) subject to high booking volume."
  );
  const [escalationPhone, setEscalationPhone] = useState("+1-555-0900 (Arena Operations)");

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
        facilityAnnouncement,
        escalationPhone,
      });

      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Update failed" });
        setIsLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Facility Manager settings updated successfully." });
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
          Arena Management Settings
        </span>
        <h2 className="text-xl font-serif font-semibold text-[#252724] mt-2">
          Facility Leadership & System Directives
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure administrative controls, arena operational announcements, and management lines.
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
          label="Facility Manager Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Direct Contact Mobile"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Direct supervisor line for arena staff."
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#252724] mb-1.5">
          Arena Bulletin & Operational Notice
        </label>
        <textarea
          rows={3}
          value={facilityAnnouncement}
          onChange={(e) => setFacilityAnnouncement(e.target.value)}
          className="w-full rounded-xl bg-white px-3.5 py-2.5 text-xs text-[#252724] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#668c63]"
          maxLength={250}
        />
        <p className="mt-1 text-[11px] text-neutral-400">
          Internal operational bulletin displayed on the marshal console and arena briefing.
        </p>
      </div>

      <Input
        label="24/7 Facility Escalation Hotline"
        value={escalationPhone}
        onChange={(e) => setEscalationPhone(e.target.value)}
        helperText="Emergency facility contractor line (electrical/AC/mat repairs)."
      />

      <div className="pt-2 border-t border-black/6 flex justify-end">
        <Button type="submit" isLoading={isLoading} className="px-6">
          Save Manager Settings
        </Button>
      </div>
    </form>
  );
}
