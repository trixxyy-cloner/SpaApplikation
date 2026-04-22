import React, { useState } from "react";
import { calculateTotalPrice } from "../constants/prices";

interface BookingFormProps {
  selectedDate: Date | null;
  selectedTimeSlot: "FM" | "EM" | "Kväll" | null;
  onSubmit: (data: {
    package: "Varm" | "Kall";
    companyName: string;
    numberOfPeople: number;
    numberOfChildren: number;
    phone: string;
    email: string;
  }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    package: "Varm" as "Varm" | "Kall",
    companyName: "",
    numberOfPeople: 1,
    numberOfChildren: 0,
    phone: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfPeople" ? parseInt(value) : value,
      [name]: name === "numberOfChildren" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.phone || !formData.email) {
      alert("Fyll i alla obligatoriska fält");
      return;
    }

    onSubmit(formData);
    setSubmitted(true);
    setFormData({
      package: "Varm",
      companyName: "",
      numberOfPeople: 1,
      numberOfChildren: 0,
      phone: "",
      email: "",
    });

    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-blue-800 text-lg">Välj datum och tid först</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">

      {submitted && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✓ Bokningen är registrerad!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Selection */}
        <div>
          <label htmlFor="package" className="block text-sm font-semibold text-gray-700 mb-2">
            Välj paket *
          </label>
          <div className="flex gap-4">
            <select
              id="package"
              name="package"
              value={formData.package}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              <option value="Varm">🔥 Varm</option>
              <option value="Kall">❄️ Kall</option>
            </select>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-lg flex items-center whitespace-nowrap">
              {calculateTotalPrice(formData.package, formData.numberOfPeople, formData.numberOfChildren)} kr
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
            Sällskapets namn *
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="T.ex. Familjen Andersson"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Number of People */}
        <div>
          <label htmlFor="numberOfPeople" className="block text-sm font-semibold text-gray-700 mb-2">
            Antal personer *
          </label>
          <input
            id="numberOfPeople"
            type="number"
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min="1"
            max="4"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
          <label htmlFor="numberOfChildren" className="block text-sm font-semibold text-gray-700 mb-2">
            Antal barn (under tolv år)
          </label>
          <input
            id="numberOfChildren"
            type="number"
            name="numberOfChildren"
            value={formData.numberOfChildren}
            onChange={handleChange}
            min="0"
            max={formData.numberOfPeople-1}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefonnummer *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="070-000 00 00"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="namn@example.com"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 duration-300 shadow-lg"
        >
          Bekräfta bokning
        </button>
      </form>
    </div>
  );
};

export default BookingForm;