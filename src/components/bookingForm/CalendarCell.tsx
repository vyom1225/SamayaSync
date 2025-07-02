import {useRef} from "react";
import {useCalendarCell , useFocusRing , mergeProps} from "react-aria"
import {CalendarState} from "react-stately"
import {CalendarDate , isToday , getLocalTimeZone , isSameMonth} from "@internationalized/date"
import { cn } from "@/lib/utils";

function CalendarCell({
    state ,
    date , 
    currentMonth,
    isUnavailable
} : {
    state : CalendarState,
    date : CalendarDate,
    currentMonth : CalendarDate,
    isUnavailable : boolean
}) {

    const isDateToday = isToday(date , getLocalTimeZone());
    const isOutsideMonth = !isSameMonth(currentMonth , date);

    let ref = useRef(null);
    let {
      cellProps,
      buttonProps,
      isSelected,
      isDisabled,
      formattedDate
    } = useCalendarCell({ date }, state, ref);

    const {focusProps , isFocusVisible} = useFocusRing();

    const finallyIsDisabled = isDisabled || isUnavailable
  return (
    <td {...cellProps} className={`p-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}>
        <div  
            {...mergeProps(focusProps , buttonProps)}
            ref = {ref} 
            hidden = {isOutsideMonth}
            className = "size-10 sm:size-12 outline-none group rounded-md relative">
                <div className={cn(
                    "size-full rounded-sm flex items-center justify-center text-sm font-semibold",
                    isSelected ? "bg-primary text-white" : "",
                    finallyIsDisabled ? "text-muted-foreground cursor-not-allowed" : "",
                    !isSelected && !finallyIsDisabled ? "bg-secondary" : ""
                )}>
                    <div className="cursor-default">{formattedDate}</div>
                    {isDateToday && (
                        <div
                            className={cn(
                                "absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-primary rounded-full",
                                isSelected && "bg-white"
                            )}
                        />
                    )}
                </div>
        </div>
    </td>
  )
}
export default CalendarCell