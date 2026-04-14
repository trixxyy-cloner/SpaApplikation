import React from "react";

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTimeSlot: "FM" | "EM" | "Kväll" | null;
  onTimeSlotSelect: (timeSlot: "FM" | "EM" | "Kväll") => void;
  isWarmBooked: (date: string, time: string) => boolean;
  isColdBooked: (date: string, time: string) => boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
  isWarmBooked,
  isColdBooked,
}) => {
  if (!selectedDate) {
    return <div className="time-slot-picker"><p>Välj ett datum först</p></div>;
  }

  const timeSlots: Array<"FM" | "EM" | "Kväll"> = ["FM", "EM", "Kväll"];
  const dateString = selectedDate.toISOString().split("T")[0];

  return (
    <div className="time-slot-picker">
      <h3>Välj tid för {selectedDate.toLocaleDateString("sv-SE")}</h3>
      <div className="slots-container">
        {timeSlots.map((slot) => {
          const warmBooked = isWarmBooked(dateString, `${slot}`);
          const coldBooked = isColdBooked(dateString, `${slot}`);

          return (
            <div key={slot} className={`slot ${selectedTimeSlot === slot ? "selected" : ""}`}>
              <button
                onClick={() => onTimeSlotSelect(slot)}
                disabled={warmBooked && coldBooked}
              >
                {slot}
              </button>
              <div className="package-status">
                <p><span className={warmBooked ? "booked" : "available"}>Varm: {warmBooked ? "Bokad" : "Ledig"}</span></p>
                <p><span className={coldBooked ? "booked" : "available"}>Kall: {coldBooked ? "Bokad" : "Ledig"}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;