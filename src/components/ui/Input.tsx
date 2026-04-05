import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
      <label 
        htmlFor={inputId}
        className="text-xs font-bold text-slate-600 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={`
          px-4 py-2.5 rounded-lg border bg-slate-50 outline-none transition-all text-sm text-slate-700
          focus:bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
          ${error ? 'border-red-500 bg-red-50' : 'border-slate-200'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{error}</p>}
    </div>
  );
};

export default Input;
