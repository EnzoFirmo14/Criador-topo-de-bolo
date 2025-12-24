
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-pink-100 py-6 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎂</span>
          <div>
            <h1 className="text-2xl font-bold text-pink-600 tracking-tight">CakeTopper Pro</h1>
            <p className="text-sm text-gray-500">Design de topos de bolo automático</p>
          </div>
        </div>
        <nav className="flex gap-4">
          <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-full text-sm font-medium border border-pink-100">
            ✨ Processamento com IA
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
            🖨️ Pronto para Impressão
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
