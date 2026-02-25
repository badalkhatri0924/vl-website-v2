'use client'

import React from 'react';
import Link from 'next/link';
import { PROJECTS, CountUp } from '@/components/CaseStudies';

const ProjectGridCard: React.FC<{ project: any }> = ({ project }) => {
  const cardContent = (
    <div 
      className={`bg-white border border-slate-100 flex flex-col h-full group transition-colors duration-500 overflow-hidden ${project.projectLink ? 'hover:border-accent/40 hover:shadow-lg' : 'hover:border-accent/40'}`}
    >
      {/* Visual Header */}
      <div className="h-64 relative overflow-hidden bg-slate-100">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <div className="bg-white px-3 py-1 flex items-center space-x-2 text-sm font-black uppercase tracking-ultra text-obsidian-900 border border-slate-100 shadow-sm">
            <span className="text-base">{project.flag}</span>
            <span>{project.region}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="mb-6">
          <span className="text-sm font-black uppercase tracking-ultra text-accent mb-2 block">
            {project.type}
          </span>
          <h3 className="text-2xl font-display font-black text-obsidian-900 leading-tight mb-6 line-clamp-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Inaugurated By Badge */}
        <div className="mb-8 flex items-center space-x-3 bg-slate-50 p-4 border-l-2 border-accent/20">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Inaugurated By</span>
            <span className="text-sm font-black uppercase tracking-ultra text-obsidian-900">
              {project.subtitle}
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light line-clamp-4">
          {project.desc}
        </p>

        {/* Metrics Footer */}
        <div className="mt-auto pt-8 border-t border-slate-100 grid grid-cols-2 gap-6">
          {project.metrics.map((m: any, i: number) => (
            <div key={i}>
              <div className="text-xl font-display font-black text-obsidian-900">
                <CountUp value={m.value} />
              </div>
              <div className="text-xs font-black uppercase tracking-ultra text-slate-400">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (project.projectLink) {
    return (
      <a
        href={project.projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

const PortfolioView: React.FC = () => {
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
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Full Project Catalog</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            Mission-Scale <br />
            <span className="text-accent italic font-light">Implementations.</span>
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            A comprehensive look at our global footprint in digital governance, nation-wide learning, and sovereign AI deployment.
          </p>
        </div>

        {/* Responsive Grid Layout (3-Column Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PROJECTS.map((project) => (
            <ProjectGridCard key={project.id} project={project} />
          ))}
        </div>

        {/* Institutional Contact Strip - Link to PartnershipView */}
        <div className="mt-20 border-t border-slate-100 pt-24 text-center">
           <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8">Strategic Partnerships</h4>
           <p className="text-3xl font-display font-black text-obsidian-900 tracking-tight mb-12">
             Ready to deploy your next national infrastructure mission?
           </p>
           <div className="flex justify-center">
             <Link 
              href="/enquiry"
              className="px-6 py-3 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group"
             >
                <span>Request Discovery Session</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PortfolioView;

