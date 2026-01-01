'use client'

import React from 'react';
import Link from 'next/link';

const Features: React.FC = () => {
  const pillars: {
    title: string;
    subtitle: string;
    desc: string;
    items: string[];
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      title: "Intelligent Learning",
      subtitle: "UPSKILL WORKFORCES & CITIZENS",
      href: '/solution-learning',
      desc: "AI-powered learning platforms that scale to millions with personalized pathways.",
      items: [
        "National-scale LMS architecture",
        "Adaptive micro-learning paths",
        "Blockchain credential engines"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "AI & Process Automation",
      subtitle: "AUTOMATE ENTERPRISE OPERATIONS",
      href: '/solution-automation',
      desc: "Comprehensive AI solutions that streamline complex processes at enterprise scale.",
      items: [
        "Workflow automation systems",
        "Document processing & analysis",
        "Multi-department integration"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "AI Strategy & Build",
      subtitle: "DRIVE GROWTH WITH STRATEGIC AI",
      href: '/solution-strategy',
      desc: "End-to-end transformation services turning vision into resilient digital architecture.",
      items: [
        "AI readiness & opportunity audits",
        "Data pipeline modernization",
        "Custom LLM & copilot development"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="mb-6 inline-flex items-center space-x-4 text-accent text-base font-black uppercase tracking-[0.3em]">
            <div className="w-10 h-[2px] bg-accent"></div>
            <span>Deep Capabilities</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-black text-obsidian-900 mb-8 tracking-tighter leading-none">
            What We Do
          </h2>
          <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Three pillars of excellence that power nation-scale transformation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 p-12 flex flex-col hover:border-accent hover:shadow-[0_20px_60px_rgba(0,100,224,0.06)] transition-all duration-700 group relative"
            >
              {/* Pillar Icon Box - top-left */}
              <div className="w-12 h-12 bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-10 transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
                {pillar.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl md:text-3xl font-display font-black text-obsidian-900 mb-4 tracking-tight group-hover:text-accent transition-colors whitespace-nowrap">
                {pillar.title}
              </h3>
              <p className="text-accent text-[11px] font-black uppercase tracking-[0.2em] mb-10">
                {pillar.subtitle}
              </p>

              {/* Description */}
              <p className="text-slate-500 text-base font-light leading-relaxed mb-12 flex-grow">
                {pillar.desc}
              </p>

              {/* List items with the blue lightning style icons */}
              <ul className="space-y-6 mb-14">
                {pillar.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-4 text-slate-700 text-base font-semibold">
                    <span className="text-accent flex-shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span className="tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button - refined light gray style */}
              <Link 
                href={pillar.href}
                className="w-full py-5 bg-slate-50 text-obsidian-900 text-sm font-black uppercase tracking-ultra flex items-center justify-center space-x-3 hover:bg-accent hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-accent"
              >
                <span>Explore Solutions</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background visual refinement lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
    </section>
  );
};

export default Features;
