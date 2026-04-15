import { useState, useEffect } from "react";

const useBookings = () => {
  const [bookedTimes, setBookedTimes] = useState<any[]>(() => {
    const saved = localStorage.getItem("bookedTimes");
    return saved ? JSON.parse(saved) : [];
  });

  // Sparar varje gång det ändras
  useEffect(() => {
    localStorage.setItem("bookedTimes", JSON.stringify(bookedTimes));
  }, [bookedTimes]);

  const bookTime = (time: any): void => {
    setBookedTimes((prev: any[]) => [...prev, time]);
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

  return { bookedTimes, bookTime, isWarmBooked, isColdBooked };
};

export default useBookings;