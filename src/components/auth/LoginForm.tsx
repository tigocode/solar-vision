'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LoginCredentials } from '@/types/auth';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password, rememberMe });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <Input
        label="E-mail"
        type="email"
        placeholder="vitor@facilitair.com.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      
      <div className="space-y-1">
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex justify-end">
          <a href="#" className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider transition-colors">
            Esqueci a senha
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex items-center h-5">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
          />
        </div>
        <label htmlFor="remember-me" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
          Lembrar-me
        </label>
      </div>

      <Button type="submit" size="full" className="mt-2">
        Entrar
      </Button>
    </form>
  );
};

export default LoginForm;
