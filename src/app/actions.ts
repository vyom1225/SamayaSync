"use server"

import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks"
import { nylas } from "@/lib/nylas";
import { newEventTypeSchema, onBoardingSchemaValidation, settingSchema } from "@/lib/zodSchema";
import { parseWithZod } from '@conform-to/zod';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function onBoardingAction(prevState : any , formData : FormData){
    
    const submission = await parseWithZod(formData,{
        schema : onBoardingSchemaValidation({
            async isUsernameUnique(){
                const existingUser = await prisma.user.findUnique({
                    where : {
                        username : formData.get("userName") as string
                    }
                })

                return !existingUser;
            }
        }),
        async : true
    })

    if(submission.status !== "success"){
        return submission.reply();
    }

    const session = await authenticateUser();

    const data = await prisma.user.update({
        where : {
            id : session.user?.id
        },
        data : {
            username : submission.value.userName,
            name : submission.value.fullName,
            availability : {
                createMany : {
                    data : [
                        {
                            day : "Monday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Tuesday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Wednesday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Thursday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Friday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Saturday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                        {
                            day : "Sunday",
                            fromTime : "9:00",
                            tillTime : "17:00"
                        },
                    ]
                }
            }
        }
    })

    redirect("/onboarding/grant-id");
}

export async function settingsAction(prevState: any , formData :FormData){
    
    const submission = await parseWithZod(formData , {
        schema : settingSchema
    })

    if(submission.status !== "success"){
        return submission.reply();
    }

    const session = await authenticateUser();

    await prisma.user.update({
        where : {
            id : session.user?.id
        },
        data : {
            name : submission.value.fullName,
            image : submission.value.profileImage
        }
    })
    
    redirect("/dashboard");
}

export async function updateAvailabilityAction(formData : FormData){
    const session = await authenticateUser();

    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData).filter((key) => (
        key.startsWith("id-")
    )).map((key) => {

        const id = key.replace("id-","");

        return {
            id ,
            isActive : rawData[`isActive-${id}`] === "on",
            fromTime : rawData[`fromTime-${id}`] as string,
            tillTime : rawData[`tillTime-${id}`] as string
        }
    })

    try{
        await prisma.$transaction(
            availabilityData.map((item) => prisma.availability.update({
                where : {
                    id : item.id
                },
                data : {
                    isActive : item.isActive,
                    fromTime : item.fromTime,
                    tillTime : item.tillTime
                }
            }))
        )

        revalidatePath("dashboard/availability")
    }catch(error){
        console.log(error);
    }
}


export async function newEventTypeAction(prevState: any , formData : FormData){
    const session = await authenticateUser();

    const submission = await parseWithZod(formData , {
        schema : newEventTypeSchema
    })

    if(submission.status !== "success"){
        return submission.reply();
    }

    await prisma.eventType.create({
        data : {
            title : submission.value.title,
            duration : parseInt(submission.value.duration),
            videoCallSoftware : submission.value.videoCallSoftware,
            description : submission.value.description,
            url : submission.value.url,
            userId : session.user?.id
        }
    })

    return redirect("/dashboard");
}


export async function creatMeetingAction(formData : FormData){
    const data = await prisma.user.findUnique({
        where : {
            username : formData.get("username") as string,
        },
        select : {
            grantEmail : true,
            grantId : true
        }
    })

    if(!data){
        throw new Error("User not Found")
    }

    const eventData = await prisma.eventType.findUnique({
        where : {
            id : formData.get("eventTypeId") as string
        },
        select : {
            title : true,
            description : true 
        }
    })

    const fromTime = formData.get('fromTime') as string
    const eventDate = formData.get('eventDate') as string
    const meetingLength = Number(formData.get('duration'))
    const provider = formData.get("provider") as string

    const startDateTime = new Date(`${eventDate}T${fromTime}:00`)
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000)
    

    const response = await nylas.events.create({
        identifier : data.grantId as string,
        requestBody : {
            title : eventData?.title,
            description : eventData?.description,
            when : {
                startTime : Math.floor(startDateTime.getTime() / 1000 ),
                endTime : Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing : {
                autocreate : {},
                provider : provider as any ,
            },
            participants : [
                {
                    name : formData.get("name") as string,
                    email : formData.get("email") as string,
                    status : "yes"
                }
            ]
        },
        queryParams : {
            calendarId : data.grantEmail as string,
            notifyParticipants : true
        }


    })

    return redirect("/success")
}