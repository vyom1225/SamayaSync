import EditEvent from "@/components/EditEvent";
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

async function getData(eventTypeId : string){
    const data = await prisma.eventType.findUnique({
        where : {
            id : eventTypeId,
        },
        select : {
            title : true,
            description : true,
            duration : true,
            url : true,
            id : true,
            videoCallSoftware : true
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}


async function EditEventRoute({
    params,
} : {
    params : {
        eventTypeId : string
    }
}) {
    const {eventTypeId} = await params;
    const data = await getData(eventTypeId);


    return (
        <EditEvent  id = {data.id}
                    title = {data.title}
                    description= {data.description}
                    url = {data.url}
                    duration = {data.duration}
                    callProvider={data.videoCallSoftware}
        />
    )
}
export default EditEventRoute