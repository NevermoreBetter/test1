"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend,
} from "chart.js";

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
);

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

 const registrationsByDate = data.reduce(
  (acc: Record<string, number>, user) => {
   const date = user.createdAt.toISOString().split("T")[0];
   if (acc[date]) {
    acc[date]++;
   } else {
    acc[date] = 1;
   }
   return acc;
  },
  {}
 );

 const chartData = {
  labels: Object.keys(registrationsByDate),
  datasets: [
   {
    label: "Registrations",
    data: Object.values(registrationsByDate),
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    tension: 1,
   },
  ],
  options: {
   scales: {
    y: {
     ticks: {
      stepSize: 1,
     },
    },
   },
  },
 };

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
   <div className="flex gap-4 flex-wrap">
    {filteredData.map((user) => (
     <div key={user.id} className="border w-[300px] p-4">
      <p className="font-bold text-3xl mb-2 ">{user.name}</p>
      <p className="text-gray-400">{user.email}</p>
     </div>
    ))}
   </div>
   <div className="mt-8">
    <h3 className="text-2xl font-bold mb-4">Registrations per Day</h3>
    <Line data={chartData} />
   </div>
  </div>
 );
};

export default EventCard;
