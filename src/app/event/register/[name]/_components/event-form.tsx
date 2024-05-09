"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { format } from "date-fns";
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
import { usePathname } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
 name: z.string().min(2, {
  message: "Must be at least 4 characters.",
 }),
 email: z.string().email(),
 dob: z.date({
  required_error: "A date of birth is required.",
 }),
});

export function EventForm() {
 const [isSubmitting, setIsSubmitting] = useState(false);
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
  } catch (error) {
   console.log(error);
  } finally {
   setIsSubmitting(false);
  }
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
       <Popover>
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
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) =>
           date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
         />
        </PopoverContent>
       </Popover>
       <FormDescription>
        Your date of birth is used to calculate your age.
       </FormDescription>
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