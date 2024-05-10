"use client";

import EventItem from "./event-item";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import axios from "axios";

interface IEvent {
 id: string;
 title: string;
 description: string;
 time: Date;
 organizer: string;
}

const EventsList = () => {
 const [sortOption, setSortOption] = useState<"title" | "time" | "organizer">(
  "title"
 );
 const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
 const [offset, setOffset] = useState(9);
 const [data, setData] = useState<IEvent[]>([]);
 const [loading, setLoading] = useState(false);

 const sortedEvents = [...data].sort((a, b) => {
  let result;
  if (sortOption === "title") {
   result = a.title.localeCompare(b.title);
  } else if (sortOption === "time") {
   result = new Date(a.time).getTime() - new Date(b.time).getTime();
  } else {
   result = a.organizer.localeCompare(b.organizer);
  }
  return sortOrder === "asc" ? result : -result;
 });

 useEffect(() => {
  const fetchEvents = async () => {
   const response = await fetch(`/api/events?offset=${offset}`);
   const data = await response.json();
   setData(data);
   setLoading(false);
  };
  fetchEvents();
 }, [offset]);

 let prevScrollPos = window.scrollY;
 let scrollingDown = true;

 const handleScroll = () => {
  const currentScrollPos = window.scrollY;

  scrollingDown = currentScrollPos > prevScrollPos;

  if (
   window.innerHeight + currentScrollPos + 1 >=
    document.documentElement.scrollHeight &&
   scrollingDown
  ) {
   setLoading(true);
   setOffset((prev) => prev + 1);
  }

  prevScrollPos = currentScrollPos;
 };

 useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

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
   <div className="flex flex-wrap justify-center gap-5">
    {sortedEvents!.map((event) => (
     <div key={event.id}>
      <EventItem event={event} />
     </div>
    ))}
   </div>
   {loading ? <>Loading...</> : <></>}
  </div>
 );
};

export default EventsList;
