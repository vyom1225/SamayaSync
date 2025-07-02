import { Button } from "../ui/button"
import {AriaButtonProps , useButton} from "@react-aria/button"
import {mergeProps} from "@react-aria/utils"
import {useFocusRing} from "@react-aria/focus"
import {CalendarState} from "@react-stately/calendar"
import { useRef } from "react";

function CalendarButton(
    props : AriaButtonProps<"button"> & { 
        state?: CalendarState;
        side?: "left" | "right"
    }
) {
  const ref = useRef(null);
  const {buttonProps} = useButton(props , ref); 
  const {focusProps} = useFocusRing();
  return (
    <Button
        variant="outline"
        size = "icon"
        ref = {ref}
        disabled = {props.isDisabled}
        {...mergeProps(buttonProps , focusProps)}
    >{props.children}
    </Button>
  )
}
export default CalendarButton