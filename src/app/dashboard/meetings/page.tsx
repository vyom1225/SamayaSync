import { cancelMeetingAction } from "@/app/actions"
import EmptyState from "@/components/EmptyState"
import { SubmitButton } from "@/components/SubmitButtons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/db"
import { authenticateUser } from "@/lib/hooks"
import { nylas } from "@/lib/nylas"
import { format, fromUnixTime } from "date-fns"
import { Video } from "lucide-react"

async function getData(userId : string) {
    const userData = await prisma.user.findUnique({
        where : {
            id : userId,
        },
        select : {
            grantId : true,
            grantEmail : true
        }
    })

    if(!userData){
        throw new Error('User not found')
    }

    const data = await nylas.events.list({
        identifier : userData.grantId as string,
        queryParams : {
            calendarId : userData.grantEmail as string,
        },
    })

    return data;
}

export default async function Meetings(){
    const session = await authenticateUser();
    const data = await getData(session?.user?.id as string)
    return (
       <>
       {
            data.data.length < 1 ? (
                <EmptyState
                    title = "No meetings found"
                    description="You don't have any meetings yet"
                    buttonText="Create a new Event type"
                    href = "/dashboard/new"
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Bookings</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground ">See upcoming event which where booked with you and see the event link</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {
                            data.data.map((item , index) => (
                                <form action = {cancelMeetingAction} key = {index}>
                                    <input type = "hidden"
                                           name = "eventId"
                                           value = {item.id}
                                    />
                                    <div className="grid grid-cols-3 justify-between items-center"> 
                                        <div>
                                            <p className="text-muted-foreground text-sm">
                                                {/* @ts-ignore */}
                                                {format(fromUnixTime(item.when.startTime) , "EEEE , dd MMMM")}
                                                {/* @ts-ignore */}
                                            </p>
                                            <p className = "text-muted-foreground text-xs pt-1">
                                                {/* @ts-ignore */}
                                                {format(fromUnixTime(item.when.startTime) , "hh:mm a")}
                                                {/* @ts-ignore */}
                                                {" "}
                                                {/* @ts-ignore */}
                                                {format(fromUnixTime(item.when.endTime) , "hh:mm a")}
                                                {/* @ts-ignore */}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <Video className = "size-4 mr-2 text-primary"/>                                         
                                                <a className="text-xs text-primary underline underine-offset-4"
                                                    //@ts-ignore
                                                    href = {item.conferencing.details.url}
                                                >
                                                    Join Meeting
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <h2 className="text-sm font-medium ">{item.title}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                You and {item.participants[0].name}
                                            </p>
                                        </div>
                                        <SubmitButton
                                            text = "Cancel Event"
                                            variant="destructive"
                                            className="w-fit flex ml-auto"
                                        />       
                                    </div>
                                    <Separator className="my-3" />
                                </form>
                            ))
                        }
                    </CardContent>
                </Card>
            )
        }
       </>
    )
}