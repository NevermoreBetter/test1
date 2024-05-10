import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import QueryProvider from "@/components/providers/query-provider";
export const metadata: Metadata = {
 title: "Create Next App",
 description: "Generated by create next app",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <body className="px-10 py-5">
    <ThemeProvider attribute="class" defaultTheme="dark">
     <Navbar />
     <QueryProvider>{children}</QueryProvider>
     <Toaster />
    </ThemeProvider>
   </body>
  </html>
 );
}
