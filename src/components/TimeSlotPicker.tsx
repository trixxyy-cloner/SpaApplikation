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
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-blue-800 text-lg">Välj ett datum först</p>
      </div>
    );
  }

  const timeSlots: Array<"FM" | "EM" | "Kväll"> = ["FM", "EM", "Kväll"];
  const dateString = selectedDate.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Välj tid för {selectedDate.toLocaleDateString("sv-SE")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {timeSlots.map((slot) => {
          const warmBooked = isWarmBooked(dateString, slot);
          const coldBooked = isColdBooked(dateString, slot);
          const isSelected = selectedTimeSlot === slot;
          const allBooked = warmBooked && coldBooked;

          return (
            <div
              key={slot}
              className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              } ${allBooked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <button
                onClick={() => onTimeSlotSelect(slot)}
                disabled={allBooked}
                className={`w-full text-2xl font-bold py-3 rounded mb-4 transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : allBooked
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                }`}
              >
                {slot}
              </button>

              <div className="space-y-2">
                <div
                  className={`p-3 rounded text-sm font-semibold ${
                    warmBooked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  ◉ Varm: {warmBooked ? "Bokad" : "Ledig"}
                </div>
                <div
                  className={`p-3 rounded text-sm font-semibold ${
                    coldBooked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  ◉ Kall: {coldBooked ? "Bokad" : "Ledig"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;