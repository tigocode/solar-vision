import React from 'react';
import { Sun } from 'lucide-react';

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
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <Sun size={iconSize} className="text-white" />
      </div>
      {showText && (
        <span className={`${textSize} font-black text-white tracking-tight`}>
          Solar<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Vision</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
