import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IEvent {
 event: {
  id: string;
  title: string;
  description: string;
  time: Date;
  organizer: string;
 };
}

const EventItem = ({ event }: IEvent) => {
 const date = new Date(event.time);
 return (
  <div className="flex flex-col justify-between  gap-7 p-4 border h-[250px] w-[500px]">
   <div className="flex flex-col gap-4">
    <div className="flex justify-between">
     <h2 className="font-bold textxl">{event.title}</h2>
     <div className="flex flex-col justify-end items-end">
      <p className="text-gray-600">
       {date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
       })}
      </p>
      <p className="text-gray-600">by {event.organizer}</p>
     </div>
    </div>
    <p className="line-clamp-4">{event.description}</p>
   </div>
   <div className="flex justify-between">
    <Link href={`/event/register/${event.title}`}>
     <Button>Register</Button>
    </Link>
    <Link href={`/event/${event.id}`}>
     <Button variant={"ghost"}>View</Button>
    </Link>
   </div>
  </div>
 );
};

export default EventItem;
