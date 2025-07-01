"use client"
import { newEventTypeAction } from "@/app/actions"
import ButtonGroup from "@/components/ButtonGroup"
import { SubmitButton } from "@/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { newEventTypeSchema } from "@/lib/zodSchema"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Link from "next/link"
import { useActionState, useState } from "react"

function newPageRoute() {
    const [selectedSoftware, setSelectedSoftware] = useState("Google Meet");

    const [lastResult, formAction] = useActionState(newEventTypeAction, undefined);

    const [form , field] = useForm({
        lastResult ,

        onValidate : ({formData}) => {
            return parseWithZod(formData , {
                schema : newEventTypeSchema
            })
        },

        shouldValidate : "onBlur",
        shouldRevalidate : "onInput"
    })


  return (
    <div className="flex justify-center">
        <Card className="md:w-[50%]">
            <CardHeader>
                <CardTitle>Add new appointment type</CardTitle>
                <CardDescription>Create new appointment type that allows people to book you!</CardDescription>
            </CardHeader>
            <form action = {formAction} id = {form.id} onSubmit = {form.onSubmit} noValidate>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input placeholder = "30 Minute Meeting"
                            key = {field.title.key} 
                            name = {field.title.name}
                            defaultValue={field.title.initialValue}
                        />
                        <p className = "text-red-500">{field.title.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>URL Slug</Label>
                        <div className="flex">
                            <span className="rounded-l-sm bg-primary/10 p-2 text-sm ">Samaya.com/</span>
                            <Input placeholder = "30 Minute Meeting" className="rounded-l-none"
                                    key = {field.url.key}
                                    name = {field.url.name}
                                    defaultValue={field.url.initialValue}
                            />
                        </div>
                        <p className="text-red-500">{field.url.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Description</Label>
                        <Textarea placeholder = "Meet me in this meeting to meet me!"
                            key = {field.description.key}
                            name = {field.description.name}
                            defaultValue={field.url.initialValue}
                        />
                        <p className="text-red-500">{field.description.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Duration</Label>
                        <Select 
                            name = {field.duration.name}
                            key = {field.duration.key}
                            defaultValue = {field.duration.initialValue}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Duration"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 Mins</SelectItem>
                                <SelectItem value="30">30 Mins</SelectItem>
                                <SelectItem value="45">45 Mins</SelectItem>
                                <SelectItem value="60">1 Hour</SelectItem>               
                            </SelectContent>
                        </Select>
                        <p className="text-red-500">{field.duration.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <input type="hidden" 
                               name = {field.videoCallSoftware.name}
                               value = {selectedSoftware}
                        />
                        <Label>Video Call Provider</Label>
                        <ButtonGroup selected={selectedSoftware} setSelected={setSelectedSoftware}/>     
                    </div>
                    <div className="flex justify-between mt-2">
                        <Button variant="outline" asChild>
                            <Link href = "/dashboard">Cancel</Link>
                        </Button>
                        <SubmitButton text = "Create Event Type"/>
                    </div>
                </CardContent>
            </form>
        </Card>
    </div>
  )
}
export default newPageRoute