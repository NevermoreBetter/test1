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
 return (
  <div className="flex flex-col  gap-7 p-4 border w-[300px]">
   <div className="flex flex-col gap-4">
    <div className="flex justify-between">
     <h2 className="font-bold textxl">{event.title}</h2>
     <p className="text-gray-600">{event.time.toLocaleString()}</p>
    </div>
    <p>{event.description}</p>
   </div>
   <div className="flex justify-between">
    <Link href={`/event/register/${event.title}`}>Register</Link>
    <Link href={`/event/${event.id}`}>View</Link>
   </div>
  </div>
 );
};

export default EventItem;
