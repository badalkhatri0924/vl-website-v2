'use client'

import React from 'react';
import Link from 'next/link';
import { TESTIMONIALS, TestimonialCard } from '@/components/Testimonials';

const TestimonialsView: React.FC = () => {
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
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Endorsements</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            Institutional <br />
            <span className="text-accent italic font-light">Validation.</span>
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            A collective perspective from the leaders driving national digital transformation missions across the globe.
          </p>
        </div>

        {/* Full Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Call to Action - Now navigating to PartnershipView */}
        <div className="mt-40 bg-obsidian-900 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 mb-10 md:mb-0">
            <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-4">Strategic Engagement</h4>
            <p className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter max-w-lg">
              Join the cohort of digitized nations.
            </p>
          </div>
          <Link 
            href="/partnership"
            className="relative z-10 px-12 py-6 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group"
          >
            <span>Inquire for Partnership</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TestimonialsView;

