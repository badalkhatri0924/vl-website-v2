'use client'

import React, { useState } from 'react';
import Link from 'next/link';

const PartnershipView: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  if (formState === 'success') {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center bg-white px-6">
        <div className="max-w-2xl text-center">
          <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-5xl font-display font-black text-obsidian-900 mb-6 tracking-tighter">Strategic Intent Logged.</h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed mb-12">
            Your partnership proposal has been prioritized for our executive review board. A senior director will reach out to discuss collaborative synergies within 48 hours.
          </p>
          <Link 
            href="/"
            className="inline-block px-10 py-5 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm"
          >
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-40 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-20">
            <Link 
              href="/"
              className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-black uppercase tracking-ultra">Exit Partnership Portal</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Context Sidebar */}
            <div className="lg:col-span-5">
              <h1 className="text-accent text-sm font-black uppercase tracking-ultra mb-10">Strategic Alliances</h1>
              <h2 className="text-6xl md:text-7xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
                Co-Authoring <br />
                <span className="text-accent italic font-light">The Future.</span>
              </h2>
              <p className="text-slate-600 text-xl font-light leading-relaxed mb-16">
                We collaborate with technology leaders, international NGOs, and regional governments to deliver impact that outpaces standard institutional speed.
              </p>

              <div className="space-y-8">
                 {[
                   { t: "Technology Integration", d: "Merging your IP with our sovereign digital backbone." },
                   { t: "Regional Representation", d: "Localizing our platforms for new national markets." },
                   { t: "Strategic Investment", d: "Exploring capital and mission-aligned growth synergies." }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start space-x-5">
                      <div className="w-1.5 h-1.5 bg-accent mt-1.5"></div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-ultra text-obsidian-900 mb-1">{item.t}</h4>
                        <p className="text-slate-400 text-sm font-light">{item.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-7 bg-slate-50/50 p-10 md:p-20 border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-ultra text-accent">Contact Authority</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Name and Title" 
                    className="w-full bg-white border border-slate-200 px-6 py-5 text-obsidian-900 font-display font-medium focus:border-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-ultra text-accent">Corporate Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Institutional or Corp" 
                      className="w-full bg-white border border-slate-200 px-6 py-5 text-obsidian-900 font-display font-medium focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-ultra text-accent">Organization</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Entity Name" 
                      className="w-full bg-white border border-slate-200 px-6 py-5 text-obsidian-900 font-display font-medium focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-ultra text-accent">Partnership Track</label>
                  <select className="w-full bg-white border border-slate-200 px-6 py-5 text-obsidian-900 font-display font-medium focus:border-accent focus:outline-none transition-colors appearance-none cursor-pointer">
                    <option>Strategic Technology Partnership</option>
                    <option>Channel & Regional Distribution</option>
                    <option>Governmental Liaison Office</option>
                    <option>Infrastructure & Cloud Alliance</option>
                    <option>R&D Collaborative Project</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-ultra text-accent">Memorandum of Intent</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide a high-level summary of the proposed synergy..."
                    className="w-full bg-white border border-slate-200 px-6 py-5 text-obsidian-900 font-display font-medium focus:border-accent focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                {/* The Signature Teal Button from User Image */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full h-20 bg-accent hover:bg-obsidian-900 transition-all duration-500 shadow-xl flex items-center justify-center space-x-8 group disabled:opacity-50"
                  >
                    <span className="text-white text-base font-black uppercase tracking-[0.4em] translate-x-4">
                      {formState === 'submitting' ? 'Transmitting...' : 'Inquire for Partnership'}
                    </span>
                    <svg className="w-6 h-6 text-white group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipView;

