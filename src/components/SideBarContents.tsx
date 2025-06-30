"use client"

import { House, UsersRound, CalendarCheck, Settings, LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
interface SideBarContent {
    title : string,
    index : number,
    logo : ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    src : string
}

const SideBarList : SideBarContent[] = [
    {
        title : "Event Types",
        index : 0,
        logo : House,
        src : "/dashboard"
    },
    {
        title : "Meetings",
        index : 1,
        logo : UsersRound,
        src : "/dashboard/meetings"
    },
    {
        title :"Availability",
        index : 2,
        logo : CalendarCheck,
        src : "/dashboard/availability"
    },
    {
        title : "Settings",
        index : 3,
        logo : Settings,
        src : "/dashboard/settings"
    }
]

function SideBarContents() {
    const pathname = usePathname();
  return (
    <div className="text-lg px-4 text-gray-700 py-2">
      {SideBarList.map((content: SideBarContent) => (
        <Link href = {content.src} key={content.index} className={` ${pathname === content.src ? "bg-purple-200 hover:bg-purple-200" : ""} p-2 mb-1 rounded-sm hover:bg-purple-100 flex items-center gap-2`}>
          <content.logo  strokeWidth={1}/>
          <div>{content.title}</div>
        </Link>
      ))}
    </div>
  )
}
export default SideBarContents