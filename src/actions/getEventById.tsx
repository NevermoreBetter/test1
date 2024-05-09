import { db } from "@/lib/prisma";

export const getEventByid = (eventId: string) => {
 return db.event.findUnique({
  where: {
   id: eventId,
  },
 });
};
