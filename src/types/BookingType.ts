export type Booking = {
    date: string,
    time: "FM" | "EM" | "Kväll"
    package: "Varm" | "Kall",
    price: number,
    companyName: string,
    numberOfPeople: number,
    numberOfChildren: number,
    phone: string,
    email: string
}