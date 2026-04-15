import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingForm from "./BookingForm";
import useBookings from "../utils/Storage";

interface Holiday {
  datum: string;
  "röd dag": string;
}

interface BookingData {
  package: "Varm" | "Kall";
  companyName: string;
  numberOfPeople: number;
  phone: string;
  email: string;
}

interface SpaCalendarProps {
  onBack: () => void;
}

const SpaCalendar: React.FC<SpaCalendarProps> = ({ onBack }) => {
  const [redDaysList, setRedDaysList] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"FM" | "EM" | "Kväll" | null>(null);
  const { bookTime, isWarmBooked, isColdBooked } = useBookings();

  useEffect(() => {
    const getSwedishHolidays = async () => {
      try {
        const response = await fetch("http://sholiday.faboul.se/dagar/v2.1/2026");
        const data = await response.json();

        const filteredRedDays: Holiday[] = data.dagar.filter(
          (dag: Holiday) => dag["röd dag"] === "Ja"
        );
        setRedDaysList(filteredRedDays);
      } catch (error) {
        console.error("Fel vid hämtning av helgdagar:", error);
      }
    };
    getSwedishHolidays();
  }, []);

  const shouldDisableTile = ({ date }: {date: Date}): boolean => {
    const calenderDateString = date.toLocaleDateString("sv-SE");
    const isMonday = date.getDay() === 1;

    const isHoliday = redDaysList.some(
      (holiday) => holiday.datum === calenderDateString
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;

    return isMonday || isHoliday || isPast;
  }

  const handleDateChange = (value: Date | Date[] | null): void => {
  if (!value) {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    return;
  }
  const date = Array.isArray(value) ? value[0] : value;
  setSelectedDate(date);
  setSelectedTimeSlot(null);
};

  const handleTimeSlotSelect = (timeSlot: "FM" | "EM" | "Kväll"): void => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookingSubmit = (data: BookingData): void => {
    if (!selectedDate || !selectedTimeSlot) return;

    const dateString = selectedDate.toISOString().split("T")[0];

    if (
      data.package === "Varm" &&
      isWarmBooked(dateString, selectedTimeSlot)
    ) {
      alert("Varm är redan bokad denna tid!");
      return;
    }
    if (
      data.package === "Kall" &&
      isColdBooked(dateString, selectedTimeSlot)
    ) {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 py-12 px-4">
        {/* Bakåt knapp */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
        >
          ← Tillbaka till startsidan
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            Välj tid för din bokning
          </h1>
          <p className="text-blue-100 text-lg">
            Vi är stängda måndagar och på svenska helgdagar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Välj datum
              </h2>
              <div className="calendar-wrapper">
                <Calendar
                  tileDisabled={shouldDisableTile}
                  onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                  value={selectedDate}
                  className="w-full"
                />
              </div>

              {selectedDate && (
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-800 font-semibold">
                    Vald dag: {selectedDate.toLocaleDateString("sv-SE")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2 space-y-8">
            {selectedDate && (
              <>
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  isWarmBooked={isWarmBooked}
                  isColdBooked={isColdBooked}
                />

                {selectedTimeSlot && (
                  <BookingForm
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    onSubmit={handleBookingSubmit}
                  />
                )}
              </>
            )}

            {!selectedDate && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-lg text-center">
                <p className="text-amber-800 text-lg font-semibold">
                  👈 Välj ett datum till vänster för att komma igång
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaCalendar;