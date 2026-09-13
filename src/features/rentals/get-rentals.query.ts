import { prisma } from "@/core/db/client";
import { ItemType } from "@prisma/client";

export interface RentalCatalogItem {
  id: string;
  name: string;
  itemType: ItemType;
  ratePerUnit: number;
  maxQuantityPerBooking: number;
}

export async function getActiveRentalItems(): Promise<RentalCatalogItem[]> {
  const items = await prisma.rentalItem.findMany({
    where: { isActive: true },
    orderBy: [{ itemType: "asc" }, { ratePerUnit: "asc" }],
  });

  return items.map((i) => ({
    id: i.id,
    name: i.name,
    itemType: i.itemType,
    ratePerUnit: i.ratePerUnit,
    maxQuantityPerBooking: i.maxQuantityPerBooking,
  }));
}
