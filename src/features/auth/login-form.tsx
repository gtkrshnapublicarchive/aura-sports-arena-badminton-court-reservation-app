"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "./login.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStaff = searchParams.get("staff") === "true";

  const [isStaff, setIsStaff] = useState(initialStaff);
  const [email, setEmail] = useState(initialStaff ? "marshal@aura.local" : "julian@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password, isStaff });
      if (!res.success) {
        setError(res.error || "Authentication failed");
        setIsLoading(false);
        return;
      }

      if (res.data?.redirectUrl) {
        router.push(res.data.redirectUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred");
      setIsLoading(false);
    }
  };

  const handleQuickFill = (targetRole: "player" | "marshal") => {
    if (targetRole === "player") {
      setIsStaff(false);
      setEmail("julian@example.com");
      setPassword("password123");
    } else {
      setIsStaff(true);
      setEmail("marshal@aura.local");
      setPassword("password123");
    }
    setError(null);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-black/8 p-8 shadow-xs">
      {/* Role Toggle Tabs */}
      <div className="flex rounded-xl bg-[#f2f5f0] p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setIsStaff(false);
            if (email === "marshal@aura.local") setEmail("julian@example.com");
          }}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
            !isStaff
              ? "bg-white text-[#252724] shadow-xs"
              : "text-neutral-500 hover:text-[#252724]"
          }`}
        >
          Player Login
        </button>
        <button
          type="button"
          onClick={() => {
            setIsStaff(true);
            if (email === "julian@example.com") setEmail("marshal@aura.local");
          }}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
            isStaff
              ? "bg-[#252724] text-white shadow-xs"
              : "text-neutral-500 hover:text-[#252724]"
          }`}
        >
          Staff / Marshal Portal
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-semibold text-[#252724]">
          {isStaff ? "Court Marshal Console" : "Sign In to Reserve"}
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          {isStaff
            ? "Enter arena staff credentials to access the 4-court schedule board."
            : "Sign in with your registered player email to book courts."}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          {isStaff ? "Access Marshal Console" : "Sign In to Aura"}
        </Button>
      </form>

      {/* Quick demo presets */}
      <div className="mt-6 pt-5 border-t border-black/8">
        <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono mb-2 text-center">
          Quick Demo Credentials
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("player")}
            className="flex-1 py-1.5 px-2.5 rounded-lg border border-black/8 text-[11px] text-neutral-600 hover:bg-[#fbfbfa] transition-colors cursor-pointer"
          >
            Fill Player (Julian)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("marshal")}
            className="flex-1 py-1.5 px-2.5 rounded-lg border border-black/8 text-[11px] text-neutral-600 hover:bg-[#fbfbfa] transition-colors cursor-pointer"
          >
            Fill Marshal (Tariq)
          </button>
        </div>
      </div>
    </div>
  );
}
