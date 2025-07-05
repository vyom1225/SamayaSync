import Link from "next/link"
import Image from "next/image"
import AuthModal from "./AuthModal"
import { ThemeToggle } from "./ThemeToggle"

function Navbar() {
  return (
    <div className="fixed top-0 w-full z-1 bg-muted-foreground/10 ">
         <div className="flex justify-between items-center p-4 border-b-1 border-gray-200">
        <div>
            <Link href="/GoogleLogo.png" className="flex items-center gap-1">
                 {/* <Image src="/logo.png" alt="logo of Samaya " width={40} height = {40}/> */}
                 <div className="text-primary text-bold text-2xl">Samaya Sync</div>
            </Link>
        </div>
        <div className="flex gap-2">
            <ThemeToggle/>
            <AuthModal/>
        </div>   
        </div>
    </div>
  )
}
export default Navbar