'use client'

import React from 'react';
import Link from 'next/link';
import { CountUp } from '@/components/CaseStudies';

const LearningSolutionView: React.FC = () => {
  return (
    <div className="pt-40 py-20 bg-[#FDFDFD]">
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
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Solution Pillar 01</h1>
          <h2 className="text-6xl md:text-9xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
            Intelligent <br />
            <span className="text-accent italic font-light">Learning.</span>
          </h2>
          <p className="text-slate-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl text-balance">
            Deploying national-scale LMS architecture that transforms citizen skilling missions into high-impact digital experiences.
          </p>
        </div>

        {/* Hero Visual Section */}
        <div className="relative h-[600px] mb-32 overflow-hidden border border-slate-100 group">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" 
            alt="Intelligent Learning" 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 max-w-2xl">
            <h3 className="text-white text-3xl font-display font-black mb-4">Engineered for Millions.</h3>
            <p className="text-white/70 text-lg font-light">
              Our infrastructure is audited to handle concurrent loads that dwarf standard commercial platforms. 
              Sovereignty and security are built into the source code.
            </p>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 mb-40">
          {[
            {
              title: "National Scale",
              metric: "10M+",
              label: "Daily Active Users Capable",
              desc: "Microservices architecture designed for national skilling initiatives with zero-downtime requirements."
            },
            {
              title: "Adaptive AI",
              metric: "11+",
              label: "Indian Languages Integrated",
              desc: "Localized AI pathways that guide learners based on their unique pace and regional linguistic preferences."
            },
            {
              title: "Secure Verification",
              metric: "100%",
              label: "Blockchain Immutable",
              desc: "Anti-tamper credentialing that ensures national certifications are globally verifiable and secure."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-16 hover:bg-slate-50 transition-colors">
              <span className="block text-accent text-base font-black uppercase tracking-ultra mb-10">{item.title}</span>
              <div className="text-5xl font-display font-black text-obsidian-900 mb-2">
                <CountUp value={item.metric} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{item.label}</p>
              <p className="text-slate-500 leading-relaxed font-light text-base">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
             <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Technical Superiority</h4>
             <h3 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 mb-8 tracking-tighter leading-tight">
               Inclusive by Design. <br />Multilingual by Default.
             </h3>
             <div className="space-y-10">
                {[
                  { t: "Multi-tenant Agency Support", d: "Enable multiple government departments to operate independent portals on a single core engine." },
                  { t: "Sovereign Data Storage", d: "Air-gapped ready architecture that keeps all citizen data within national geographic boundaries." },
                  { t: "GIGW & WCAG Compliance", d: "Accessible to the differently-abled and fully compliant with government web standards." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/5 border border-accent/20 flex items-center justify-center text-accent font-black">
                      0{idx + 1}
                    </div>
                    <div>
                      <h5 className="text-lg font-display font-bold text-obsidian-900 mb-2">{feature.t}</h5>
                      <p className="text-slate-500 font-light text-base leading-relaxed">{feature.d}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-slate-50 p-12 md:p-20 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
               </svg>
             </div>
             <p className="text-obsidian-900 font-display text-2xl leading-relaxed italic font-light mb-12">
               "VersionLabs' LMS wasn't just a software deployment; it was the infrastructure that allowed us to reach rural populations we thought were inaccessible."
             </p>
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                   </svg>
                </div>
                <div>
                  <p className="text-obsidian-900 font-black text-sm uppercase tracking-ultra">Mission Director</p>
                  <p className="text-accent text-sm font-black uppercase tracking-widest">Digital Skilling Mission</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSolutionView;

