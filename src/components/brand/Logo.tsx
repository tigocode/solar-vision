'use client';

import React from 'react';
import { Sun } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconSize = 24, 
  textSize = 'text-xl',
  showText = true 
}) => {
  const { brand } = useBrand();

  const parts = brand.companyName.trim().split(' ');
  const word1 = parts[0] || '';
  const word2 = parts.length > 1 ? parts.slice(1).join(' ') : '';
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`flex items-center space-x-3 overflow-hidden ${className}`}>
      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        {(!brand.logoUrl || imgError) ? (
          <div className="w-full h-full bg-primary flex items-center justify-center text-white">
            <Sun size={iconSize} />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={brand.logoUrl} 
            alt="Logo da Marca" 
            className="w-full h-full object-contain p-1" 
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {showText && (
        <span className={`${textSize} font-black text-white tracking-tight truncate flex gap-1`}>
          <span style={{ color: 'var(--word1-color)' }}>{word1}</span>
          {word2 && (
            <span 
              className={brand.enableGradient ? "text-transparent bg-clip-text bg-gradient-to-r" : ""}
              style={brand.enableGradient ? {
                backgroundImage: `linear-gradient(to right, var(--word1-color, #ffffff), var(--word2-color))`
              } : {
                color: 'var(--word2-color)'
              }}
            >
              {word2}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default Logo;
