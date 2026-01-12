'use client'

import React from 'react';
import Link from 'next/link';

const StrategyView: React.FC = () => {
  const steps = [
    { title: "Discovery", desc: "Understanding national priorities and legacy bottlenecks." },
    { title: "Architecture", desc: "Zero-trust blueprints and secure data mapping." },
    { title: "Governance", desc: "Policy alignment, GIGW compliance, and security audits." },
    { title: "Scaling", desc: "Deployment from prototype to millions of users." }
  ];

  return (
    <div className="pt-40 bg-white">
      <div className="container mx-auto px-6">
        {/* Navigation Breadcrumb to allow returning to main landing page */}
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

        <div className="max-w-4xl mb-32">
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Strategic Framework</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            The <span className="text-accent italic font-light">Strategic</span> <br />
            Methodology.
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            Transformation is not a product; it is a process. We guide governments through the complexity of modern digital governance.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 mb-40 border border-slate-200 rounded-sm overflow-hidden">
           {[
             { t: "Digital Sovereignty", d: "Ensuring national data stays within national borders through air-gapped ready architecture." },
             { t: "Inclusive Access", d: "Designing for the bottom of the pyramid. Multilingual, accessible, and high-performance on low bandwidth." },
             { t: "Hardened Security", d: "NIC/GIGW compliant systems that withstand state-level cyber threats." },
             { t: "Elastic Scale", d: "Cloud-native infrastructure that grows with your citizen base, effortlessly." }
           ].map((item, i) => (
             <div key={i} className="bg-white p-16 group hover:bg-slate-50 transition-colors">
                <h3 className="text-2xl font-display font-black text-obsidian-900 mb-6 group-hover:text-accent transition-colors">{item.t}</h3>
                <p className="text-slate-500 leading-relaxed font-light">{item.d}</p>
             </div>
           ))}
        </div>

        {/* Implementation Roadmap */}
        <div className="py-24 border-y border-slate-100">
           <h3 className="text-base font-black uppercase tracking-ultra text-accent mb-20 text-center">Implementation Lifecycle</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {steps.map((step, i) => (
                <div key={i} className="text-center relative z-10">
                   <div className="w-16 h-16 bg-accent text-white flex items-center justify-center font-display font-black text-2xl mx-auto mb-8 shadow-lg shadow-accent/20">
                      0{i+1}
                   </div>
                   <h4 className="text-lg font-display font-black text-obsidian-900 mb-4">{step.title}</h4>
                   <p className="text-sm text-slate-500 font-light">{step.desc}</p>
                </div>
              ))}
              <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-accent/10 -z-10"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyView;

