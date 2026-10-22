


import { NavBar } from "@/app/src/components/navbar";
import { WhatsHappening } from "@/app/src/components/whatsHappening";
import { SideBarMenuItems } from "@/app/src/components/sideBarMenu";
import { MobileNav } from "@/app/src/components/MobileNav";
import Link from "next/link";




export default function DashboardLayout({children}: {children: React.ReactNode}) {

    const sideBarItems = SideBarMenuItems();

     return (
     <div>
        <NavBar showUserSearch />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-0 px-2 pb-16 sm:px-4 lg:grid-cols-12 lg:px-8 lg:pb-0">
            <div className="hidden lg:col-span-3 lg:mt-10 lg:sticky lg:top-0 lg:block lg:h-screen">
               <ul> 
               {sideBarItems.map((itm)=> <li key={itm.title}>
                                                   <Link className="flex justify-center cursor-pointer 
                                                   hover:bg-blue-400 hover:scale-120 transition-transform duration-300 w-fit rounded-lg"
                                                   href={itm.link || "#"}>             
                                                   <div className="m-6 text-2xl">{itm.title}</div>
                                                   <div className="relative m-7 text-2xl">{itm.icon}{itm.badge}</div>
                                                   </Link>    
                                             </li>)}
               </ul>
            </div>
            <div className="col-span-1 min-w-0 border-gray-600 no-scrollbar lg:col-span-6 lg:border-r lg:border-l lg:overflow-y-auto">
              {children}
            </div>
            <div className="hidden lg:col-span-3 lg:mt-10 lg:sticky lg:top-0 lg:block lg:h-screen">
                <WhatsHappening />
            </div>
        </div>
        <MobileNav />
     </div>    
    )
}
