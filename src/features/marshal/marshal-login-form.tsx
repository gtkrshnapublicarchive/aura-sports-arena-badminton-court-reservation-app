"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/features/auth/login.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MarshalLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("marshal@aura.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password, isStaff: true });
      if (!res.success) {
        setError(res.error || "Staff authentication failed");
        setIsLoading(false);
        return;
      }

      router.push("/marshal");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred");
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: "marshal" | "manager") => {
    if (role === "marshal") {
      setEmail("marshal@aura.local");
    } else {
      setEmail("manager@aura.local");
    }
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-black/8 p-8 shadow-xs">
      <div className="mb-6">
        <span className="text-[10px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
          Staff Operational Access
        </span>
        <h2 className="text-2xl font-serif font-semibold text-[#252724] mt-2">
          Court Marshal Console
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Authorized shift staff credentials required to access the 4-court schedule board.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Staff Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Security Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Authorize & Enter Console
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-black/8">
        <div className="text-[11px] text-neutral-400 font-mono mb-2 text-center">
          Internal Duty Presets
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("marshal")}
            className="flex-1 py-1.5 px-2 rounded-lg border border-black/8 text-[11px] text-neutral-600 hover:bg-[#fbfbfa] transition-colors cursor-pointer"
          >
            Marshal (Tariq)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("manager")}
            className="flex-1 py-1.5 px-2 rounded-lg border border-black/8 text-[11px] text-neutral-600 hover:bg-[#fbfbfa] transition-colors cursor-pointer"
          >
            Facility Manager
          </button>
        </div>
      </div>
    </div>
  );
}
