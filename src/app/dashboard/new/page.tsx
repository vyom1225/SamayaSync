import { SubmitButton } from "@/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

function newPageRoute() {
  return (
    <div className="flex justify-center">
        <Card className="md:w-[50%]">
            <CardHeader>
                <CardTitle>Add new appointment type</CardTitle>
                <CardDescription>Create new appointment type that allows people to book you!</CardDescription>
            </CardHeader>
            <form>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input placeholder = "30 Minute Meeting"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>URL Slug</Label>
                        <div className="flex">
                            <span className="rounded-l-sm bg-primary/10 p-2 text-sm ">Samaya.com/</span>
                            <Input placeholder = "30 Minute Meeting" className="rounded-l-none"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Description</Label>
                        <Textarea placeholder = "Meet me in this meeting to meet me!"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Duration</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 Mins</SelectItem>
                                <SelectItem value="30">30 Mins</SelectItem>
                                <SelectItem value="45">45 Mins</SelectItem>
                                <SelectItem value="60">1 Hour</SelectItem>               
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Video Call Provider</Label>
                        <div className="flex justify-between">
                            <Button variant="outline">Google Meet</Button>
                            <Button variant="outline">Zoom</Button>
                            <Button variant="outline">Microsoft Teams</Button>
                        </div>
                        
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline">
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