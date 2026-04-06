export type BrandConfig = {
  logoUrl: string;
  primaryColor: string;
  companyName: string;
  textWord1Color?: string;
  textWord2Color?: string;
  enableGradient?: boolean;
};

export interface BrandContextType {
  brand: BrandConfig;
  updateBrand: (newConfig: Partial<BrandConfig>) => void;
  resetBrand: () => void;
}
