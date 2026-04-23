import "./App.css";
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import HomePage from "./components/HomePage";
import SpaCalendar from "./components/SpaCalendar";

const App = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"Varm" | "Kall" | "Temakur" | null>(null);
  const [selectedThemeDay, setSelectedThemeDay] = useState<string | null>(null);

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
        />
      )}
    </>
  );
};

export default App;