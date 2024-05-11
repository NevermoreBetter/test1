"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
 name: z
  .string()
  .min(2, {
   message: "Must be at least 4 characters.",
  })
  .regex(/^[a-zA-Z\s]+$/, {
   message: "Name should only contain letters and spaces.",
  }),
 email: z.string().email(),
 dob: z.date({
  required_error: "A date of birth is required.",
 }),
 type: z.enum(["Social media", "Friends", "Found myself"], {
  required_error: "Select a notification type.",
 }),
});

export function EventForm() {
 const [isCalendarOpen, setIsCalendarOpen] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const route = useRouter();
 const path = usePathname();
 const title = path.split("/")[3];
 const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
 });

 async function onSubmit(data: z.infer<typeof FormSchema>) {
  try {
   setIsSubmitting(true);
   const requestData = {
    ...data,
    title,
   };
   await axios.post("/api/user", requestData);
   toast({
    title: "Submitted successfully!",
    description: "Your form has been submitted.",
    duration: 3000,
   });
   route.push(`/event/${title}`);
   route.refresh();
  } catch (error) {
   toast({
    title: "Not submitted",
    description: "Something went wrong.",
    duration: 3000,
   });
   console.log(error);
  } finally {
   setIsSubmitting(false);
  }
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
    <FormField
     control={form.control}
     name="name"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Name</FormLabel>
       <FormControl>
        <Input {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="email"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Email</FormLabel>
       <FormControl>
        <Input {...field} />
       </FormControl>

       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="dob"
     render={({ field }) => (
      <FormItem className="flex flex-col">
       <FormLabel>Date of birth</FormLabel>
       <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
         <FormControl>
          <Button
           variant={"outline"}
           className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
           )}
          >
           {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
         </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
         <Calendar
          captionLayout="dropdown-buttons"
          fromYear={1920}
          toYear={2024}
          mode="single"
          selected={field.value}
          onSelect={(date) => {
           field.onChange(date);
           setIsCalendarOpen(false);
          }}
          disabled={(date) =>
           date > new Date() || date < new Date("1900-01-01")
          }
         />
        </PopoverContent>
       </Popover>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="type"
     render={({ field }) => (
      <FormItem className="space-y-3">
       <FormLabel>Where did you hear about this event?</FormLabel>
       <FormControl>
        <RadioGroup
         onValueChange={field.onChange}
         defaultValue={field.value}
         className="flex space-y-1"
        >
         <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
           <RadioGroupItem value="Social media" />
          </FormControl>
          <FormLabel className="font-normal">Social media</FormLabel>
         </FormItem>
         <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
           <RadioGroupItem value="Friends" />
          </FormControl>
          <FormLabel className="font-normal">Friends</FormLabel>
         </FormItem>
         <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
           <RadioGroupItem value="Found myself" />
          </FormControl>
          <FormLabel className="font-normal">Found myself</FormLabel>
         </FormItem>
        </RadioGroup>
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <Button disabled={isSubmitting ? true : false} type="submit">
     {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
   </form>
  </Form>
 );
}
