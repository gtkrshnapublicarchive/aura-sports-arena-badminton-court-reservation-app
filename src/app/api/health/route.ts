import { NextResponse } from "next/server";
import { prisma } from "@/core/db/client";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "healthy",
        service: "aura-sports-arena-reservation",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: err instanceof Error ? err.message : "Database check failed",
      },
      { status: 503 }
    );
  }
}
