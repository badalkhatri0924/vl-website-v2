'use client'

import React from 'react';
import Link from 'next/link';
import { CountUp } from '@/components/CaseStudies';

const AutomationSolutionView: React.FC = () => {
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
            <span className="text-sm font-black uppercase tracking-ultra">Back to Overview</span>
          </Link>
        </div>

        {/* Editorial Header */}
        <div className="max-w-4xl mb-32">
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Solution Pillar 02</h1>
          <h2 className="text-6xl md:text-9xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
            AI & Process <br />
            <span className="text-accent italic font-light">Automation.</span>
          </h2>
          <p className="text-slate-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl text-balance">
            Streamlining bureaucratic complexity with high-security AI agents and automated workflow orchestrators.
          </p>
        </div>

        {/* Visual Hero */}
        <div className="relative h-[600px] mb-32 overflow-hidden border border-slate-100 group">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000" 
            alt="AI Automation" 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 max-w-2xl">
            <h3 className="text-white text-3xl font-display font-black mb-4">The New Public Efficiency.</h3>
            <p className="text-white/70 text-lg font-light">
              We turn paper-heavy legacy processes into autonomous digital workflows, reducing turnaround times from weeks to seconds.
            </p>
          </div>
        </div>

        {/* Technical Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 mb-40">
          {[
            {
              title: "Efficiency Gain",
              metric: "85%",
              label: "Processing Speedup",
              desc: "Average reduction in administrative latency for document verification and citizen inquiry response."
            },
            {
              title: "AI Liaisons",
              metric: "500k+",
              label: "Concurrent Interactions",
              desc: "Secure AI agents capable of providing multilingual support across regional government portals."
            },
            {
              title: "Cost Reduction",
              metric: "40%",
              label: "Operational Savings",
              desc: "Significant reduction in public sector operational overhead through strategic automation."
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

        {/* Feature Sections */}
        <div className="space-y-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Agentic Systems</h4>
                <h3 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 mb-8 tracking-tighter">Autonomous <br />Public Liaisons.</h3>
                <p className="text-slate-500 text-lg font-light leading-relaxed mb-10">
                  Our custom-trained AI agents serve as the first point of contact for citizens, resolving complex inquiries, guiding through permit applications, and interpreting policy in real-time.
                </p>
                <ul className="space-y-4">
                  {['Multilingual Intent Mapping', 'Policy-Hardened Logic', '24/7 Citizen Support'].map(t => (
                    <li key={t} className="flex items-center space-x-4 text-obsidian-900 font-bold uppercase text-sm tracking-ultra">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-slate-100 p-1">
                 <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" alt="Data visualization" className="w-full shadow-2xl" />
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1 bg-slate-50 p-12 md:p-20 border border-slate-100">
                 <h5 className="text-obsidian-900 font-display font-black text-xl mb-6">Security Compliance Tier</h5>
                 <p className="text-slate-500 text-base font-light leading-relaxed mb-8">
                   Every automation workflow is audited against Zero Trust security principles. We integrate with existing GIGW and NIC frameworks to ensure total administrative safety.
                 </p>
                 <div className="flex gap-4">
                    <span className="px-4 py-2 bg-white border border-slate-200 text-sm font-black uppercase tracking-ultra text-slate-400">SOC2 Type II</span>
                    <span className="px-4 py-2 bg-white border border-slate-200 text-sm font-black uppercase tracking-ultra text-slate-400">GIGW Certified</span>
                 </div>
              </div>
              <div className="order-1 lg:order-2">
                <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Workflow Orchestration</h4>
                <h3 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 mb-8 tracking-tighter">Bridges Over <br />Red Tape.</h3>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  We dismantle administrative silos by connecting disparate government APIs and legacy databases through an intelligent orchestration layer. 
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationSolutionView;

