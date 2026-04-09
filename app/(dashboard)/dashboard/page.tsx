
import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { GoHash } from "react-icons/go";
import { FaRegBell , FaRegEnvelope , FaRegBookmark , FaRegUser } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { SlOptions } from "react-icons/sl";
import { Feeds } from "@/app/src/components/feeds";


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
        <div className="grid grid-cols-12 w-screen h-screen px-52">
            <div className="col-span-3 mt-10">
               <ul> 
               {sideBarMenuItems.map((itm)=> <li className="flex justify-center cursor-pointer 
                                                hover:bg-blue-400 hover:scale-120 transition-transform duration-300 w-fit rounded-lg" 
                                                            key={itm.title}>
                                                   <div className="m-2">{itm.title}</div>
                                                   <div className="m-3">{itm.icon}</div>    
                                             </li>)}
               </ul>
            </div>
            <div className="col-span-6 border-r border-l">
                <div className="mt-10 ml-2">
                     <Feeds />
                </div>
            </div>
            <div className="col-span-3 mt-10">Happening Now</div>
        </div>
    )
}
