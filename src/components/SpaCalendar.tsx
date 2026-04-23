import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingForm from "./BookingForm";
import ConfirmationMessage from "./ConfirmationMessage";
import useBookings from "../utils/Storage";
import type { Booking } from "../types/BookingType";
import { calculateTotalPrice } from "../constants/prices";
import { fetchThemeDaysForYear, THEME_DAY_PRICE, type ThemeDay } from "../constants/themeDays";
import ThemeDayBookingForm from "./ThemeDayBookingForm";

interface Holiday {
  datum: string;
  "röd dag": string;
}

interface ConfirmationData {
  name: string;
  date: Date;
  package: string;
  price: number;
  time: string;
}

interface SpaCalendarProps {
  onBack: () => void;
  selectedPackage?: "Varm" | "Kall" | "Temakur" | null;
  selectedThemeDay?: string | null;
  initialThemeDays?: ThemeDay[];
}

const SpaCalendar: React.FC<SpaCalendarProps> = ({ onBack, selectedPackage, selectedThemeDay, initialThemeDays = [] }) => {
  const [redDaysList, setRedDaysList] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"FM" | "EM" | "Kväll" | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const { bookTime, isWarmBooked, isColdBooked, isThemeDayFull } = useBookings();
  
  // Initialisera cached years från initialThemeDays för att undvika duplikat hämtningar
  const getInitialCachedYears = (): Set<number> => {
    const years = new Set<number>();
    initialThemeDays.forEach((td) => {
      const year = parseInt(td.date.split('-')[0], 10);
      years.add(year);
    });
    return years;
  };
  
  const [cachedYears, setCachedYears] = useState<Set<number>>(getInitialCachedYears());
  const [fetchingYears, setFetchingYears] = useState<Set<number>>(new Set());
  const [allThemeDays, setAllThemeDays] = useState<Array<{ date: string; name: string }>>(initialThemeDays);
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());
    

  // Hämtar röda dagar för ett specifikt år
  const fetchRedDaysForYear = async (year: number) => {
    if (cachedYears.has(year) || fetchingYears.has(year)) return;

    setFetchingYears((prev) => new Set([...prev, year]));

    try {
      const response = await fetch(`http://sholiday.faboul.se/dagar/v2.1/${year}`);
      const data = await response.json();

      const filteredRedDays: Holiday[] = data.dagar.filter(
        (dag: Holiday) => dag["röd dag"] === "Ja"
      );

      setRedDaysList((prev) => {
        const withoutYear = prev.filter((rd) => !rd.datum.startsWith(`${year}`));
        return [...withoutYear, ...filteredRedDays];
      });

      setCachedYears((prev) => new Set([...prev, year]));
    } catch (error) {
      console.error(`Fel vid hämtning av röda dagar för ${year}:`, error);
    } finally {
      setFetchingYears((prev) => {
        const next = new Set(prev);
        next.delete(year);
        return next;
      });
    }
  };

  // Hämtar temadagar från API med caching
  const handleFetchThemeDaysForYear = async (year: number) => {
    if (cachedYears.has(year) || fetchingYears.has(year)) return;

    setFetchingYears((prev) => new Set([...prev, year]));

    try {
      const themeDays = await fetchThemeDaysForYear(year);
      setAllThemeDays((prev) => {
        const withoutYear = prev.filter((td) => !td.date.startsWith(year.toString()));
        return [...withoutYear, ...themeDays];
      });
      setCachedYears((prev) => new Set([...prev, year]));
    } catch (error) {
      console.error(`Fel vid hämtning av temadagar för ${year}:`, error);
    } finally {
      setFetchingYears((prev) => {
        const next = new Set(prev);
        next.delete(year);
        return next;
      });
    }
  };

  
  // Förval datum om en temada är vald
  useEffect(() => {
    if (selectedThemeDay) {
      const date = new Date(selectedThemeDay);
      setSelectedDate(date);
      setVisibleMonth(date);
    }
  }, [selectedThemeDay]);

  // Hoppa till nästa framtida temada när Temakur paket väljs
  useEffect(() => {
    if (selectedPackage === "Temakur" && !selectedThemeDay && allThemeDays.length > 0) {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Hitta nästa framtida temada genom att jämföra strängarna direkt
      const nextThemeDay = allThemeDays
        .filter(td => td.date > today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];

      if (nextThemeDay) {
        const date = new Date(nextThemeDay.date);
        setSelectedDate(date);
        setVisibleMonth(date);
      }
    }
  }, [selectedPackage, allThemeDays, selectedThemeDay]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    
    handleFetchThemeDaysForYear(currentYear - 1);
    handleFetchThemeDaysForYear(currentYear);
    handleFetchThemeDaysForYear(currentYear + 1);
    
    fetchRedDaysForYear(currentYear - 1);
    fetchRedDaysForYear(currentYear);
    fetchRedDaysForYear(currentYear + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  const year = visibleMonth.getFullYear();
  
  handleFetchThemeDaysForYear(year - 1);
  handleFetchThemeDaysForYear(year);
  handleFetchThemeDaysForYear(year + 1);
  
  fetchRedDaysForYear(year - 1);
  fetchRedDaysForYear(year);
  fetchRedDaysForYear(year + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonth]);

  const isThemeDay = (date: Date): boolean => {
    const dateString = date.toLocaleDateString("sv-SE");
    return allThemeDays.some((td) => td.date === dateString);
  };
  
  const getThemeDayName = (date: Date): string | null => {
    const dateString = date.toLocaleDateString("sv-SE");
    const found = allThemeDays.find((td) => td.date === dateString);
    return found ? found.name : null;
  };

  const shouldDisableTile = ({ date }: {date: Date}): boolean => {
    const calenderDateString = date.toLocaleDateString("sv-SE");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;

    // Deaktivera om datum redan har passerat (även temadagar)
    if (isPast) {
      return true;
    }

    // Aktivera framtida temadagar
    if (isThemeDay(date)) {
      return false;
    }

    const isMonday = date.getDay() === 1;

    const isHoliday = redDaysList.some(
      (holiday) => holiday.datum === calenderDateString
    );

    return isMonday || isHoliday;
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

  const handleBookingSubmit = (data: Omit<Booking, 'date' | 'time' | 'price'>): void => {
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

    if (data.numberOfChildren > 0 && data.numberOfPeople === 0) {
      alert("Barn måste bokas i sällskap med minst 1 vuxen");
      return;
    }

    const totalPrice = calculateTotalPrice(
      data.package as "Varm" | "Kall",
      data.numberOfPeople,
      data.numberOfChildren,
      selectedDate
    );

    bookTime({
      date: dateString,
      time: selectedTimeSlot,
      package: data.package,
      price: totalPrice,
      companyName: data.companyName,
      numberOfPeople: data.numberOfPeople,
      numberOfChildren: data.numberOfChildren,
      phone: data.phone,
      email: data.email,
      isThemeDay: false,
    });

    setConfirmationData({
      name: data.companyName,
      date: selectedDate,
      package: data.package,
      price: totalPrice,
      time: selectedTimeSlot,
    });

    setSelectedTimeSlot(null);
  };

  const handleThemeDayBooking = (data: Omit<Booking, 'date' | 'time' | 'price' | 'isThemeDay'>): void => {
    if (!selectedDate) return;

    if (data.numberOfChildren > 0) {
      alert("Barn kan inte bokas på tematiska specialdagar");
      return;
    }

    const dateString = selectedDate.toISOString().split("T")[0];

    if (isThemeDayFull(dateString)) {
      alert("Temadagen är fullbokad!");
      return;
    }

    bookTime({
      date: dateString,
      time: "10-17",
      package: "Temakur",
      price: THEME_DAY_PRICE,
      companyName: data.companyName,
      numberOfPeople: 1, // Alltid 1 för temadagar
      numberOfChildren: 0,
      phone: data.phone,
      email: data.email,
      isThemeDay: true,
    });

    setConfirmationData({
      name: data.companyName,
      date: selectedDate,
      package: "Temakur",
      price: THEME_DAY_PRICE,
      time: "10-17",
    });

    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col">
      {confirmationData && (
        <ConfirmationMessage
          isVisible={!!confirmationData}
          name={confirmationData.name}
          date={confirmationData.date}
          package={confirmationData.package}
          price={confirmationData.price}
          time={confirmationData.time}
          onClose={() => setConfirmationData(null)}
        />
      )}

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
              <p className="text-green-600 font-semibold mt-2">
                15% rabatt på alla behandlingar på tisdagar!
              </p>
              <div className="calendar-wrapper">
                <Calendar
                  tileDisabled={shouldDisableTile}
                  onActiveStartDateChange={({ activeStartDate }) => setVisibleMonth(activeStartDate || new Date())}
                  tileClassName={({ date }) => {
                    if (isThemeDay(date)) {
                      return "bg-amber-300 text-amber-900 font-bold";
                    }
                    return "";
                  }}
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
                {isThemeDay(selectedDate) ? (
                  <ThemeDayBookingForm
                    selectedDate={selectedDate}
                    themeDayName={getThemeDayName(selectedDate) || "Temakur"}
                    onSubmit={handleThemeDayBooking}
                  />
                ) : (
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
                      defaultPackage={selectedPackage === "Varm" || selectedPackage === "Kall" ? selectedPackage : undefined}
                    />
                  )}
                  </>
                )}
              </>
            )}

            {!selectedDate && (
              <div className="hidden md:block bg-amber-50 border-l-4 border-amber-500 p-8 rounded-lg text-center">
                <p className="text-amber-800 text-lg font-semibold">
                  Välj ett datum för att komma igång
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