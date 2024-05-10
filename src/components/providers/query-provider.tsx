"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface IQuery {
 children: React.ReactNode;
}

const queryClient = new QueryClient();

const QueryProvider = ({ children }: IQuery) => {
 return (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
 );
};

export default QueryProvider;
