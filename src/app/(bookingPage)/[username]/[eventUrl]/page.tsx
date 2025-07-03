import Calendar from "@/components/bookingForm/Calendar"
import RenderCalendar from "@/components/bookingForm/RenderCalendar"
import { TimeTable } from "@/components/bookingForm/TimeTable"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
  searchParams: Promise<{ date?: string }>;
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

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-primary-foreground">
        <Card className = "mx-auto max-w-[1000px] w-full p-0">
            <CardContent className="md:grid md:grid-cols-[1fr , auto , 1fr , auto , 1fr] grid-flow-col p-0 min-h-[420px]">
                <div className="p-4 flex flex-col gap-4">
                    <div className="space-y-2">
                        <img src = {data.user?.image as string} 
                            alt = "Profile Image"
                            className="size-6 rounded-full"
                        />
                        <div className=" text-sm text-muted-foreground">{data.user?.name}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-lg font-semibold">{data.title}</div>
                        <div className="text-sm text-muted-foreground ">{data.description}</div>
                    </div> 
                    <div>
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
                <Separator orientation="vertical" className="w-[1px] h-full"/>
                <div className="p-4 ">
                   <RenderCalendar 
                        availability={data.user?.availability as any}
                    />
                </div>
                <Separator orientation="vertical" className="w-[1px] h-full"/>
                <div className="p-4">
                    <TimeTable username = {username} selectedDate={selectedDate} duration = {data.duration}/>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
export default bookingPage