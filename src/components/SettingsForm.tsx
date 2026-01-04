"use client"
import { useActionState, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { settingsAction } from "@/app/actions"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { settingSchema } from "@/lib/zodSchema"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"
import { X } from "lucide-react"

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
                <div className="flex flex-col gap-2">
                    <input type = "hidden"
                           name = {fields.profileImage.name}
                           key = {fields.profileImage.key}
                           value = {currentProfileImage}
                    />
                    <Label>Profile Image</Label>       
                    <div>
                        {
                            currentProfileImage ? (
                                <div className="size-16 relative mt-4 ">
                                    <img src = {currentProfileImage} alt = "Profile Image" className="size-16" />
                                    <Button variant="destructive" 
                                            className="rounded-full  w-full size-4 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex justify-center items-center"
                                            onClick={() => (
                                                setCurrentProfileImage("")
                                            )}
                                            type = "button"
                                    >
                                        <X className="size-4"/>
                                    </Button>
                                </div>
                               
                        ) : (  
                                <UploadButton endpoint="imageUploader" 
                                   
                                    onClientUploadComplete={(res) => {
                                        console.log(res)
                                        //setCurrentProfileImage(res[0])
                                        toast.success("Profile Image is uploaded Successfully")
                                    }}
                                    onUploadError={(error) => {
                                        console.log("Something went wrong", error)
                                        toast.error(error.message)
                                    }}
                                    className="max-h-[160px] w-full"
                                />
                        )}
                    </div>  
                    <p className="text-red-500 text-sm">{fields.profileImage.errors}</p> 
                </div>
            </CardContent>
            <CardFooter>
                <Button className="mt-4">
                    Save Changes
                </Button>
            </CardFooter>
        </form>
     </Card>
  )
}
export default SettingsForm