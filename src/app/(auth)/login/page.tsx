import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";
import { getCurrentUser } from "@/core/auth/session";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default async function LoginPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {user && (
          <div className="mb-5 w-full max-w-md p-3.5 rounded-2xl bg-[#eef2ec] border border-[#dbe6d9] text-xs text-[#252724] flex items-center justify-between">
            <div className="truncate pr-2">
              Currently signed in as <span className="font-semibold">{user.name}</span>
            </div>
            <Link
              href={user.role === "PLAYER" ? "/schedule" : "/marshal"}
              className="font-medium text-[#5a8357] hover:underline whitespace-nowrap"
            >
              Dashboard &rarr;
            </Link>
          </div>
        )}
        <Suspense fallback={<div className="text-sm text-neutral-400">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-xs text-neutral-500 mt-6">
          New to Aura Sports Arena?{" "}
          <Link href="/register" className="text-[#5a8357] font-medium hover:underline">
            Register for a player account
          </Link>
        </p>
      </main>
    </div>
  );
}
