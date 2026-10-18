"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { GoHash } from "react-icons/go";
import { FaRegEnvelope, FaRegBookmark, FaRegUser } from "react-icons/fa";

const mobileNavItems = [
  { title: "Home", icon: <IoHomeOutline />, link: "/dashboard" },
  { title: "Explore", icon: <GoHash />, link: "/dashboard/explore" },
  { title: "Messages", icon: <FaRegEnvelope />, link: "/messages" },
  { title: "Bookmarks", icon: <FaRegBookmark />, link: "/dashboard/bookmarks" },
  { title: "Profile", icon: <FaRegUser />, link: "/dashboard/userProfile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-gray-700 bg-slate-950/90 backdrop-blur lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive =
          item.link === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.link);

        return (
          <Link
            key={item.title}
            href={item.link}
            aria-label={item.title}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
