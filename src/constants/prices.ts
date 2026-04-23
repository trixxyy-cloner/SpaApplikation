export type PackageType = "Varm" | "Kall";

export interface PriceStructure {
  basePrice: number;
  pricePerPerson: number;
}

export const BASE_PRICE = 350; // Ny price-point

export const PACKAGE_PRICES: Record<PackageType, PriceStructure> = {
  Varm: {
    basePrice: BASE_PRICE,
    pricePerPerson: 700,
  },
  Kall: {
    basePrice: BASE_PRICE,
    pricePerPerson: 500,
  },
};

export const calculateTotalPrice = (
  packageType: "Varm" | "Kall",
  numberOfPeople: number,
  numberOfChildren: number = 0,
  date?: Date
): number => {
  const pricing = PACKAGE_PRICES[packageType];
  const pricePerPerson = pricing.basePrice + pricing.pricePerPerson;

  // Vuxenpris
  const adultsPrice = pricePerPerson * numberOfPeople;

  // Barnpris (50% rabatt per barn)
  const childPrice = (pricePerPerson * 0.5) * numberOfChildren;

  // Totala före tisdags-rabatt
  let total = adultsPrice + childPrice;

  // Tisdags-rabatten
  if (date && date.getDay() === 2) {
    total = total * 0.85;
  }

  return Math.round(total);
}
