"use client"

import { UpdateEventSwitchAction } from "@/app/actions"
import { Switch } from "./ui/switch"
import { useActionState, useEffect, useTransition } from "react"
import { toast } from "sonner";

function EventSwitch({
    initialChecked , 
    eventTypeId ,
} : {
    initialChecked : boolean,
    eventTypeId : string 
}) {
  const [isPending , startTransition] = useTransition();

  const [state , action] = useActionState(UpdateEventSwitchAction , undefined)

  useEffect(()=>{
     if(state?.status === "success"){
        toast.success(state.message)
     }else if(state?.status === "error"){
        toast.error(state.message)
     }

  } , [state])
  return (
     <Switch disabled = {isPending} 
             defaultChecked= {initialChecked}
             onCheckedChange={(isChecked) => {
                startTransition(() => {
                    action({
                        eventTypeId : eventTypeId,
                        isChecked : isChecked
                    })
                })
             }}
     />
  )
}
export default EventSwitch