"use client"
import { toast } from "sonner"
import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu"

function CopyLinkMenu({meetingUrl} : {meetingUrl : string}) {

    const handleCopy = async () => {
        try{
            await navigator.clipboard.writeText(meetingUrl);
            toast.success("URL has been copied")
        }catch(err){
            toast.error("Could not copy the url")
        }
    }

  return (
    <DropdownMenuItem onSelect = {handleCopy}>
        <Link2 className="size-4"/>
        Copy
    </DropdownMenuItem>
  )
}
export default CopyLinkMenu