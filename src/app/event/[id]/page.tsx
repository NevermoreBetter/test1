import { getEventByid } from "@/actions/getEventById";
import EventCard from "./_components/event-card";
import { getUsersByEvent } from "@/actions/getUsersByEvent";

const DetailPage = async ({ params }: { params: { id: string } }) => {
 const users = await getUsersByEvent(params.id);
 const event = await getEventByid(params.id);

 return (
  <div>
   <EventCard data={users} event={event!.title} />
  </div>
 );
};

export default DetailPage;
