import "./App.css";
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import SpaCalendar from "./components/SpaCalendar";
import { fetchThemeDaysForYear, type ThemeDay } from "./constants/themeDays";

const App = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"Varm" | "Kall" | "Temakur" | null>(null);
  const [selectedThemeDay, setSelectedThemeDay] = useState<string | null>(null);
  const [allThemeDays, setAllThemeDays] = useState<ThemeDay[]>([]);

  // Hämta temadagar för 3 år (förra, denna, nästa) - körs bara en gång
  useEffect(() => {
    let isActive = true; // Track om denna effect är fortfarande aktiv

    const currentYear = new Date().getFullYear();
    const yearsToFetch = [currentYear - 1, currentYear, currentYear + 1];

    const fetchAll = async () => {
      const allDays: ThemeDay[] = [];
      
      for (const year of yearsToFetch) {
        if (!isActive) return; // Avbryt om effect har rensats
        const themeDays = await fetchThemeDaysForYear(year);
        allDays.push(...themeDays);
      }

      if (!isActive) return; // Avbryt före state-uppdatering

      // Deduplicera och sortera
      const dedupMap = new Map<string, ThemeDay>();
      allDays.forEach(td => dedupMap.set(td.date, td));
      
      const sorted = Array.from(dedupMap.values()).sort((a, b) => 
        a.date.localeCompare(b.date)
      );

      if (isActive) {
        setAllThemeDays(sorted); // Bara uppdatera om effect är aktiv
      }
    };

    fetchAll();

    // Cleanup: markera som inaktiv
    return () => {
      isActive = false;
    };
  }, []);

  const handleSelectPackage = (packageType: "Varm" | "Kall" | "Temakur") => {
    setSelectedPackage(packageType);
    setShowBooking(true);
  };

  const handleSelectThemeDay = (date: string) => {
    setSelectedThemeDay(date);
    setShowBooking(true);
  };

  return (
    <>
      {!showBooking ? (
        <HomePage 
          onSelectPackage={handleSelectPackage}
          onSelectThemeDay={handleSelectThemeDay}
          themeDays={allThemeDays}
        />
      ) : (
        <SpaCalendar 
          onBack={() => {
            setShowBooking(false);
            setSelectedPackage(null);
            setSelectedThemeDay(null);
          }}
          selectedPackage={selectedPackage}
          selectedThemeDay={selectedThemeDay}
          initialThemeDays={allThemeDays}
        />
      )}
    </>
  );
};

export default App;