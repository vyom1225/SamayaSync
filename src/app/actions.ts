"use server"

import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks"
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
