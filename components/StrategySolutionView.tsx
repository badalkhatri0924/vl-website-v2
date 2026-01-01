'use client'

import React from 'react';
import Link from 'next/link';

const StrategySolutionView: React.FC = () => {
  return (
    <div className="pt-40  bg-[#FDFDFD]">
      <div className="container mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-16">
          <Link 
            href="/"
            className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-black uppercase tracking-ultra">Back to Home</span>
          </Link>
        </div>

        {/* Editorial Header */}
        <div className="max-w-4xl mb-32">
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Solution Pillar 03</h1>
          <h2 className="text-6xl md:text-9xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
            AI Strategy <br />
            <span className="text-accent italic font-light">& Build.</span>
          </h2>
          <p className="text-slate-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl text-balance">
            Strategic roadmapping and custom-built digital assets for high-stakes governmental and educational missions.
          </p>
        </div>

        {/* Visual Hero */}
        <div className="relative h-[600px] mb-32 overflow-hidden border border-slate-100 group">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="AI Strategy" 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 max-w-2xl">
            <h3 className="text-white text-3xl font-display font-black mb-4">Precision Roadmapping.</h3>
            <p className="text-white/70 text-lg font-light">
              We translate abstract national priorities into concrete technical requirements, ensuring every line of code serves a sovereign objective.
            </p>
          </div>
        </div>

        {/* Strategy Methodology Sections */}
        <div className="space-y-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="bg-obsidian-900 p-12 md:p-20 text-white">
                 <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-10">Phase 01: Auditing</h4>
                 <h3 className="text-3xl md:text-4xl font-display font-black mb-8">Digital Readiness <br />& Asset Mapping.</h3>
                 <p className="text-white/60 font-light text-lg mb-12">
                   We begin by analyzing the current state of infrastructure, data availability, and compliance gaps to identify the highest-impact automation opportunities.
                 </p>
                 <ul className="space-y-6">
                    {['Gap Analysis & Security Audit', 'Legacy Infrastructure Evaluation', 'Sovereignty Data Mapping'].map(i => (
                      <li key={i} className="flex items-center space-x-4 border-b border-white/10 pb-4">
                         <span className="text-accent font-black tracking-ultra uppercase text-sm">{i}</span>
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-slate-50 p-12 md:p-20 border border-slate-100">
                 <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-10">Phase 02: Building</h4>
                 <h3 className="text-3xl md:text-4xl font-display font-black text-obsidian-900 mb-8">Custom Copilots <br />& Secure LLMs.</h3>
                 <p className="text-slate-500 font-light text-lg mb-12">
                   Once the roadmap is defined, our engineering core develops custom-built digital assets—ranging from specialized LLMs to national-scale portals.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-obsidian-900 font-black uppercase text-base tracking-ultra mb-2">Build Tier</p>
                       <p className="text-slate-400 text-base font-light">Enterprise-Grade</p>
                    </div>
                    <div>
                       <p className="text-obsidian-900 font-black uppercase text-base tracking-ultra mb-2">Output</p>
                       <p className="text-slate-400 text-base font-light">Production-Ready</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Final CTA Strip */}
           <div className="text-center py-20 border-y border-slate-100">
              <h2 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Executive Engagement</h2>
              <p className="text-4xl md:text-6xl font-display font-black text-obsidian-900 tracking-tighter mb-12">
                Move from <span className="text-accent italic">Theory</span> to <span className="text-accent italic">National Impact.</span>
              </p>
              <Link href="/enquiry" className="inline-flex items-center space-x-4 px-14 py-7 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-xl mx-auto group">
                <span>Inquire for Government Strategy</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StrategySolutionView;

