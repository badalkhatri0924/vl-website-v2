'use client'

import React from 'react';
import CaseStudies from '@/components/CaseStudies';

const ImpactView: React.FC = () => {
  return (
    <div className="pt-40 bg-white">
      <div className="container mx-auto px-6 mb-20">
        <div className="max-w-4xl">
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">National Impact</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            Governance <br />
            <span className="text-accent italic font-light">at Scale.</span>
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            Success in the public sector is measured in millions of lives changed. These are the benchmarks of our commitment.
          </p>
        </div>
      </div>
      
      {/* CaseStudies component no longer needs setView */}
      <CaseStudies />

      <div className="container mx-auto px-6 py-20 border-t border-slate-100">
         <div className="text-center">
            <h3 className="text-accent text-base font-black uppercase tracking-ultra mb-12">Global Footprint</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
               {[
                 { v: "15M+", l: "Citizens Impacted" },
                //  { v: "24/7", l: "Secure Operations" },
                 { v: "25+", l: "National Agencies" },
                 { v: "100%", l: "Deployment Success" }
               ].map((stat, i) => (
                 <div key={i}>
                    <p className="text-5xl md:text-7xl font-display font-black text-obsidian-900 mb-4">{stat.v}</p>
                    <p className="text-sm font-black uppercase tracking-ultra text-slate-400">{stat.l}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ImpactView;

