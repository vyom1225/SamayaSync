import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks";
import { nylas, nylasConfig } from "@/lib/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";


export async function GET(req : NextRequest){
    const session = await authenticateUser();
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if(!code){
        return Response.json("No authorization code returned from Nylas" , {
            status : 400,
        })
    }

    try{
        const response = await nylas.auth.exchangeCodeForToken({
            code : code,
            clientSecret : nylasConfig.apiKey,
            clientId : nylasConfig.clientId!,
            redirectUri : nylasConfig.redirectUri
        })

        const {grantId , email} = response;

        await prisma.user.update({
            where : {
                id : session.user?.id
            },
            data : {
                grantId : grantId,
                grantEmail : email
            }
        })

    }catch(error){
        console.log("Error Something went wrong", error);
    }

    redirect("/dashboard");
}