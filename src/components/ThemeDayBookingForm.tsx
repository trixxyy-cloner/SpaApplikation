import React, { useState } from "react";
import { THEME_DAY_PRICE } from "../constants/themeDays";

interface ThemeDayBookingFormProps {
  selectedDate: Date | null;
  themeDayName: string;
  onSubmit: (data: {
    package: "Temakur";
    companyName: string;
    numberOfPeople: number;
    phone: string;
    email: string;
  }) => void;
}

const ThemeDayBookingForm: React.FC<ThemeDayBookingFormProps> = ({
  selectedDate,
  themeDayName,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    package: "Temakur" as const,
    companyName: "",
    numberOfPeople: 1,
    phone: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.phone || !formData.email) {
      alert("Fyll i alla fält");
      return;
    }

    onSubmit(formData);
    setSubmitted(true);
    setFormData({
      package: "Temakur",
      companyName: "",
      numberOfPeople: 1,
      phone: "",
      email: "",
    });

    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!selectedDate) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-blue-800 text-lg">Välj datum först</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-300">
      {submitted && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✓ Bokningen är registrerad!
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 {themeDayName}</h3>
      <p className="text-amber-700 font-semibold mb-6">
        Heldag 10-17 • {THEME_DAY_PRICE} kr per person
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
            Ditt namn *
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="T.ex. Johan Svensson"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefon *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="070-000 00 00"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            E-post *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johan@example.com"
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition"
        >
          Boka Temakur ({THEME_DAY_PRICE} kr)
        </button>
      </form>
    </div>
  );
};

export default ThemeDayBookingForm;