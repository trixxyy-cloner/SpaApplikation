export type PackageType = "Varm" | "Kall";

export interface PriceStructure {
  basePrice: number;
  pricePerPerson: number;
}

export const PACKAGE_PRICES: Record<PackageType, PriceStructure> = {
  
  "Varm": {
    basePrice: 350,
    pricePerPerson: 500,
  },
  "Kall": {
    basePrice: 400,
    pricePerPerson: 700,
  },
};

export const calculateTotalPrice = (
  packageType: PackageType,
  numberOfPeople: number,
  numberOfChildren?: number
): number => {
  let discount: number = 0;
  if (numberOfChildren && numberOfChildren > 0){
    discount= numberOfChildren/2
  }
  const pricing = PACKAGE_PRICES[packageType];
  return pricing.basePrice + pricing.pricePerPerson * (numberOfPeople-discount);
};
