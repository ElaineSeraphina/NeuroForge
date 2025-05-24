'use client';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="relative w-24 h-24">
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-pink-500 rounded-full animate-spin"></div>
      
      {/* Middle ring */}
      <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 border-l-cyan-500 rounded-full animate-spin-slow"></div>
      
      {/* Inner ring */}
      <div className="absolute inset-4 border-4 border-transparent border-b-cyan-500 border-r-pink-500 rounded-full animate-spin-reverse"></div>
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>
      
      {/* Glitch effect */}
      <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-pulse opacity-50"></div>
      
      {/* Orbital particles */}
      <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-orbit" style={{ animationDelay: '0s' }}></div>
      <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-orbit" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-orbit" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default LoadingAnimation;
