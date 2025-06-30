"use client"

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface submitBtnProps {
    variant? : "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined ,
    text : string,
    className? : string
}
export function SubmitButton({variant , text , className} : submitBtnProps){
    const {pending} = useFormStatus();

    return(
    <> {
        pending ? (
            <Button disabled variant="outline" className={`${className}`}>
                <Loader2 className="animate-spin"/>Please Wait</Button>
        ) : (
            <Button type = "submit" variant = {variant} className={`${className}`}>
                {text}
            </Button>
        )
    }
    </>
)}


export function GoogleAuthButton(){
    const {pending} = useFormStatus();
    return(
        <>
            {
                pending ? (
                    <Button disabled className="w-full" variant="outline">
                        <Loader2 className="animate-spin size-4 mr-2"/>
                        Please Wait
                    </Button>
                ) : (
                    <Button className="w-full " variant="outline">
                        <Image src = "/GoogleLogo.png" alt = "Google Logo" width = {40} height = {40} className="mr-2"/>
                        Sign in With Google
                    </Button>
                )
                   
            }
        
        </>
    )
}

export function GitHubAuthButton(){
    const {pending} = useFormStatus();
    return(
        <>
            {
                pending ? (
                    <Button disabled className="w-full" variant = "outline">
                        <Loader2 className="animate-spin size-4 mr-2"/>
                        Please Wait
                    </Button>
                ) : (
                    <Button className="w-full" variant="outline">
                        <Image src = "/GitHubLogo.png" alt = "Google Logo" width = {40} height = {40} className="mr-2"/>
                        Sign in With GitHub
                    </Button>
                )
                   
            }
        
        </>
    )
}