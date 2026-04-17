export type PackageType = "Varm" | "Kall";

export interface PriceStructure {
  basePrice: number;
  pricePerPerson: number;
}

export const PACKAGE_PRICES: Record<PackageType, PriceStructure> = {
  "Varm": {
    basePrice: 500,
    pricePerPerson: 50,
  },
  "Kall": {
    basePrice: 400,
    pricePerPerson: 35,
  },
};

export const calculateTotalPrice = (
  packageType: PackageType,
  numberOfPeople: number
): number => {
  const pricing = PACKAGE_PRICES[packageType];
  return pricing.basePrice + pricing.pricePerPerson * numberOfPeople;
};
