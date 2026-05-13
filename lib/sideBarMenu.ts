import { IoHomeOutline } from "react-icons/io5";
import { GoHash } from "react-icons/go";
import { FaRegBell , FaRegEnvelope , FaRegBookmark , FaRegUser } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { SlOptions } from "react-icons/sl";


interface SideBarButtons {
    title : string,
    icon  : React.ReactNode
}



export const sideBarMenuItems : SideBarButtons[] = [
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
