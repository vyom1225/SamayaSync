import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if(session?.user){
    return redirect("/dashboard")
  }
  return (
    <div >
        <Navbar/>
        <div>Hello This is delhi my yaar</div>
        <div>wait what are you doing</div>
    </div>
    
  );
}
