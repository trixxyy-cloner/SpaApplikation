import "./App.css";
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import HomePage from "./components/HomePage";
import SpaCalendar from "./components/SpaCalendar";

const App = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      {!showBooking ? (
        <HomePage onStartBooking={() => setShowBooking(true)} />
      ) : (
        <SpaCalendar onBack={() => setShowBooking(false)} />
      )}
    </>
  );
};

export default App;