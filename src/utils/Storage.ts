import { useState, useEffect } from "react";
import type { Booking } from "../types/BookingType";

const useBookings = () => {
  const [bookedTimes, setBookedTimes] = useState<Booking[]>([]);

  //Hämta från localstorage vid start
  useEffect(() => {
    const saved = localStorage.getItem("bookedTimes");
    if (saved) {
      setBookedTimes(JSON.parse(saved));
    }
  }, []);

  //Sparar varje gång det ändras
  useEffect(() => {
    localStorage.setItem("bookedTimes", JSON.stringify(bookedTimes));
  }, [bookedTimes]);

  const bookTime = (time: any): void => {
    setBookedTimes((prev: any[]) => [...prev, time]);
  };

  //Kollar om varm är bokad
  const isWarmBooked = (date: string, timeSlot: string) => {
    return bookedTimes.some(
      (booked) => booked.date === date && booked.time === timeSlot && booked.package === "Varm"
    );
  };

  //Kollar om kall är bokad
  const isColdBooked = (date: string, timeSlot: string) => {
    return bookedTimes.some(
      (booked) => booked.date === date && booked.time === timeSlot && booked.package === "Kall"
    );
  };

  return { bookedTimes, bookTime, isWarmBooked, isColdBooked };
};

export default useBookings;