import SettingsForm from "@/components/SettingsForm";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks";
import { notFound } from "next/navigation";

export default async function Settings(){
    const session = await authenticateUser();

    const data = await prisma.user.findUnique({
        where : {
            id : session.user?.id
        },
        select : {
            name : true,
            email : true,
            image : true,
        }
    })
    if(!data){
        return notFound();
    }
    return (
        <SettingsForm
            fullName = {data.name as string } 
            email = {data.email } 
            image = {data.image as string}
         />
    )
}