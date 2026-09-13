"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "./update-profile.action";
import { UserProfileData } from "./profile.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function MarshalSettingsForm({ profile }: { profile: UserProfileData }) {
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [shiftPreference, setShiftPreference] = useState("Evening Shift (15:00 - 23:00)");
  const [radioChannel, setRadioChannel] = useState("Channel 2 - Court Marshals");
  const [emergencyContact, setEmergencyContact] = useState("+1-555-0100 (Facility Manager)");

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
        shiftPreference,
        radioChannel,
        emergencyContact,
      });

      if (!res.success) {
        setMessage({ type: "error", text: res.error || "Update failed" });
        setIsLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Staff marshal profile updated successfully." });
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
          Marshal Desk Settings
        </span>
        <h2 className="text-xl font-serif font-semibold text-[#252724] mt-2">
          Staff Operational & Shift Profile
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure front desk duty information, contact channels, and emergency escalation lines.
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
          label="Marshal Operator Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Shift Duty Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Direct phone reachable at the front desk."
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Assigned Shift Preference"
          value={shiftPreference}
          onChange={setShiftPreference}
          options={[
            "Morning Shift (07:00 - 15:00)",
            "Evening Shift (15:00 - 23:00)",
            "Full Arena Rotation",
          ]}
        />

        <Select
          label="Intercom / Radio Frequency"
          value={radioChannel}
          onChange={setRadioChannel}
          options={[
            "Channel 1 - Emergency & Security",
            "Channel 2 - Court Marshals",
            "Channel 3 - Facilities & Cleaning",
          ]}
        />
      </div>

      <Input
        label="Emergency Escalation Contact"
        value={emergencyContact}
        onChange={(e) => setEmergencyContact(e.target.value)}
        helperText="Direct contact for facility supervisor during incidents."
      />

      <div className="pt-2 border-t border-black/6 flex justify-end">
        <Button type="submit" isLoading={isLoading} className="px-6">
          Save Marshal Settings
        </Button>
      </div>
    </form>
  );
}
