"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

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
 const [searchTerm, setSearchTerm] = useState("");

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
 };

 const filteredData = data.filter(
  (user) =>
   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.email.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
  <div className="flex flex-col ">
   <div>
    <h2 className="text-4xl font-bold mb-5">{event} participants:</h2>
    <Input
     type="text"
     placeholder="Search by name or email"
     value={searchTerm}
     onChange={handleSearch}
     className="border border-gray-300 rounded-md py-2 px-4 mb-5 w-1/4"
    />
   </div>
   <div className="flex  gap-4 flex-wrap">
    {filteredData.map((user) => (
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
