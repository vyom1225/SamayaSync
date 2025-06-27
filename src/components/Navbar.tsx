import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import AuthModal from "./AuthModal"

function Navbar() {
  return (
     <div className="flex justify-between items-center p-2 border-b-1 border-gray-200">
        <div>
            <Link href="/" className="flex items-center gap-1">
                 <Image src="/logo.png" alt="logo of Samaya " width={40} height = {40}/>
                 <div className="text-primary text-bold text-2xl">Samaya</div>
            </Link>
        </div>
        <AuthModal/>
     </div>
  )
}
export default Navbar