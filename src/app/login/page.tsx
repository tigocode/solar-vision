'use client';

import React from 'react';
import Logo from '@/components/brand/Logo';
import LoginForm from '@/components/auth/LoginForm';
import { LoginCredentials } from '@/types/auth';

const LoginPage = () => {
  const handleLogin = (credentials: LoginCredentials) => {
    console.log('Login attempt:', credentials);
    // Lógica de autenticação virá na próxima fase
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-slate-900 font-sans">
      
      {/* Lado Esquerdo: Branding & Mensagem */}
      <section className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>
        
        <Logo iconSize={32} textSize="text-2xl" />

        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            A próxima geração de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Inteligência Solar.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
            Plataforma avançada de diagnóstico termográfico para parques fotovoltaicos com análise automatizada por IA.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-slate-500 text-sm font-semibold tracking-wide uppercase">
          <span>Eficiência</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span>Precisão</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span>Escalabilidade</span>
        </div>
      </section>

      {/* Lado Direito: Formulário de Login */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] md:rounded-l-[40px] shadow-2xl relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <div className="md:hidden flex justify-center mb-12">
            <Logo iconSize={28} textSize="text-xl" className="!text-slate-900" />
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Bem-vindo de volta</h2>
            <p className="text-slate-500 font-medium">Introduza as suas credenciais Solar Vision para aceder ao sistema.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <LoginForm onSubmit={handleLogin} />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Não tem acesso? <a href="#" className="text-amber-600 font-bold hover:text-amber-700 transition-colors">Contacte o suporte</a>
          </p>
        </div>
        
        {/* Footer info limited to login side */}
        <div className="absolute bottom-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Solar Vision © 2026 • Powered by Codenu
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
