
import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { GoHash } from "react-icons/go";
import { FaRegBell , FaRegEnvelope , FaRegBookmark , FaRegUser } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { SlOptions } from "react-icons/sl";
import { Feeds } from "@/app/src/components/feeds";
import { NavBar } from "@/app/src/components/navbar";


interface SideBarButtons {
    title : string,
    icon  : React.ReactNode
}


const sideBarMenuItems : SideBarButtons[] = [
    {title : "Home",
     icon  : <IoHomeOutline />   
    },
    { title: "Explore",
        icon : <GoHash />
    },
    {
        title : "Notifications",
        icon : <FaRegBell />
       },
       {
        title : "Messages",
        icon : <FaRegEnvelope />
       },
       {
        title : "Bookmarks",
        icon : <FaRegBookmark />
       },
       {
        title : "Profile",
        icon :  <FaRegUser />
       },
       {
        title : "Verify",
        icon : <LuCircleDollarSign />
       },
       {
        title : "Options",
        icon : <SlOptions />
       }
]




export default function Dashboard () {
    return (
    <div>
        <NavBar />
        <div className="grid grid-cols-12 w-screen h-screen px-52 overflow-hidden">
            <div className="col-span-3 mt-10 sticky top-0 h-screen">
               <ul> 
               {sideBarMenuItems.map((itm)=> <li className="flex justify-center cursor-pointer 
                                                hover:bg-blue-400 hover:scale-120 transition-transform duration-300 w-fit rounded-lg" 
                                                            key={itm.title}>
                                                   <div className="m-6 text-2xl">{itm.title}</div>
                                                   <div className="m-7 text-2xl">{itm.icon}</div>    
                                             </li>)}
               </ul>
            </div>
            <div className="col-span-6 border-r border-l border-gray-600 overflow-y-auto no-scrollbar">
                <div className="mt-16 mb-10">
                     <Feeds />
                     <Feeds />
                     <Feeds />
                     <Feeds />
                     <Feeds />
                     <Feeds />
                     <Feeds />
                </div>
            </div>
            <div className="col-span-3 mt-10 sticky top-0 h-screen">Happening Now</div>
        </div>
    </div>    
    )
}
