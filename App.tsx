
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, RefreshCcw, Download, X, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { minecraftifyImage } from './services/geminiService';
import MinecraftButton from './components/MinecraftButton';
import Loader from './components/Loader';
import { MinecraftGenerationState } from './types';

const LOADING_MESSAGES = [
  "Mining diamonds...",
  "Pixelating your features...",
  "Generating voxel mesh...",
  "Applying blocky textures...",
  "Crafting your character...",
  "Dodging creepers...",
  "Loading terrain...",
  "Placing blocks...",
];

const App: React.FC = () => {
  const [state, setState] = useState<MinecraftGenerationState>({
    originalImage: null,
    resultImage: null,
    status: 'idle',
    error: null,
    progressMessage: 'Starting generation...',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setState(prev => ({
          ...prev,
          originalImage: e.target?.result as string,
          status: 'idle',
          error: null,
          resultImage: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, status: 'loading', error: null }));

    // Cycle through loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setState(prev => ({ ...prev, progressMessage: LOADING_MESSAGES[msgIndex] }));
    }, 2000);

    try {
      const mimeType = state.originalImage.match(/data:(.*?);/)?.[1] || 'image/png';
      const result = await minecraftifyImage(state.originalImage, mimeType);
      
      setState(prev => ({
        ...prev,
        resultImage: result,
        status: 'success',
        progressMessage: 'Crafted!'
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || "Something went wrong while crafting your character."
      }));
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setState({
      originalImage: null,
      resultImage: null,
      status: 'idle',
      error: null,
      progressMessage: 'Starting generation...',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadResult = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = 'minecraft-avatar.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      {/* Header */}
      <header className="p-6 bg-gray-900 border-b-4 border-gray-800 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 pixel-border flex items-center justify-center">
            <RefreshCcw className="text-white w-6 h-6" />
          </div>
          <h1 className="font-minecraft text-xs md:text-sm tracking-tighter text-green-500">
            Minecraft-ify Me
          </h1>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Info className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 max-w-6xl mx-auto w-full">
        {showInfo && (
          <div className="mb-8 p-6 bg-blue-900/30 border-2 border-blue-500 rounded-lg text-blue-100 relative w-full">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-blue-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-minecraft text-[10px] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> How it works
            </h3>
            <p className="text-sm leading-relaxed">
              Upload a photo of yourself and our AI will translate your appearance into a standard Minecraft voxel character model. It preserves your clothing patterns, hairstyle, and pose in a blocky 3D aesthetic.
            </p>
          </div>
        )}

        {state.error && (
          <div className="mb-8 p-6 bg-red-900/30 border-2 border-red-500 rounded-lg text-red-100 flex items-start gap-4 w-full">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="font-minecraft text-[10px] mb-2">Crafting Error</h3>
              <p className="text-sm">{state.error}</p>
            </div>
          </div>
        )}

        {state.status === 'idle' && !state.originalImage && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-2xl aspect-square md:aspect-video border-4 border-dashed border-gray-700 hover:border-green-600 hover:bg-green-600/5 transition-all flex flex-col items-center justify-center cursor-pointer group rounded-xl p-8"
          >
            <div className="p-6 bg-gray-800 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-12 h-12 text-gray-500 group-hover:text-green-500" />
            </div>
            <p className="font-minecraft text-[10px] md:text-xs text-gray-500 group-hover:text-white mb-2">
              SELECT A PHOTO
            </p>
            <p className="text-gray-600 text-sm text-center">
              PNG or JPEG (Portrait recommended)
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        )}

        {(state.originalImage || state.resultImage) && (
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center justify-center">
            {/* Original Preview (LEFT) */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h3 className="font-minecraft text-[10px] text-gray-400 uppercase tracking-widest">Input Image</h3>
              <div className="relative w-full aspect-square bg-gray-900 border-4 border-gray-800 rounded-lg overflow-hidden group">
                <img 
                  src={state.originalImage || ''} 
                  className="w-full h-full object-contain" 
                  alt="Original" 
                />
                {state.status === 'idle' && (
                  <button 
                    onClick={() => setState(prev => ({ ...prev, originalImage: null }))}
                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Separator / Status (MIDDLE) */}
            <div className="flex flex-col items-center justify-center py-4 md:py-0">
              {state.status === 'loading' ? (
                <div className="p-3 bg-green-600/20 rounded-full">
                  <RefreshCcw className="w-8 h-8 md:w-10 md:h-10 text-green-500 animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="hidden md:block w-1 h-20 bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
                  <ChevronRight className="w-8 h-8 text-gray-700 rotate-90 md:rotate-0" />
                  <div className="hidden md:block w-1 h-20 bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
                </div>
              )}
            </div>

            {/* Result Preview (RIGHT) */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h3 className={`font-minecraft text-[10px] uppercase tracking-widest ${state.status === 'success' ? 'text-green-500' : 'text-gray-400'}`}>
                Minecraft Result
              </h3>
              <div className="w-full aspect-square bg-gray-900 border-4 border-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                {state.resultImage ? (
                  <img 
                    src={state.resultImage} 
                    className="w-full h-full object-contain pixelated" 
                    style={{ imageRendering: 'pixelated' }}
                    alt="Minecraft Result" 
                  />
                ) : (
                  <div className="text-gray-700 flex flex-col items-center gap-4 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-800 animate-pulse rounded-lg border-2 border-gray-700"></div>
                    <p className="font-minecraft text-[8px] leading-relaxed">
                      {state.status === 'loading' ? 'Crafting in progress...' : 'Ready to craft'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-12 w-full max-w-md flex flex-col gap-4">
          {state.status === 'idle' && state.originalImage && (
            <MinecraftButton 
              variant="success" 
              onClick={processImage}
              className="w-full py-5"
            >
              Start Crafting
            </MinecraftButton>
          )}

          {state.status === 'success' && (
            <div className="flex flex-col gap-4 w-full">
              <MinecraftButton 
                variant="success" 
                onClick={downloadResult}
                className="w-full"
              >
                <Download className="w-4 h-4" /> Download Result
              </MinecraftButton>
              <MinecraftButton 
                variant="primary" 
                onClick={reset}
                className="w-full"
              >
                <RefreshCcw className="w-4 h-4" /> Upload New Photo
              </MinecraftButton>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 text-[10px] font-minecraft uppercase tracking-widest bg-black/20">
        Not an official Minecraft product. AI-Powered Generation.
      </footer>

      {state.status === 'loading' && (
        <Loader message={state.progressMessage} />
      )}
    </div>
  );
};

export default App;
