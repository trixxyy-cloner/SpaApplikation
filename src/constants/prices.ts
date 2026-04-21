export type PackageType = "Varm" | "Kall";

export interface PriceStructure {
  basePrice: number;
  pricePerPerson: number;
}

export const BASE_PRICE = 350; // Ny price-point

export const PACKAGE_PRICES: Record<PackageType, PriceStructure> = {
  "Varm": {
    basePrice: BASE_PRICE,
    pricePerPerson: 700,
  },
  "Kall": {
    basePrice: BASE_PRICE,
    pricePerPerson: 500,
  },
};

export const calculateTotalPrice = (
  packageType: PackageType,
  numberOfPeople: number
): number => {
  const pricing = PACKAGE_PRICES[packageType];
  return pricing.basePrice + pricing.pricePerPerson * numberOfPeople;
};
