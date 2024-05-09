"use client";

import EventItem from "./event-item";
import ReactPaginate from "react-paginate";
import { useState } from "react";

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
 const [itemOffset, setItemOffset] = useState(0);

 let endOffset, currentItems, pageCount;
 const jobsPerPage = 5;

 if (events) {
  endOffset = itemOffset + jobsPerPage;
  currentItems = events.slice(itemOffset, endOffset);
  pageCount = Math.ceil(events.length / jobsPerPage);
 }

 const handlePageClick = (event: { selected: number }) => {
  const newOffset = (event.selected * jobsPerPage) % events.length;

  setItemOffset(newOffset);
 };
 return (
  <div className="flex  flex-col  gap-4">
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
