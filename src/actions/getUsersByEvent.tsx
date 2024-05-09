import { db } from "@/lib/prisma";

export const getUsersByEvent = async (eventId: string) => {
 const user = await db.user.findMany({
  where: {
   eventId,
  },
 });
 return user;
};
