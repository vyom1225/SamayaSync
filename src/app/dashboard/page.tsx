import EmptyState from "@/components/EmptyState";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/hooks"
import { Description } from "@radix-ui/react-dialog";
import { notFound } from "next/navigation";

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
            }
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}

async function DashboardPage() {
   const session = await authenticateUser();
   const data = getData(session.user?.id as string);

  return (
    <EmptyState
        title = "You have no Event Types"
        description = "You can create your first event type by clicking the button below"
        buttonText = "Add Event Type"
        href = "/dashboard/new"
    />
  )
}export default DashboardPage
