import { RegisterForm } from "@/features/auth/register-form";
import { getCurrentUser } from "@/core/auth/session";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === Role.PLAYER ? "/schedule" : "/marshal");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <RegisterForm />
        <p className="text-xs text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#5a8357] font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </main>
    </div>
  );
}
