import { getEvents } from "@/actions/getEvents";
import EventsList from "./_components/events-list";

export default async function Home() {
 const events = await getEvents();
 return (
  <div>
   <EventsList events={events} />
  </div>
 );
}
