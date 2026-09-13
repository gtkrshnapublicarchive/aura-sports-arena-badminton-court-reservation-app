import { MarshalLoginForm } from "@/features/marshal/marshal-login-form";
import Link from "next/link";

export default function MarshalLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-black/8 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#252724] text-white flex items-center justify-center font-serif text-lg font-bold">
              A
            </div>
            <span className="font-serif font-semibold text-[#252724]">
              Aura Sports Arena
            </span>
          </Link>
          <span className="text-xs text-neutral-400 font-mono">
            Staff Security Gateway
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <MarshalLoginForm />
        <p className="text-xs text-neutral-400 mt-6 font-mono">
          Strictly for authorized arena marshals and facility operators.
        </p>
      </main>
    </div>
  );
}
