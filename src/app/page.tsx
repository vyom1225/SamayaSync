// import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
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
    <>
    <div className="min-h-screen flex flex-col relative" >
        <Navbar/>
        <Hero/>
        
    </div>
    {/* <Footer/> */}
    </>   
  );
}
