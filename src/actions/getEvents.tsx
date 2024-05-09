import { db } from "@/lib/prisma";

export const getEvents = () => {
 const events = db.event.findMany();
 return events;
};
