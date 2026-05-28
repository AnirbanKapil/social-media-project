import { IoHomeOutline } from "react-icons/io5";
import { GoHash } from "react-icons/go";
import { FaRegBell , FaRegEnvelope , FaRegBookmark , FaRegUser } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { SlOptions } from "react-icons/sl";


interface SideBarButtons {
    title : string,
    icon  : React.ReactNode,
    link? : string

}




export const SideBarMenuItems = () : SideBarButtons[] => { return  [
    {title : "Home",
     icon  : <IoHomeOutline /> , 
     link : "/dashboard" 
    },
    { title: "Explore",
        icon : <GoHash />,
        link : "/dashboard/explore"
    },
    {
        title : "Notifications",
        icon : <FaRegBell />,
        link : "/dashboard/notifications"
       },
       {
        title : "Messages",
        icon : <FaRegEnvelope />,
        link : "/dashboard/messages"
       },
       {
        title : "Bookmarks",
        icon : <FaRegBookmark />,
        link : "/dashboard/bookmarks"
       },
       {
        title : "Profile",
        icon :  <FaRegUser />,
        link :  `/dashboard/userProfile`
       },
       {
        title : "Verify",
        icon : <LuCircleDollarSign />,
        link : "/dashboard/verify"
       },
       {
        title : "Options",
        icon : <SlOptions />,
        link : "/dashboard/options"
       }
]
}