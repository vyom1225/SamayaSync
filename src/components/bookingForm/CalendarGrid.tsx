import {useCalendarGrid, useLocale} from 'react-aria';
import {CalendarState} from "react-stately"
import {DateValue} from "@react-types/calendar" 
import {DateDuration , endOfMonth} from "@internationalized/date"
import CalendarCell from './CalendarCell';

function CalendarGrid({ state, offset = {} , isDateUnavailable } : {
    state : CalendarState;
    offset?: DateDuration
    isDateUnavailable ? : (date : DateValue) => boolean
}) {
  let {locale} = useLocale();
  
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  let { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    {
        startDate,
        endDate,
        weekdayStyle : "short"
    },
    state
  );

  return (
    <table {...gridProps} cellPadding={0} className='flex-1'>
      <thead {...headerProps} className='text-sm font-medium '>
        <tr>
          {weekDays.map((day, index) => <th key={index} className="pb-2">{day}</th>)}
        </tr>
      </thead>
      <tbody >
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    currentMonth = {startDate}
                    key={i}
                    state={state}
                    date={date}
                    isUnavailable = {isDateUnavailable?.(date) as boolean}
                  />
                )
                : <td key={i} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CalendarGrid