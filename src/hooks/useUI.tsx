'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ViewMode = 'operator' | 'client';

interface UIContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>('operator');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage na montagem do componente
  useEffect(() => {
    const savedMode = localStorage.getItem('solarvision-viewmode');
    if (savedMode === 'client' || savedMode === 'operator') {
      setViewModeState(savedMode);
    }
    setIsInitialized(true);
  }, []);

  // Persistir no localStorage quando o modo mudar
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('solarvision-viewmode', viewMode);
    }
  }, [viewMode, isInitialized]);

  // Fechar o menu ao mudar de modo para evitar Sidebar aberta sobrepondo
  useEffect(() => {
    setIsMenuOpen(false);
  }, [viewMode]);

  const setViewMode = (mode: ViewMode) => setViewModeState(mode);
  const toggleViewMode = () => setViewModeState(prev => prev === 'operator' ? 'client' : 'operator');
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      toggleViewMode, 
      isMenuOpen, 
      setIsMenuOpen, 
      toggleMenu 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
