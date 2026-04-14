import { useState, useEffect } from "react";

const useBookings = () => {
  const [bookedTimes, setBookedTimes] = useState<any[]>([]);

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

  //Kollar om en tid redan är bokad
  const isBooked = (date: string, timeSlot: string) => {
    return bookedTimes.some(
      (booked) => booked.date === date && booked.time === timeSlot,
    );
  };

  return { bookedTimes, bookTime, isBooked };
};

export default useBookings;