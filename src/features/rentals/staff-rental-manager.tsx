"use client";

import { useState } from "react";
import { StaffRentalItem } from "./get-rentals.query";
import { updateRentalItemAction } from "./actions/update-rental.action";
import { Badge } from "@/components/ui/badge";

interface Props {
  initialItems: StaffRentalItem[];
}

export function StaffRentalManager({ initialItems }: Props) {
  const [items, setItems] = useState<StaffRentalItem[]>(initialItems);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setProcessingId(id);
    setErrorMsg(null);

    const nextActive = !currentActive;
    const res = await updateRentalItemAction({ id, isActive: nextActive });

    if (res.success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isActive: nextActive } : item))
      );
    } else {
      setErrorMsg(res.error || "Failed to update equipment availability");
    }
    setProcessingId(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
            Equipment Inventory
          </span>
          <h2 className="text-xl font-serif font-semibold text-[#252724] mt-2">
            Rental Equipment Catalog & Rates
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure gear availability and rental rates in Aurum (AUR) for checkout add-ons.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {items.length} Catalog Items
        </span>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.isActive
                ? "border-black/8 bg-[#fbfbfa]"
                : "border-black/6 bg-neutral-50 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#252724]">{item.name}</span>
                  <Badge variant={item.itemType === "RACKET" ? "sage" : "neutral"}>
                    {item.itemType}
                  </Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-serif font-bold text-[#252724]">
                    {item.ratePerUnit}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">AUR / booking</span>
                </div>
                <div className="mt-1 text-[11px] text-neutral-400 font-mono">
                  Max capacity: {item.maxQuantityPerBooking} per party
                </div>
              </div>

              <button
                type="button"
                disabled={processingId === item.id}
                onClick={() => handleToggleActive(item.id, item.isActive)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  item.isActive
                    ? "bg-[#eef2ec] text-[#5a8357] hover:bg-[#dbe6d9]"
                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                }`}
              >
                {processingId === item.id
                  ? "Updating..."
                  : item.isActive
                  ? "In Service"
                  : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
