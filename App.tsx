
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import Customizer from './components/Customizer';
import { processTopperImage } from './services/geminiService';
import { ProcessingState } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [name, setName] = useState('Lázaro');
  const [age, setAge] = useState('37');
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    status: '',
    progress: 0
  });

  /**
   * Helper function to convert the model's output into a TRUE transparent PNG
   * by stripping the background pixels.
   */
  const ensureTrueTransparency = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(base64);
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample top-left pixel to identify potential background color
        const r_bg = data[0], g_bg = data[1], b_bg = data[2];
        
        // Threshold for removing background (handle slight compression artifacts)
        const threshold = 30; 
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          
          // Calculate distance to background color (sampled or pure white)
          const diffBg = Math.abs(r - r_bg) + Math.abs(g - g_bg) + Math.abs(b - b_bg);
          const diffWhite = Math.abs(r - 255) + Math.abs(g - 255) + Math.abs(b - 255);
          
          if (diffBg < threshold || diffWhite < threshold) {
            data[i + 3] = 0; // Set Alpha to 0
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = base64;
    });
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setProcessing({ 
      isProcessing: true, 
      status: 'Detectando e isolando elementos...', 
      progress: 20 
    });
    
    try {
      // Step 1: AI Generation
      setProcessing(p => ({ ...p, status: 'Gerando novo layout de folha A4...', progress: 40 }));
      const aiResult = await processTopperImage(originalImage, name, age);
      
      // Step 2: Real Alpha Transparency Removal
      setProcessing(p => ({ ...p, status: 'Removendo fundo e gerando Canal Alpha Real...', progress: 80 }));
      const transparentResult = await ensureTrueTransparency(aiResult);
      
      setProcessedImage(transparentResult);
      setProcessing({ isProcessing: false, status: 'Concluído com transparência real!', progress: 100 });
    } catch (error) {
      console.error(error);
      alert('Erro no processamento. Tente uma imagem mais clara.');
      setProcessing({ isProcessing: false, status: '', progress: 0 });
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `topo-de-bolo-${name || 'personalizado'}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-pink-50/30 pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-2 rounded-3xl shadow-lg shadow-pink-100/50 border border-pink-50">
            <div className="p-4 space-y-6">
              <ImageUpload 
                onImageSelect={setOriginalImage} 
                selectedImage={originalImage} 
              />
              
              <Customizer 
                name={name} 
                age={age} 
                setName={setName} 
                setAge={setAge} 
              />

              <button
                disabled={!originalImage || processing.isProcessing}
                onClick={handleProcess}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex flex-col items-center justify-center ${
                  !originalImage || processing.isProcessing
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105'
                }`}
              >
                {processing.isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-1" />
                    <span className="text-sm">Processando Elementos...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🪄 Gerar Folha Organizada</span>
                    <span className="text-[10px] uppercase opacity-70 tracking-widest font-normal">PNG Transparente Real (Alpha)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-900 text-sm shadow-sm">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <span>💎</span> Qualidade Premium
            </h4>
            <ul className="space-y-2 opacity-80">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Layout A4 com itens separados
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Canal Alpha Real (RGBA)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Cores vibrantes e contornos para corte
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Preview / Result */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden min-h-[600px] flex-1 flex flex-col border border-pink-50">
            <div className="bg-gray-50/50 border-b border-gray-100 p-5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                🎨 Preview da Arte (Fundo Transparente Real)
              </span>
              {processedImage && (
                <button 
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-100 transition-all"
                >
                  📥 Baixar PNG Transparente
                </button>
              )}
            </div>

            <div className="flex-1 p-6 flex items-center justify-center relative bg-slate-100 overflow-hidden">
              {/* Checkerboard Pattern for Transparency Verification */}
              <div 
                className="absolute inset-0 opacity-10" 
                style={{ 
                  backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }} 
              />

              {!processedImage && !processing.isProcessing && (
                <div className="text-center max-w-sm z-10">
                  <div className="w-24 h-24 bg-white/50 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm">
                    ✨
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">Aguardando Criação</h3>
                  <p className="text-gray-500 mt-2 text-sm">O sistema irá organizar todos os itens separados em uma nova folha com fundo transparente real.</p>
                </div>
              )}

              {processing.isProcessing && (
                <div className="text-center z-10">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-pink-100/50 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center text-5xl">
                      ✂️
                    </div>
                    <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-pink-600 font-bold text-lg">{processing.status}</p>
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
                    <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${processing.progress}%` }} />
                  </div>
                </div>
              )}

              {processedImage && !processing.isProcessing && (
                <div className="relative group w-full h-full flex items-center justify-center p-4 z-10">
                  <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/20 shadow-2xl max-h-full">
                     <img 
                      src={processedImage} 
                      alt="Topo de Bolo Final" 
                      className="max-w-full max-h-[70vh] object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50/50 border-t border-gray-100 p-4 text-center">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                ✓ Elementos Separados • ✓ Alpha RGBA • ✓ Pronto para Corte
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm py-8 border-t border-pink-100">
        <p>© 2024 CakeTopper Pro Creator • Qualidade Profissional para Impressão.</p>
      </footer>
    </div>
  );
};

export default App;
