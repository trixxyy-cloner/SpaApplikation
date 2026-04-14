import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import TimerSlots from "./TimeSlots";
import '../css/dayTile.css'

const SpaCalendar = () => {
  const [redDaysList, setRedDaysList] = useState<any[]>([]);

  useEffect(() => {
    const getSwedishHolidays = async () => {
      const response = await fetch("http://sholiday.faboul.se/dagar/v2.1/2026");
      const data = await response.json();

      console.log(data.dagar);
      const filteredRedDays = [];

      for (const dag of data.dagar) {
        if (dag["röd dag"] === "Ja" ){
          // console.log(dag);
          filteredRedDays.push(dag)
        }
      }
      setRedDaysList(filteredRedDays);
    };
    getSwedishHolidays();

  },[]
);

  const shouldDisableTile = ({ date } : { date : Date}) => {
    const calendarDateString = date.toLocaleDateString("sv-SE");
    const isMonday = date.getDay() === 1;

    let isHoliday = false;

    for (const holiday of redDaysList){
      if (holiday.datum === calendarDateString){
        isHoliday = true;
      }
    }

    return isMonday || isHoliday;
  }

  return (
    <div>
      <Calendar 
      tileDisabled={shouldDisableTile} 
      tileContent={	({ date, view }) => view === 'month' && !shouldDisableTile({date: date})? <TimerSlots/> : null}
      tileClassName={({date, view}) => view === 'month' && !shouldDisableTile({date: date})? "availibleDay" : null}
      />
    </div>
  );
};
export default SpaCalendar;
