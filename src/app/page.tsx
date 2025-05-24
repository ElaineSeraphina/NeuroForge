
'use client';
import ImageGenerator from '../components/ImageGenerator';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect, useState } from 'react';
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quantumParticles, setQuantumParticles] = useState<Array<{x: number, y: number, size: number, speed: number, color: string}>>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Generate quantum particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 5 + 1,
      color: ['cyan', 'pink', 'purple'][Math.floor(Math.random() * 3)]
    }));
    
    setQuantumParticles(particles);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        {/* Futuristic background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Neural network grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0,_rgba(99,102,241,0)_50%)] animate-pulse-slow"></div>
            <div className="grid grid-cols-24 h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={`col-${i}`} className="border-r border-cyan-500/5"></div>
              ))}
            </div>
            <div className="grid grid-rows-24 w-full h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={`row-${i}`} className="border-b border-cyan-500/5"></div>
              ))}
            </div>
          </div>
          
          {/* Quantum field */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <path 
                  key={`path-${i}`}
                  d={`M${Math.random() * 100},${Math.random() * 100} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 100},${Math.random() * 100}`}
                  stroke={`rgba(${Math.random() * 100 + 155}, ${Math.random() * 100}, ${Math.random() * 255}, 0.1)`}
                  strokeWidth="0.5"
                  fill="none"
                  className="animate-dash"
                  style={{ animationDuration: `${Math.random() * 50 + 20}s` }}
                />
              ))}
            </svg>
          </div>
          
          {/* Quantum particles */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 blur-3xl"
            style={{
              left: `calc(${mousePosition.x}px - 400px)`,
              top: `calc(${mousePosition.y}px - 400px)`,
              transition: 'all 1s cubic-bezier(0.075, 0.82, 0.165, 1)',
              opacity: 0.3
            }}
          ></div>
          
          {/* Quantum particles */}
          {quantumParticles.map((particle, index) => (
            <div 
              key={`quantum-${index}`}
              className={`absolute rounded-full blur-sm animate-float`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 
                                 particle.color === 'pink' ? 'rgba(236, 72, 153, 0.3)' : 
                                 'rgba(168, 85, 247, 0.3)',
                animationDuration: `${particle.speed}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
          
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-70"></div>
          
          {/* Animated glitch lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-cyan-500/20 animate-glitch-horizontal"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-pink-500/20 animate-glitch-horizontal-reverse"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-purple-500/20 animate-glitch-vertical"></div>
          <div className="absolute top-0 left-2/3 w-px h-full bg-cyan-500/20 animate-glitch-vertical-reverse"></div>
          
          {/* Holographic glow effects */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-500 opacity-5 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cyan-500 opacity-5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500 opacity-5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          {/* Digital artifacts */}
          <div className="absolute h-px w-full top-1/3 left-0 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent opacity-30 animate-pulse-slow"></div>
          <div className="absolute h-px w-full top-2/3 left-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Energy flow lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <linearGradient id="energyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
                  <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </linearGradient>
                <linearGradient id="energyGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
                  <stop offset="50%" stopColor="rgba(236, 72, 153, 0.3)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
                </linearGradient>
              </defs>
              <path 
                d="M0,100 Q50,0 100,100" 
                stroke="url(#energyGradient1)" 
                strokeWidth="0.5" 
                fill="none" 
                className="animate-flow-right"
                style={{ animationDuration: '15s' }}
              />
              <path 
                d="M100,0 Q50,100 0,0" 
                stroke="url(#energyGradient2)" 
                strokeWidth="0.5" 
                fill="none" 
                className="animate-flow-left"
                style={{ animationDuration: '15s' }}
              />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 uppercase tracking-wider animate-text-glow">
              NeuroForge AI IMAGE GENERATOR
            </h1>
            
            {/* Holographic elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-70 blur-sm"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent opacity-70 blur-sm"></div>
            
            {/* Dimensional text shadow */}
            <div className="absolute inset-0 text-4xl md:text-5xl font-bold text-center text-cyan-500/10 blur-md animate-pulse-slow" style={{ animationDuration: '5s' }}>
              NeuroForge AI IMAGE GENERATOR
            </div>
            <div className="absolute inset-0 text-4xl md:text-5xl font-bold text-center text-pink-500/10 blur-md animate-pulse-slow" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>
              NeuroForge AI IMAGE GENERATOR
            </div>
            
            {/* Quantum particles around title */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={`title-particle-${i}`} 
                  className="absolute w-1 h-1 rounded-full animate-float"
                  style={{
                    backgroundColor: ['#06b6d4', '#ec4899', '#a855f7'][Math.floor(Math.random() * 3)],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <p className="text-center mb-8 text-gray-400 max-w-2xl mx-auto relative">
            Generate stunning cyberpunk-style images with advanced AI. Enter a detailed prompt to create your vision.
            
            {/* Futuristic decorative elements */}
            <span className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50"></span>
            <span className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 border-t-2 border-r-2 border-pink-500/50"></span>
            
            {/* Scan line effect */}
            <span className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-30" style={{ backgroundSize: '100% 8px', backgroundRepeat: 'repeat', animation: 'scanline 8s linear infinite' }}></span>
          </p>
          
          <ImageGenerator />
        </div>
      </main>
    </ThemeProvider>
  );
}
