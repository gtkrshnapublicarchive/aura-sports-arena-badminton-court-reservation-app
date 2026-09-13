import Link from "next/link";
import { getCurrentUser } from "@/core/auth/session";
import { logoutAction } from "@/features/auth/logout.action";
import { Badge } from "./badge";
import { NavLink } from "./nav-link";
import { Role } from "@prisma/client";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-black/8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#252724] text-white flex items-center justify-center font-serif text-lg font-bold group-hover:bg-[#3b3e39] transition-colors">
            A
          </div>
          <div>
            <div className="font-serif font-semibold text-[#252724] leading-none tracking-tight">
              Aura Sports Arena
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mt-0.5">
              Badminton Center
            </div>
          </div>
        </Link>

        {/* Navigation items with DOM Exclusion based on Role */}
        <nav className="flex items-center gap-6 text-sm">
          {!user ? (
            <>
              <NavLink href="/schedule">Court Schedule</NavLink>
              <NavLink href="/login">Log In</NavLink>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-[#252724] hover:bg-[#3b3e39] text-white text-xs font-medium transition-colors"
              >
                Register
              </Link>
            </>
          ) : user.role === Role.PLAYER ? (
            <>
              <NavLink href="/schedule">Book Court</NavLink>
              <NavLink href="/my-bookings">My Bookings</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <div className="flex items-center gap-3 pl-2 border-l border-black/8">
                <Link href="/profile">
                  <Badge variant="sage">{user.name}</Badge>
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-neutral-500 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Marshal & Manager Session: DOM Excludes Player Links */
            <>
              <NavLink href="/marshal" activeIndicator>
                Master Schedule
              </NavLink>
              <NavLink href="/marshal/testimonials" activeIndicator>
                Testimonials
              </NavLink>
              <NavLink href="/marshal/rentals" activeIndicator>
                Equipment
              </NavLink>
              <NavLink href="/marshal/settings" activeIndicator>
                Desk Settings
              </NavLink>
              <div className="flex items-center gap-3 pl-2 border-l border-black/8">
                <Link href="/marshal/settings">
                  <Badge variant="neutral">
                    {user.role === Role.MANAGER ? "Manager" : "Marshal"}: {user.name}
                  </Badge>
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-neutral-500 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
