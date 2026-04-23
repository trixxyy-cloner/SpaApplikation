export type Booking = {
    date: string,
    time: "FM" | "EM" | "Kväll" | "10-17",
    package: "Varm" | "Kall" | "Temakur",
    price: number,
    companyName: string,
    numberOfPeople: number,
    numberOfChildren: number,
    phone: string,
    email: string
    isThemeDay?: boolean,
}