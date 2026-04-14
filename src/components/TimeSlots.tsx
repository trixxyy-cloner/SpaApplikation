import '../css/TimeSlot.css'

export default function TimerSlots({day}: {day: Date}){
    //needs local storage to find booked timeslots
    
    return(
        <>
            <p>Varm: FM</p>
            <p>Kall: FM</p>
            <p>Varm: EM</p>
            <p>Kall: EM</p>
            <p>Varm: Kväll</p>
            <p>Kall: Kväll</p>
        </>
    )
}