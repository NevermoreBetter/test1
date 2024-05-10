import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("offset") || "0", 10);

  const events = await db.event.findMany({
   take: limit,
  });

  return NextResponse.json(events, { status: 200 });
 } catch (error) {
  console.error(error);
  return NextResponse.json(
   { message: "Something went wrong" },
   { status: 500 }
  );
 }
}
