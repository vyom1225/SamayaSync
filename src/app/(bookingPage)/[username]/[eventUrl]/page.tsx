import { creatMeetingAction } from "@/app/actions"
import Calendar from "@/components/bookingForm/Calendar"
import RenderCalendar from "@/components/bookingForm/RenderCalendar"
import { TimeTable } from "@/components/bookingForm/TimeTable"
import { CancelButton } from "@/components/CancelButton"
import { SubmitButton } from "@/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { prisma } from "@/lib/db"
import { time } from "console"
import { CalendarX2, Clock, Video } from "lucide-react"
import { notFound } from "next/navigation"

async function getData(eventUrl : string , username : string){

    const data = await prisma.eventType.findFirst({
        where : {
            url : eventUrl,
            user : {
                username : username
            },
            active : true,
        },
        select : {
            id : true,
            title : true,
            description : true,
            duration : true,
            videoCallSoftware : true,
            user : {
                select : {
                    image : true , 
                    name : true , 
                    availability : {
                        select : {
                            day : true,
                            isActive : true
                        }
                    }
                }
                
            }
        }
    })

    if(!data){
        return notFound();
    }

    return data;

}


async function bookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; eventUrl: string }>;
  searchParams: Promise<{ date?: string ; time?: string }>;
}) {

  const { eventUrl, username } = await params;
  const awaitedParams = await searchParams;
  const selectedDate = awaitedParams.date
        ? new Date(awaitedParams.date)
        : new Date()

  const formattedDate = new Intl.DateTimeFormat("en-US" , {
    weekday : "long",
    day : "numeric",
    month : "long"
  }).format(selectedDate )

  const data = await getData(eventUrl , username);

  const showForm = !!awaitedParams.date && !!awaitedParams.time

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-primary-foreground dark:bg-black p-8">
        {showForm ? (
        <Card className = "max-w-[720px] p-0">
            <CardContent className="md:grid md:grid-cols-[3fr_auto_4fr] md:grid-flow-col p-0 min-h-[420px] w-full">
                <div className="flex-1 p-4 flex flex-col gap-4 ">
                    <div className="space-y-2">
                        <img src = {data.user?.image as string} 
                            alt = "Profile Image"
                            className="size-6 rounded-full"
                        />
                        <div className=" text-muted-foreground">{data.user?.name}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-lg font-semibold">{data.title}</div>
                        <div className=" text-muted-foreground ">{data.description}</div>
                    </div> 
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <CalendarX2 className="size-4 text-primary"/>
                            <div className="text-muted-foreground " >{formattedDate}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Clock className="size-4 text-primary"/>
                            <div className="text-muted-foreground">{data.duration}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Video className="size-4 text-primary"/>
                            <div className="text-muted-foreground">{data.videoCallSoftware}</div>
                        </div>
                    </div>
                </div>
                <Separator orientation="vertical" className="min-w-[1px] h-full "/>
                <form  className="flex-1 flex flex-col justify-between w-full p-6  " action={creatMeetingAction}>
                    <input 
                        type = "hidden"
                        name = "fromTime"
                        value = {awaitedParams.time}
                    /> 
                    <input 
                        type = "hidden"
                        name = "eventDate"
                        value = {awaitedParams.date}
                    /> 
                    <input 
                        type = "hidden"
                        name = "duration"
                        value = {data.duration}
                    /> 
                    <input
                        type = "hidden" 
                        name = "username"
                        value = {username}
                    />
                    <input  
                        type = "hidden"
                        name = "eventTypeId"
                        value = {data.id}
                    />
                    <input 
                        type = "hidden"
                        name = "provider"
                        value = {data.videoCallSoftware}
                    />
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-y-2">
                            <Label>Your Name</Label>
                            <Input name = "name" placeholder="Your Name"/>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Your Email</Label>
                            <Input name = "email" placeholder="johndoe@example.com"/>
                        </div>
                        <div className="flex-1 flex flex-col gap-y-2">
                            <Label>Additional notes</Label>
                            <Textarea placeholder="Please Share anything that will help prepare for our meeting"
                                      className="h-full"
                            />
                        </div>
                    </div>    
                    <div className="flex justify-between items-end mt-4">
                        <CancelButton/>
                        <SubmitButton  text="Book Meeting"/>
                    </div>
                </form>
            </CardContent>
        </Card>
        ) : (
            <Card className = "max-w-[1000px] p-0 mx-auto rounded-sm">
            <CardContent className="p-0 h-full md:grid md:grid-cols-[2fr_auto_4fr_auto_2fr] md:grid-flow-col">
                <div className="p-6 flex flex-col gap-4">
                    <div className="space-y-2">
                        <img src = {data.user?.image as string} 
                            alt = "Profile Image"
                            className="size-6 rounded-full"
                        />
                        <div className=" text-muted-foreground">{data.user?.name}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-lg font-semibold">{data.title}</div>
                        <div className=" text-muted-foreground ">{data.description}</div>
                    </div> 
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <CalendarX2 className="size-4 text-primary"/>
                            <div className="text-muted-foreground " >{formattedDate}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Clock className="size-4 text-primary"/>
                            <div className="text-muted-foreground">{data.duration}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Video className="size-4 text-primary"/>
                            <div className="text-muted-foreground">{data.videoCallSoftware}</div>
                        </div>
                    </div>
                </div>
                <Separator orientation="vertical" className="min-w-[1px] h-full"/>
                <div className="p-6 min-h-[420px]">
                   <RenderCalendar 
                        availability={data.user?.availability as any}
                    />
                </div>
                <Separator orientation="vertical" className="min-w-[1px] h-full"/>
                <div className="p-6">
                    <TimeTable username = {username} selectedDate={selectedDate} duration = {data.duration}/>
                </div>
            </CardContent>
        </Card>             
        )}
    </div>
  )
}
export default bookingPage