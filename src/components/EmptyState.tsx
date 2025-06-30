import { Ban, Plus } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

interface iAppProps{
    title : string,
    description : string,
    buttonText : string,
    href : string
}

function EmptyState({title , description , buttonText , href} : iAppProps) {
  return (
    <div className="flex justify-center items-center h-full flex-col gap-4">
        <div className="bg-muted-foreground/20 w-[80px] h-[80px] rounded-full flex justify-center
            items-center            ">
            <Ban className="h-8 w-8 text-primary"/>
        </div>
        <div>
            <div className="font-medium text-lg text-center">{title}</div>
            <div className="text-sm text-gray-500 text-break text-center">{description}</div>
        </div>
        <Button className="mt-4">
            <Link href = {href} className="flex items-center gap-2">
                <Plus/>
                {buttonText}
            </Link>
        </Button>
       
    </div>
  )
}
export default EmptyState