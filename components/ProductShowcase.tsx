'use client'

import React from 'react';

const ProductShowcase: React.FC = () => {
  const features = [
    {
      title: "Handwritten Text Recognition",
      desc: "Accurately identifies handwritten text, converting paper documents into editable formats with precision.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      title: "Language Translation",
      desc: "Supports over 50 languages, ensuring precise translations while preserving original formatting.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      title: "Document Structure Formatting",
      desc: "Maintains tables, bullet points, and professional layouts during processing.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "PDF OCR",
      desc: "Transforms PDFs for easy editing, searching, and copying with high accuracy.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section with Hero Image - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Left Side - Text Content */}
          <div className="flex flex-col">
            <div className="mb-6 inline-flex items-center space-x-4 text-accent text-base font-display font-black uppercase tracking-[0.3em]">
              <div className="w-10 h-[2px] bg-accent"></div>
              <span>Our Product</span>
            </div>
            <h2 className="text-5xl font-display font-black text-obsidian-900 mb-8">
              The Docxpert<br/>
              <span className="text-4xl text-accent italic">Document Processing Platform.</span>
            </h2>
            {/* Testimonial moved below title */}
            <div className="bg-slate-50 p-6 border-l-2 border-accent max-w-md shadow-sm">
              <p className="text-slate-600 text-base italic font-light leading-relaxed">
                "This platform offers exceptional value with competitive pricing, accurate OCR, and multilingual translation features."
              </p>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(0,100,224,0.08)] border border-slate-100 group">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/docxpert-homepage.webp?alt=media"
                alt="Docxpert Document Processing Platform"
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 p-8 flex flex-col hover:border-accent hover:shadow-[0_20px_60px_rgba(0,100,224,0.06)] transition-all duration-700 group"
            >
              <div className="w-12 h-12 bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-6 transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-black text-obsidian-900 mb-4 tracking-tight group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <a 
            href="https://docxpert.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-4 bg-accent hover:bg-accent-600 transition-all duration-500 p-1 shadow-[0_10px_40px_rgba(0,100,224,0.2)] group"
          >
            <div className="bg-accent-400 p-4 text-white group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="pr-8 text-white font-black uppercase tracking-widest text-sm">Try DocXpert</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

