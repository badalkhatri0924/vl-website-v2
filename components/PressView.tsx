'use client'

import React from 'react';
import Link from 'next/link';
import { PRESS_ITEMS } from '@/components/PressSection';

const PressView: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-[#F8FAFB]">
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

        {/* Massive Editorial Header as per mockup */}
        <div className="mb-24 pt-10">
          <h1 className="text-[10vw] font-display font-extralight text-accent italic leading-none tracking-tighter mb-10">
            Presence.
          </h1>
          <div className="max-w-md">
            <p className="text-slate-500 text-xl font-light leading-relaxed">
              Institutional coverage of our mission to digitize nations and upskill populations at scale.
            </p>
          </div>
        </div>

        {/* Updated Press Grid with Fixed Images and Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
          {PRESS_ITEMS.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`}
              className="bg-white rounded-none overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col group border border-slate-100"
            >
              {/* Card Image Area with Region Badge */}
              <div className="h-64 relative overflow-hidden bg-slate-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.publisher} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-white/95 backdrop-blur text-sm font-black uppercase tracking-ultra text-obsidian-900 border border-slate-100 shadow-sm">
                    {item.region}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-accent text-sm font-black uppercase tracking-ultra">
                    {item.date}
                  </span>
                  {/* <a href={item.link} className="text-accent hover:text-obsidian-900 transition-colors opacity-60 hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a> */}
                </div>

                <h3 className="text-2xl font-bold text-obsidian-900 leading-[1.3] mb-6 flex-grow">
                  "{item.headline}"
                </h3>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-wider text-obsidian-950">
                    {item.publisher}
                  </span>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black uppercase tracking-widest text-accent hover:text-obsidian-900 transition-colors"
                  >
                    READ FULL ARTICLE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Contact Strip with Standardized Button and Arrow */}
        <div className="mt-40 bg-obsidian-900 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 mb-10 md:mb-0">
              <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-4">Media Relations</h4>
            <p className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter max-w-lg">
              Inquire for official statements and kits.
            </p>
          </div>
          <Link href="/enquiry" className="relative z-10 px-12 py-6 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group">
            <span>Contact Media Office</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PressView;

