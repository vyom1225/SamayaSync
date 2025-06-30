import { Button } from "@/components/ui/button"
import { Card, 
     CardDescription, 
     CardFooter, 
     CardHeader, 
     CardTitle 
} from "@/components/ui/card"

import {CalendarCheck2} from "lucide-react"
import Link from "next/link"

function grantIdPage() {
  return (
     <div className="flex justify-center items-center h-screen">
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>You are almost Done!</CardTitle>
                <CardDescription>We have now connect your calender to your account</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href = "/api/auth">
                        <CalendarCheck2/>
                        Connect Calender to your Account
                    </Link>
                </Button>
            </CardFooter>
        </Card>
     </div>
  )
}
export default grantIdPage