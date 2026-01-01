'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EnquiryView: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
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
          <h2 className="text-5xl font-display font-black text-obsidian-900 mb-6 tracking-tighter">Liaison Request Received.</h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed mb-12">
            Thank you. We've received your request and our team will get in touch within 24 hours.
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
    <div className="pt-40 py-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-20">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Left Column: Context & Messaging */}
            <div className="lg:col-span-5">
              <h1 className="text-accent text-sm font-black uppercase tracking-ultra mb-10">Institutional Enquiry</h1>
              <h2 className="text-6xl md:text-7xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
                Initiate your <br />
                <span className="text-accent italic font-light">Mission.</span>
              </h2>
              <p className="text-slate-600 text-xl font-light leading-relaxed mb-16 max-w-md">
                We maintain the highest level of administrative discretion. Please use your institutional email for expedited priority routing.
              </p>

              {/* <div className="space-y-12">
                <div className="p-10 border border-slate-100 bg-white shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-obsidian-900 font-black uppercase text-base tracking-ultra mb-4">Confidentiality Protocol</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    All communications via this portal are protected by government-grade encryption standards and routed through our sovereign data layer.
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-ultra text-slate-300">End-to-End Encrypted Liaison</span>
                </div>
              </div> */}
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-ultra text-accent">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter full name" 
                      className="w-full bg-transparent border-b border-slate-200 py-4 text-obsidian-900 font-display font-medium text-lg focus:border-accent focus:outline-none transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-ultra text-accent">Institutional Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Enter institutional email" 
                      className="w-full bg-transparent border-b border-slate-200 py-4 text-obsidian-900 font-display font-medium text-lg focus:border-accent focus:outline-none transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-ultra text-accent">Organization / Ministry</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter organisation / ministry name" 
                    className="w-full bg-transparent border-b border-slate-200 py-4 text-obsidian-900 font-display font-medium text-lg focus:border-accent focus:outline-none transition-colors placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-ultra text-accent">Project Scope & Scale</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly describe your mission requirements or specific challenges..."
                    className="w-full bg-transparent border-b border-slate-200 py-4 text-obsidian-900 font-display font-medium text-lg focus:border-accent focus:outline-none transition-colors placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>

                <div className="pt-10">
                  <button 
                    disabled={formState === 'submitting'}
                    className="w-full md:w-auto px-16 py-7 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra flex items-center justify-center space-x-6 hover:bg-accent transition-all duration-300 shadow-xl disabled:opacity-50 group"
                  >
                    <span>{formState === 'submitting' ? 'Submitting Request...' : 'Submit Request'}</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

export default EnquiryView;
