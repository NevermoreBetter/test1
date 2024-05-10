"use client";

import EventItem from "./event-item";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import axios from "axios";

interface IEvent {
 events: {
  id: string;
  title: string;
  description: string;
  time: Date;
  organizer: string;
 }[];
}

const EventsList = ({ events }: IEvent) => {
 const [event, setEvent] = useState();
 const [itemOffset, setItemOffset] = useState(0);
 const [sortOption, setSortOption] = useState<"title" | "time" | "organizer">(
  "title"
 );
 const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

 let endOffset, currentItems, pageCount;
 const eventsPerPage = 6;

 const sortedEvents = [...events].sort((a, b) => {
  let result;
  if (sortOption === "title") {
   result = a.title.localeCompare(b.title);
  } else if (sortOption === "time") {
   result = a.time.getTime() - b.time.getTime();
  } else {
   result = a.organizer.localeCompare(b.organizer);
  }
  return sortOrder === "asc" ? result : -result;
 });

 if (sortedEvents) {
  endOffset = itemOffset + eventsPerPage;
  currentItems = sortedEvents.slice(itemOffset, endOffset);
  pageCount = Math.ceil(sortedEvents.length / eventsPerPage);
 }
 console.log(event);

 const handlePageClick = (event: { selected: number }) => {
  const newOffset = (event.selected * eventsPerPage) % sortedEvents.length;

  setItemOffset(newOffset);
 };
 return (
  <div className="flex  flex-col  gap-4">
   <div className="flex gap-4">
    <Button
     onClick={() => {
      setSortOption("title");
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
     }}
     className="px-4 py-2 rounded-md"
    >
     Sort by Title {sortOption === "title" && sortOrder === "asc" ? "▲" : "▼"}
    </Button>
    <Button
     onClick={() => {
      setSortOption("time");
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
     }}
     className="px-4 py-2 rounded-md "
    >
     Sort by Date {sortOption === "time" && sortOrder === "asc" ? "▲" : "▼"}
    </Button>
    <Button
     onClick={() => {
      setSortOption("organizer");
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
     }}
     className="px-4 py-2 rounded-md"
    >
     Sort by Organizer
     {sortOption === "organizer" && sortOrder === "asc" ? "▲" : "▼"}
    </Button>
   </div>
   <div className="flex flex-wrap gap-5">
    {currentItems!.map((event) => (
     <div key={event.id}>
      <EventItem event={event} />
     </div>
    ))}
   </div>
   <ReactPaginate
    breakLabel="..."
    nextLabel=">"
    onPageChange={handlePageClick}
    pageRangeDisplayed={5}
    pageCount={pageCount!}
    previousLabel="<"
    className="flex text-gray-400 gap-4 justify-center items-center"
    nextClassName="text-white"
    previousClassName="text-white"
    activeClassName="text-white text-lg font-bold"
    renderOnZeroPageCount={null}
   />
  </div>
 );
};

export default EventsList;
