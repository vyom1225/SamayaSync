"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { redirect } from "next/navigation"

function SuccessPage() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
        <Card className="w-[400px] rounded-sm flex gap-4">
            <CardHeader className="flex flex-col items-center justify-center ">
                <CardTitle className="bg-green-100 flex justify-center items-center rounded-full size-16
                                     text-green-500">
                    <Check/>
                </CardTitle>      
            </CardHeader>
            <CardContent className="flex flex-col items-center ">
                <div className="text-2xl font-semibold text-black ">This event is scheduled</div>
                <div className="text-sm text-muted-foreground text-center">
                    We emailed you a calendar invitation with all the details and the video call link!
                </div>
            </CardContent>
            <CardFooter className="mt-2">
                <Button className="w-full"
                onClick = {()=>redirect("/")}>
                    Close this Page
                </Button>
            </CardFooter>

        </Card>
    </div>
  )
}
export default SuccessPage