import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { signIn } from "@/utils/auth"
import { Button } from "./ui/button";
import Link from "next/link"
import Image from "next/image";
import { GitHubAuthButton, GoogleAuthButton } from "./SubmitButtons";

function AuthModal() {
  return (
    <Dialog>
        <DialogTrigger>
        <Button>
                Try For Free
        </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
            <DialogHeader>
                <DialogTitle className="flex justify-center mt-2">
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/logo.png" alt="logo of Samaya " width={40} height = {40}/>
                        <div className="text-primary text-bold text-2xl">Samaya</div>
                    </Link>
                </DialogTitle>
                <DialogDescription className="flex flex-col gap-2 items-center w-full">
                <form action = {async () => {
                    "use server"
                    await signIn("google");
                }} className="w-full">
                   <GoogleAuthButton/>
                </form>
                <form action = {async () => {
                    "use server"
                    await signIn("github");
                }} className="w-full">
                   <GitHubAuthButton/>
                </form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
export default AuthModal