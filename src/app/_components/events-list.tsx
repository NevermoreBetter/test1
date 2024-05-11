"use client";

import EventItem from "./event-item";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import Spinner from "@/components/spinner";

interface IEvent {
 id: string;
 title: string;
 description: string;
 time: Date;
 organizer: string;
}

type UserQueryParams = {
 take?: number;
 lastCursor?: string;
};

const allEvents = async ({ take, lastCursor }: UserQueryParams) => {
 const response = await axios.get("/api/events", {
  params: { take, lastCursor },
 });
 return response?.data;
};

const EventsList = () => {
 const [sortOption, setSortOption] = useState<"title" | "time" | "organizer">(
  "time"
 );
 const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
 const { ref, inView } = useInView();

 const {
  data,
  error,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isSuccess,
  isFetchingNextPage,
 } = useInfiniteQuery({
  queryFn: ({ pageParam = "" }) =>
   allEvents({ take: 10, lastCursor: pageParam }),
  queryKey: ["events"],
  getNextPageParam: (lastPage) => {
   return lastPage?.metaData.lastCursor;
  },
  initialPageParam: "",
 });

 useEffect(() => {
  if (inView && hasNextPage) {
   fetchNextPage();
  }
 }, [hasNextPage, inView, fetchNextPage]);

 if (error as any)
  return (
   <div className="mt-10">
    {"An error has occurred: " + (error as any).message}
   </div>
  );

 const sortedEvents = []
  .concat(...(data?.pages || []).map((page) => page.data))
  .sort((a: IEvent, b: IEvent) => {
   let result;
   if (sortOption === "title") {
    result = a.title.localeCompare(b.title);
   } else if (sortOption === "time") {
    let aTime = new Date(a.time);
    let bTime = new Date(b.time);
    result = aTime.getTime() - bTime.getTime();
   } else {
    result = a.organizer.localeCompare(b.organizer);
   }
   return sortOrder === "asc" ? result : -result;
  });

 return (
  <div className="flex  flex-col  gap-4">
   <div className="flex gap-4 lg:flex-row flex-col">
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
   <div className="mt-10 flex lg:flex-row flex-col flex-wrap gap-10 w-full justify-center">
    {isSuccess &&
     sortedEvents.map((event, index) => {
      if (sortedEvents.length === index + 1) {
       return (
        <div ref={ref} key={index}>
         <EventItem event={event} />
        </div>
       );
      } else {
       return (
        <div key={index}>
         <EventItem event={event} />
        </div>
       );
      }
     })}
    {(isLoading || isFetchingNextPage) && <Spinner />}
   </div>
  </div>
 );
};

export default EventsList;
