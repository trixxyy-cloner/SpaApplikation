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
  numberOfChildren: number = 0,
  date?: Date,
): number => {
  
  const pricing = PACKAGE_PRICES[packageType];
  const numberOfAdults = numberOfPeople - numberOfChildren;
  let total = pricing.basePrice + pricing.pricePerPerson * (numberOfAdults + numberOfChildren/2);

  //Kolla om det är tisdag för 15%
  if (date && date.getDay() === 2) {
    total *= 0.85; //15% rabatt
  }
  return Math.round(total);
};
