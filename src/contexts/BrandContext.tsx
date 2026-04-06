'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrandConfig, BrandContextType } from '@/types/brand';

const DEFAULT_BRAND: BrandConfig = {
  logoUrl: '', // String Vazia resolve o erro 404 e ativa o Fallback em SVG.
  primaryColor: '#4f46e5', // Indigo 600 (Padrão Tailwind)
  companyName: 'Solar Vision',
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);

  // Injeção Dinâmica de CSS (Coração do White-label - Ciclo 9)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', brand.primaryColor);
      root.style.setProperty('--word1-color', brand.textWord1Color || ''); // Vazio permite fallback das classes text-xxx locais
      root.style.setProperty('--word2-color', brand.textWord2Color || brand.primaryColor); // Fallback automático da Word2 p/ primária
    }
  }, [brand.primaryColor, brand.textWord1Color, brand.textWord2Color]);

  const updateBrand = (newConfig: Partial<BrandConfig>) => {
    setBrand((curr) => ({ ...curr, ...newConfig }));
  };

  const resetBrand = () => {
    setBrand(DEFAULT_BRAND);
  };

  return (
    <BrandContext.Provider value={{ brand, updateBrand, resetBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand deve ser usado dentro de um BrandProvider');
  }
  return context;
};
