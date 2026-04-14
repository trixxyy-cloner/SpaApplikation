import '../css/TimeSlot.css'
import type { Booking } from '../types/BookingType'
import useBookings from '../utils/Storage'

//!!! Property bookedTimes is a placeholder because bookedTimes state wasn't working !!!

export default function TimerSlots({day, bookedTimes}: {day: string, bookedTimes: Booking[]}){
    //needs local storage to find booked timeslots
    //const { bookedTimes } = useBookings();
    //Check if their is any bookings on this day
    const todaysBookings = bookedTimes.filter((booking) => booking.date == day)
    
    console.log(todaysBookings)
    const handleBookings = (time: string, packaged: string) => {
        return todaysBookings.some((booking) => booking.package === packaged&& booking.time === time)
    }

    return(
        <>
            <p className={handleBookings("FM", "Varm")? 'isBooked' : ''}>Varm: FM</p>
            <p className={handleBookings("FM", "Kall")? 'isBooked' : ''}>Kall: FM</p>
            <p className={handleBookings("EM", "Varm")? 'isBooked' : ''}>Varm: EM</p>
            <p className={handleBookings("EM", "Kall")? 'isBooked' : ''}>Kall: EM</p>
            <p className={handleBookings("Kväll", "Varm")? 'isBooked' : ''}>Varm: Kväll</p>
            <p className={handleBookings("Kväll", "Kall")? 'isBooked' : ''}>Kall: Kväll</p>
        </>
    )
}