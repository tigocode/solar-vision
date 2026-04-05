import React from 'react';

export type UserRole = 'operator' | 'client' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  hrefPath?: string; // Caminho para navegação real
  icon: React.ReactNode;
  roles?: UserRole[]; // Se omitido, visível para todos
  category: 'overview' | 'operational' | 'management';
}
