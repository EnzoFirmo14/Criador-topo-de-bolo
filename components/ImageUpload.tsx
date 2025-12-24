
import React, { useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        1. Upload da Imagem de Referência
      </label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          selectedImage ? 'border-pink-400 bg-pink-50' : 'border-gray-300 hover:border-pink-300 hover:bg-gray-50'
        }`}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*"
          onChange={handleFileChange} 
        />
        
        {selectedImage ? (
          <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden border border-pink-200">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold bg-pink-600 px-2 py-1 rounded">Trocar Imagem</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-5xl mb-4 block">📸</span>
            <p className="text-gray-600 font-medium">Clique para enviar ou arraste a foto</p>
            <p className="text-gray-400 text-xs mt-1">PNG ou JPG (Até 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
