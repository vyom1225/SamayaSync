import { DeleteEventTypeAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

async function DeleteEventRoute({params} : {
    params : {
        eventTypeId : string
    }
}) {
  
  const {eventTypeId} = await params
  return (
     <div className="flex justify-center items-center h-full w-full">
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Delete Event Type</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Are you sure you want to delete this event?</CardDescription>
            </CardHeader>
            <CardFooter >
                <form action = {DeleteEventTypeAction} className="flex justify-between w-full">
                    <input type = "hidden"
                           name = "id"
                           value = {eventTypeId}
                    />
                    <Button variant="secondary" type = "button" asChild >
                        <Link href = "/dashboard">
                            Cancel
                        </Link>
                    </Button>
                    <Button variant="destructive">Delete</Button>
                </form>
            </CardFooter>
        </Card>

     </div>
  )
}
export default DeleteEventRoute