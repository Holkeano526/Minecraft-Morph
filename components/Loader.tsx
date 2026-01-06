
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-white/20 rounded-lg animate-pulse"></div>
        <img 
          src="https://picsum.photos/id/1012/200/200" 
          className="w-full h-full object-cover rounded-lg pixelated" 
          style={{ imageRendering: 'pixelated' }}
          alt="Loading..."
        />
      </div>
      <p className="font-minecraft text-white text-center text-sm md:text-base mb-6 animate-bounce">
        {message}
      </p>
      <div className="loader-dots relative inline-block w-20 h-4">
        <div className="absolute top-0 w-3 h-3 rounded-full bg-green-500"></div>
        <div className="absolute top-0 w-3 h-3 rounded-full bg-green-500"></div>
        <div className="absolute top-0 w-3 h-3 rounded-full bg-green-500"></div>
        <div className="absolute top-0 w-3 h-3 rounded-full bg-green-500"></div>
      </div>
    </div>
  );
};

export default Loader;
