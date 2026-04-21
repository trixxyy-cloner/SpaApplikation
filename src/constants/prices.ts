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
  packageType: PackageType,
  numberOfPeople: number,
  date?: Date,
): number => {
  const pricing = PACKAGE_PRICES[packageType];
  let total = pricing.basePrice + pricing.pricePerPerson * numberOfPeople;

  //Kolla om det är tisdag för 15%
  if (date && date.getDay() === 2) {
    total *= 0.85; //15% rabatt
  }
  return Math.round(total);
};
