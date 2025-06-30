"use client"
import { useActionState, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { settingsAction } from "@/app/actions"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { settingSchema } from "@/lib/zodSchema"

interface SettingFormProps{
    fullName : string,
    email : string,
    image? : string
}

function SettingsForm({fullName , email , image} : SettingFormProps) {
    const [lastResult , action] = useActionState(settingsAction , undefined);
    const [currentProfileImage , setCurrentProfileImage] = useState(image);

    const [form , fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData , {
                schema : settingSchema
            })
        },
        shouldValidate : "onBlur",
        shouldRevalidate : "onInput"
    })


  return (
     <Card className="">
        <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>Manage your account settings!</CardDescription>
        </CardHeader>
        <form id = {form.id} action = {action} onSubmit = {form.onSubmit}>
           <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                        type = "text" 
                        placeholder={fullName}
                        key = {fields.fullName.key}
                        name = {fields.fullName.name}
                    />
                    <p className="text-red-500">{fields.fullName.errors}</p>
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                        type = "text" 
                        placeholder = {email} 
                        disabled
                    />
                </div>
                <div>
                    <Label>Profile Image</Label>
                    {
                        currentProfileImage ? (
                            <img src = {currentProfileImage} alt = "Profile Image" />
                        ) : (
                            "No Image"
                        )
                    }
                </div>
                <Button>
                    Save Changes
                </Button>
            </CardContent>
        </form>
     </Card>
  )
}
export default SettingsForm