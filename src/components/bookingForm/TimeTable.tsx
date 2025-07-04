
import Link from 'next/link';
import { Button } from '../ui/button';
import { format } from 'date-fns';



export async function TimeTable({availableSlots , selectedDate} : {
    availableSlots : string[],
    selectedDate : Date
}){


    return (
        <div>
            <p className='text-base font-semibold'>
                {format(selectedDate , "EEE")}{" "}
                <span className='text-sm text-muted-foreground'>
                    {format(selectedDate , "MMM. d")}
                </span>
            </p>
            <div className="mt-3 max-h-[350px] overflow-y-auto">
                {
                    availableSlots.length > 0 ? (
                        availableSlots.map((slot , index) => (
                            <Link href = {`?date=${format(selectedDate , "yyyy-MM-dd")}&time=${slot}`} key = {index}>
                                <Button variant="outline" className="w-full mb-2">
                                    {slot}
                                </Button>
                            </Link>
                        ))
                    ) : (
                        <div className='w-full'>No time slots available</div>
                    )   
                }
            </div>
        </div>
    )
}