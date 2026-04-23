import { useState, useEffect } from "react";
import type { Booking } from "../types/BookingType";

const useBookings = () => {
  const [bookedTimes, setBookedTimes] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem("bookedTimes");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Fel vid hämtning från localStorage", error);
      return[];
    }
  });

  // Sparar varje gång det ändras
  useEffect(() => {
    try {
      localStorage.setItem("bookedTimes", JSON.stringify(bookedTimes));
    } catch (error) {
      console.error("Fel vid sparning till localStorage", error);
    }
  }, [bookedTimes]);

  const bookTime = (time: Booking): void => {
    setBookedTimes((prev: Booking[]) => [...prev, time]);
  };

  const isWarmBooked = (date: string, timeSlot: string) => {
    return bookedTimes.some(
      (booked) => booked.date === date && booked.time === timeSlot && booked.package === "Varm"
    );
  };

  const isColdBooked = (date: string, timeSlot: string) => {
    return bookedTimes.some(
      (booked) => booked.date === date && booked.time === timeSlot && booked.package === "Kall"
    );
  };

  const getThemeDayBookings = (date: string): Booking[] => {
    return bookedTimes.filter(b => b.date === date && b.isThemeDay);
  };

  const getAvailableSeatsOnThemeDay = (date: string): number => {
    const bookings = getThemeDayBookings(date);
    return 10 - bookings.length;
  };

  const isThemeDayFull = (date: string): boolean => {
    return getAvailableSeatsOnThemeDay(date) <= 0;
  };

  return {
    bookedTimes,
    bookTime,
    isWarmBooked,
    isColdBooked,
    getThemeDayBookings,
    getAvailableSeatsOnThemeDay,
    isThemeDayFull
  };
  
};

export default useBookings;