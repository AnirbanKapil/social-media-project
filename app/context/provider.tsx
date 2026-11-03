"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "./realtime-provider";

const queryClient = new QueryClient();


export const Providers = ({children} : {children : React.ReactNode}) => {
    return (
          <SessionProvider>
               <QueryClientProvider client={queryClient}>
                  <RealtimeProvider>
                    {children}
                  </RealtimeProvider>
               </QueryClientProvider>
          </SessionProvider>
    ) 
   
}