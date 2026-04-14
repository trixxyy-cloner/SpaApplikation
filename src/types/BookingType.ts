export type Booking = {
    date: string,
    time: "FM" | "EM" | "Kväll"
    package: "Varm" | "Kall",
    companyName: string,
    numberOfPeople: number,
    phone: string,
    email: string
}