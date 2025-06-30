import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks"
import { notFound } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { timeSlot } from "@/lib/timeSlots";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/SubmitButtons";
import { updateAvailabilityAction } from "@/app/actions";


async function getData(id : string){
    const data = prisma.availability.findMany({
        where : {
            userId : id
        },
    })

    if(!data){
        return notFound()
    }

    return data;
}

export default async function availability(){
    const session = await authenticateUser();
    const data = await getData(session.user?.id as string);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>In this section you can manage your availability</CardDescription>
            </CardHeader>
            <form action = {updateAvailabilityAction} className="space-y-4">
            <CardContent className="space-y-4">
                    {
                        data.map((item) => (
                            <div className="flex gap-4 flex-col md:flex-row" key = {item.id}>
                                <input type = "hidden" name = {`id-${item.id}`} value = {item.id}/>
                                <div className="flex flex-1 gap-4 items-center min-w-[40%]">
                                    <Switch defaultChecked={item.isActive} name = {`isActive-${item.id}`}/>
                                    {item.day}
                                </div>
                                <Select name = {`fromTime-${item.id}`} defaultValue={item.fromTime}>
                                    <SelectTrigger className="w-full flex-1">
                                        <SelectValue placeholder={item.fromTime} /> 
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlot.map((slot : {
                                            index : string,
                                            time : string
                                        }) => (
                                            <SelectItem key = {slot.index} value = {slot.time}>{slot.time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select name = {`tillTime-${item.id}`} defaultValue = {item.tillTime}>
                                    <SelectTrigger className="w-full flex-1">
                                        <SelectValue placeholder={item.tillTime} /> 
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlot.map((slot : {
                                            index : string,
                                            time : string
                                        }) => (
                                            <SelectItem key = {slot.index} value = {slot.time}>{slot.time}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                         </div>
                        ))
                    }
            </CardContent>            
            <CardFooter>
                <SubmitButton text = "Save Changes"/>
            </CardFooter>
        </form>
        </Card>
    )
}