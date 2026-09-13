import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
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
