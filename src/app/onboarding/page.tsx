"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticateUser } from "@/lib/hooks"
import { useActionState } from "react";
import { onBoardingAction } from "../actions";
import { useForm } from '@conform-to/react';
import { parseWithZod } from "@conform-to/zod";
import { onBoardingSchema } from "@/lib/zodSchema";
import { SubmitButton } from "@/components/SubmitButtons";

export default function OnBoardingRoute() {
  const session = authenticateUser();
  const [lastResult , action] = useActionState(onBoardingAction , undefined)

  const [form , fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData , {
                schema : onBoardingSchema,
            })
        },
        shouldValidate : "onBlur",
        shouldRevalidate : "onInput"    
  })
 
  return (
    <div className="flex justify-center items-center h-screen w-full">
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle className="text-3xl">Welcome to 
                    <span className="text-primary"> Samaya</span></CardTitle>
                <CardDescription>We need the following information to set up your profile!</CardDescription>
            </CardHeader>
            <form id = {form.id} onSubmit={form.onSubmit} action = {action} noValidate>
                <CardContent className="flex flex-col gap-6">         
                    <div className="flex flex-col gap-2">
                        <Label>Full Name</Label>    
                        <Input placeholder = "Vyom Rastogi"
                               name = {fields.fullName.name}
                               key = {fields.fullName.key}
                               defaultValue = {fields.fullName.initialValue}    
                        ></Input>
                        <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>UserName</Label>
                        <div className="flex">
                            <span className="p-2 text-sm bg-gray-100 rounded-l-md ">Samaya.com/</span>
                            <Input placeholder = "example-user-1" className="rounded-l-none "
                                    name = {fields.userName.name}
                                    key = {fields.userName.key}
                                    defaultValue = {fields.userName.initialValue} 
                            ></Input>
                        </div> 
                        <p className="text-red-500 text-sm">{fields.userName.errors}</p>  
                    </div>      
                </CardContent>
                <CardFooter className="mt-4">
                    <SubmitButton text = "Submit" />
                </CardFooter>
            </form>
        </Card>
    </div>
    
  )
}
