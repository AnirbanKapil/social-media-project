


"use client";


import { NavBar } from "@/app/src/components/navbar";
import { WhatsHappening } from "@/app/src/components/whatsHappening";
import { SideBarMenuItems } from "@/app/src/components/sideBarMenu";
import Link from "next/link";




export default function DashboardLayout({children}: {children: React.ReactNode}) {

   

     return (
     <div>
        <NavBar />
        <div className="grid grid-cols-12 w-screen h-screen px-52 overflow-hidden">
            <div className="col-span-3 mt-10 sticky top-0 h-screen">
               <ul> 
               {SideBarMenuItems.map((itm)=> <li key={itm.title}>
                                                   <Link className="flex justify-center cursor-pointer 
                                                   hover:bg-blue-400 hover:scale-120 transition-transform duration-300 w-fit rounded-lg"
                                                   href={itm.link || "#"}>             
                                                   <div className="m-6 text-2xl">{itm.title}</div>
                                                   <div className="m-7 text-2xl">{itm.icon}</div>
                                                   </Link>    
                                             </li>)}
               </ul>
            </div>
            <div className="col-span-6 border-r border-l border-gray-600 overflow-y-auto no-scrollbar">
              {children}
            </div>
            <div className="col-span-3 mt-10 sticky top-0 h-screen">
                <WhatsHappening />
            </div>
        </div>
     </div>    
    )
}
