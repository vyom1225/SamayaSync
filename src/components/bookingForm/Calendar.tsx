"use client"

import {useCalendar, useLocale} from 'react-aria';
import {useCalendarState} from 'react-stately';
import {createCalendar} from '@internationalized/date';
import {CalendarProps , DateValue} from "@react-types/calendar"
import CalenderHeader from './CalendarHeader';
import CalendarGrid from "./CalendarGrid"



function Calendar(props : CalendarProps<DateValue> & {
    isDateUnavailable ? : (date : DateValue) => boolean
}) {
   

    const { locale } = useLocale();
    const state = useCalendarState({
      createCalendar,
      ...props,
      visibleDuration : {months : 1},
      locale
    });

    const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
        props,
        state
    );



  return (
    <div {...calendarProps} className="inline-block space-y-2">
        <CalenderHeader 
            calendarProps={calendarProps}
            prevButtonProps={prevButtonProps}
            nextButtonProps={nextButtonProps}
            state = {state}
        />
        <div className='flex gap-8'>
            <CalendarGrid 
                state={state} 
                isDateUnavailable = {props.isDateUnavailable}
            />
        </div>
    </div>
  )
}
export default Calendar