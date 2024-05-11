import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
 try {
  const { name, email, dob, type, title } = await req.json();
  const eve = await db.event.findFirst({ where: { id: title } });
  const createResume = await db.user.create({
   data: {
    name,
    email,
    dob,
    type,
    eventId: eve?.id,
   },
  });
  return NextResponse.json(createResume, { status: 201 });
 } catch (error) {
  return NextResponse.json(
   { message: "Something went wrong in api" + error },
   { status: 500 }
  );
 }
}
