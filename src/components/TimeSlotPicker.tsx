import React from "react";

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTimeSlot: "FM" | "EM" | "Kväll" | null;
  onTimeSlotSelect: (timeSlot: "FM" | "EM" | "Kväll") => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
}) => {
  if (!selectedDate) {
    return <div className="time-slot-picker"><p>Välj ett datum först</p></div>;
  }

  const timeSlots: Array<"FM" | "EM" | "Kväll"> = ["FM", "EM", "Kväll"];

  return (
    <div className="time-slot-picker">
      <h3>Välj tid för {selectedDate.toLocaleDateString("sv-SE")}</h3>
      <div className="slots-container">
        {timeSlots.map((slot) => (
          <div key={slot} className={`slot ${selectedTimeSlot === slot ? "selected" : ""}`}>
            <button onClick={() => onTimeSlotSelect(slot)}>{slot}</button>
            <div className="package-status">
              <p><span className="package-label">Varm:</span> Ledig</p>
              <p><span className="package-label">Kall:</span> Ledig</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;