export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl border border-black/8 shadow-xs">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#eef2ec] text-[#5a8357] mb-4">
          Aura Sports Arena
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[#252724] font-serif mb-2">
          Court Reservation System
        </h1>
        <p className="text-sm text-neutral-600 mb-6">
          Internal scheduling platform for 4 synthetic rubber badminton courts.
        </p>
        <div className="text-xs text-neutral-400 border-t border-black/8 pt-4">
          Environment initialized on Next.js 16
        </div>
      </div>
    </main>
  );
}
