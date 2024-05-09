interface IProps {
 data: {
  id: string;
  name: string;
  email: string;
  dob: string;
  createdAt: Date;
  eventId: string | null;
 }[];
 event: string;
}

const EventCard = ({ data, event }: IProps) => {
 return (
  <div className="flex flex-col ">
   <div>
    <h2 className="text-4xl font-bold mb-5">{event} participants:</h2>
   </div>
   <div className="flex  gap-4 flex-wrap">
    {data.map((user) => (
     <div key={user.id} className="border w-[300px] p-4">
      <p className="font-bold text-3xl mb-2 ">{user.name}</p>
      <p className="text-gray-400">{user.email}</p>
     </div>
    ))}
   </div>
  </div>
 );
};

export default EventCard;
