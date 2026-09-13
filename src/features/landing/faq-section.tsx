export function FaqSection() {
  const faqs = [
    {
      q: "How does payment settlement in Aurum (AUR) work?",
      a: "No online credit card details or advance digital gateway settlements are needed. Your court reservation holds your slot in the system, and your balance in AUR (court rate + optional rental gear) is settled at the front reception desk upon check-in.",
    },
    {
      q: "Why is there a 2-hour daily maximum booking limit per player?",
      a: "Aura Sports Arena enforces a 2-hour daily cap to prevent court monopolization during high-demand weekday evening peak hours (18:00 - 22:00) and ensure all players have fair access.",
    },
    {
      q: "Can I cancel my court reservation if my group cannot attend?",
      a: "Yes. Self-service cancellation is available directly from your 'My Bookings' dashboard up to 2 hours prior to your scheduled start time. Cancelling immediately frees the court for other community players.",
    },
    {
      q: "What happens if a player arrives late for their booked slot?",
      a: "A 15-minute grace period applies. If the reserving party has not checked in at the reception desk within 15 minutes past the start of the hour, court marshals may mark the booking as a No-Show and release the court to waiting walk-in patrons.",
    },
    {
      q: "What rental equipment is available at the reception desk?",
      a: "We provide high-modulus graphite tournament rackets (even-balanced and head-heavy attack profiles) strung at 26 lbs, and tubes of AeroSensa goose feather or synthetic training shuttlecocks.",
    },
  ];

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
          Common Inquiries
        </span>
        <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Everything you need to know about booking, playing, and front-desk settlement at Aura Sports Arena.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-black/8 shadow-2xs"
          >
            <h3 className="text-sm font-semibold text-[#252724] mb-2">
              {faq.q}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
