import React, { useState } from "react";

interface BookingFormProps {
    selectedDate: Date | null;
    selectedTimeSlot: "FM" | "EM" | "Kväll" | null;
    onSubmit: (data: {
        package: "Varm" | "Kall";
        companyName: string;
        numberOfPeople: number;
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
    phone: "",
    email: "",
  });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "numberOfPeople" ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTimeSlot) {
            alert("Välj datum och tid först");
            return;
        }
        onSubmit(formData);
        setFormData({
            package: "Varm",
            companyName: "",
            numberOfPeople: 1,
            phone: "",
            email: "",
        });
    };

    if (!selectedDate || !selectedTimeSlot) {
        return <div className="booking-form"><p>Välj datum och tid först</p></div>;
    }

    return (
        <div className="booking-form">
            <h3>Bokningsformulär</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="package">Välj paket:</label>
                    <select
                        id="package"
                        name="package"
                        value={formData.package}
                        onChange={handleChange}
                    >
                        <option value="Varm">Varm</option>
                        <option value="Kall">Kall</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="companyName">Sällskapets namn:</label>
                    <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfPeople">Antal personer:</label>
                    <input
                        id="numberOfPeople"
                        type="number"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Telefon:</label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Bekräfta bokning</button>
            </form>
        </div>
    );
};

export default BookingForm;