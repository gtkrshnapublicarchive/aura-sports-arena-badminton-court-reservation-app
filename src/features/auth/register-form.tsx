"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "./register.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await registerAction({ name, email, phone, password });
      if (!res.success) {
        setError(res.error || "Registration failed");
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

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-black/8 p-8 shadow-xs">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#eef2ec] text-[#5a8357] mb-3">
          Player Registration
        </span>
        <h2 className="text-2xl font-serif font-semibold text-[#252724]">
          Create Player Account
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Reserve courts online and settle in Aurum (AUR) at the front desk.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Julian Hayes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="julian@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Mobile Phone"
          type="tel"
          placeholder="+1-555-0142"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Used by court marshals for booking verification."
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Create Account & Book
        </Button>
      </form>
    </div>
  );
}
