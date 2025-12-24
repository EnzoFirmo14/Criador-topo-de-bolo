
import React from 'react';

interface CustomizerProps {
  name: string;
  age: string;
  setName: (v: string) => void;
  setAge: (v: string) => void;
}

const Customizer: React.FC<CustomizerProps> = ({ name, age, setName, setAge }) => {
  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-pink-600 mb-4 flex items-center gap-2">
        <span>🎨</span> 2. Personalizar Arte
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Nome no Topper
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lázaro"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all font-medium text-gray-700"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">👤</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Idade / Número
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex: 37"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all font-medium text-gray-700"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🎈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
