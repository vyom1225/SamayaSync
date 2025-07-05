import SideBar from "@/components/SideBar"
import {signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Menu} from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import SideBarContents from "@/components/SideBarContents";
import Image from "next/image";
import Link from "next/link";
import { authenticateUser } from "@/lib/hooks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { prisma } from "@/lib/db";

async function layout({children} :Readonly<{
    children: React.ReactNode;
  }>) {
  const session = await authenticateUser();
  
  const user = await prisma.user.findFirst({
    where : {
        id : session.user?.id
    },
    select : {
        username : true,
        grantId : true,
    }
  })

  if(!user?.username){
    redirect("/onboarding");
  }

  if(!user?.grantId){
    redirect("/onboarding/grant-id")
  }
  
  return (
    <div className="flex">
         <SideBar/>
         <div className="flex flex-col w-full min-h-screen">
           <div className="flex justify-between md:justify-end  h-[68px] bg-secondary border-b-2 border-gray-200 p-4">
            <div className="md:hidden ">
            <Sheet>
                <SheetTrigger asChild>
                    <Menu strokeWidth={1} className="w-[40px] h-[40px]"/>
                </SheetTrigger>
                <SheetContent className="w-[280px] px-0" side="left">
                    <SheetHeader>
                    <SheetTitle className="border-b-2 border-gray-200" asChild>
                        <Link href="/" className="flex items-center gap-1">
                            <Image src="/logo.png" alt="logo of Samaya " width={60} height = {60}/>
                            <div className="text-primary text-bold text-2xl">Samaya</div>
                        </Link>
                    </SheetTitle>
                    <SheetDescription>
                        <SideBarContents/>
                    </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>   
            </div>
            <div className="flex  gap-4">
                <ThemeToggle/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="rounded-full  w-[34px] h-[34px]">
                            <img src = {session?.user?.image as string}  alt = "Profile Image" className="rounded-full"/>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="py-2" align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href = "/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <form action = {async() => {
                                "use server"
                                await signOut();
                                redirect("/");
                            }} className="w-full">
                                <button className="text-left w-full"> Logout</button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>     
           </div>   
           <main className="p-6 flex-1">
              {children}
           </main>
         </div>
    </div> 
  )
}
export default layout