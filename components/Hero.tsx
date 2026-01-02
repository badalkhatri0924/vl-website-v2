'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ top: string; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate random positions only on client side to avoid hydration mismatch
    setParticles(
      Array.from({ length: 15 }, () => ({
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 7}s`,
        duration: `${3 + Math.random() * 4}s`
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden bg-obsidian-950">
      {/* --- PREMIUM TECH BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Black/Gray Base */}
        <div className="absolute inset-0 bg-[#030712]"></div>
        
        {/* Subtle Horizon Curved Light Surface */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,180,0,0.12),rgba(255,150,0,0.05)_40%,transparent_70%)] rounded-[100%] blur-[80px]"></div>
        
        {/* Sharp Golden Horizon Line */}
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-[1px]"></div>
        
        {/* Soft Warm Glow from Top */}
        <div className="absolute top-0 left-1/4 w-[50%] h-[40%] bg-gradient-to-b from-amber-500/5 to-transparent blur-[120px]"></div>

        {/* Structural Grid Overlay with Perspective */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`, 
            backgroundSize: '5rem 5rem',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)'
          }}
        ></div>

        {/* Floating Particles for Depth - Only render on client */}
        {particles.length > 0 && (
          <div className="absolute inset-0">
            {particles.map((particle, i) => (
              <div 
                key={i}
                className="absolute w-[1px] h-[1px] bg-amber-200/40 rounded-full animate-pulse"
                style={{
                  top: particle.top,
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-[7rem] xl:text-[7rem] lg:text-[7rem] font-display font-black text-white mb-10 leading-[0.9] tracking-tighter">
              Suite of Modern Digital Nations, <br />
              <span className="text-white/30 italic font-extralight">Expertly Engineered.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:pt-32">
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light mb-12 text-balance max-w-sm">
              Powering Government & Education with <span className="text-white font-black">Versionlabs.</span> No legacy bloat. No compromise. Just results.
            </p>
            
            {/* Signature Interactive Button */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/enquiry"
                className="group relative flex items-center space-x-4 bg-amber-500 hover:bg-white transition-all duration-500 p-1 shadow-[0_10px_40px_rgba(245,158,11,0.2)]"
              >
                <div className="bg-amber-400 p-4 text-obsidian-900 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <span className="pr-8 text-obsidian-950 font-black uppercase tracking-widest text-sm">Consult with Architect</span>
              </Link>

              <Link 
                href="/portfolio"
                className="text-white/40 hover:text-white text-sm font-black uppercase tracking-widest transition-colors border-b border-white/10 pb-2 hover:border-amber-400"
              >
                Explore Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Big Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02]">
        <h2 className="text-[25vw] font-display font-black text-white leading-none -mb-[5vw] whitespace-nowrap tracking-tighter uppercase">
          VERSIONLABS
        </h2>
      </div>
    </section>
  );
};

export default Hero;
