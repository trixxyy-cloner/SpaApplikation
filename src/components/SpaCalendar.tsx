import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingForm from "./BookingForm";
import useBookings from "../utils/Storage";

interface Holiday {
  datum: string;
}

const SpaCalendar = () => {
  const [redDaysList, setRedDaysList] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"FM" | "EM" | "Kväll" | null>(null);
  const { bookTime, isWarmBooked, isColdBooked } = useBookings();

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

  const handleDateChange = (value: any) => {
    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  }

  const handleTimeSlotSelect = (timeSlot: "FM" | "EM" | "Kväll") => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookingSubmit = (data: any) => {
    if (!selectedDate) return;

    const dateString = selectedDate.toISOString().split("T")[0];

    if (data.package === "Varm" && isWarmBooked(dateString, selectedTimeSlot)) {
        alert("Varm är redan bokad denna tid!");
        return;
    }
    if (data.package === "Kall" && isColdBooked(dateString, selectedTimeSlot)) {
        alert("Kall är redan bokad denna tid!");
        return;
    }

    bookTime({
        date: dateString,
        time: selectedTimeSlot,
        package: data.package,
        companyName: data.companyName,
        numberOfPeople: data.numberOfPeople,
        phone: data.phone,
        email: data.email,
    });

    alert("Bokning sparad!");
    setSelectedTimeSlot(null);
  }


  return (
    <div>
        <h2>Välj datum</h2>
      <Calendar tileDisabled={shouldDisableTile} onChange={handleDateChange}/>

      {selectedDate && (
        <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            isWarmBooked={isWarmBooked}
            isColdBooked={isColdBooked}
        />
      )}

      {selectedDate && selectedTimeSlot && (
        <BookingForm
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};
export default SpaCalendar;
