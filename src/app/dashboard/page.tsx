import EmptyState from "@/components/EmptyState";
import { SubmitButton } from "@/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks"
import { Link2, Pen, Settings, SquareArrowOutUpRight, Trash, UsersRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function getData(userId : string){
    const data = await prisma.user.findUnique({
        where : {
            id : userId
        },
        select : {
            eventType : {
                select : {
                    id : true,
                    title : true,
                    duration : true,
                    active : true,
                    url : true
                }
            },
            username : true
        }
    })

    if(!data){
        return notFound();
    }


    return data;
}

async function DashboardPage() {
   const session = await authenticateUser();
   const data = await getData(session.user?.id as string);

  return (
        data.eventType.length === 0 ? (
            <EmptyState
                title = "You have no Event Types"
                description = "You can create your first event type by clicking the button below"
                buttonText = "Add Event Type"
                href = "/dashboard/new"
            />
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between ">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-semibold">Event Types</div>
                        <div className="text-gray-500 text-sm">Create and manage your event types right here :</div>
                    </div>
                    <div className="hidden md:flex">
                        <Button>
                            <Link href= "/dashboard/new">
                                Create New Event
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex w-full justify-start gap-4 flex-wrap">
                     {data.eventType.map((item , index) => (
                        <div className = "border-1 border-gray-200 rounded-sm relative min-w-[300px] " key = {index}>
                            <div className="flex items-center gap-4 p-4">
                                <UsersRound />
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-sm">{item.duration} Minutes Meeting</p>
                                    <p className="text-semibold text-lg">{item.title}</p>
                                </div>
                            </div>
                            <div className="bg-primary-foreground p-4 flex justify-between items-center">
                                <Switch/>
                                <SubmitButton text="Edit Event"/>
                            </div>
                            <div className="absolute top-2 right-2 border-primary-foreground border-1 p-2 rounded-sm">
                                <DropdownMenu>
                                    <DropdownMenuTrigger><Settings className=" text-sm size-4" /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Event</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem>
                                            <Link href = {`/${data.username}/${item.url}`} className="flex gap-2 items-center">
                                                <SquareArrowOutUpRight/>
                                                Preview
                                            </Link>      
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link2/>
                                            Copy
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Pen/>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Trash/>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )      
  )
}export default DashboardPage
