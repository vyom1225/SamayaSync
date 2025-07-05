import Image from "next/image"
import Link from "next/link"
import SideBarContents from "./SideBarContents"

function SideBar() {
  return (
    <div className="hidden md:flex flex-col w-[400px] min-h-screen border-r-2 border-gray-200 bg-secondary">
        <div className=" py-2 px-4 flex border-b-2 border-gray-200 min-h-[68px]">
            <Link href="/" className="flex items-center gap-1">
                 {/* <Image src="/logo.png" alt="logo of Samaya " width={60} height = {60}/> */}
                 <div className="text-primary text-bold text-2xl">Samaya Sync</div>
            </Link>
        </div>
        <SideBarContents/>
    </div>
  )
}
export default SideBar