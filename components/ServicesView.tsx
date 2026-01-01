'use client'

import React from 'react';
import Link from 'next/link';

const ServicesView: React.FC = () => {
  const deepServices = [
    {
      id: "lms",
      title: "National LMS Architecture",
      subtitle: "NATION-WIDE UPSKILLING",
      desc: "Architected for the highest concurrent loads in the public sector. Our Learning Management Systems aren't just software; they are national educational pipelines.",
      specs: [
        { label: "Concurrency", value: "100k+ RPS" },
        { label: "Availability", value: "99.99% Tier-4" },
        { label: "Compliance", value: "WCAG 2.1 / GIGW" }
      ],
      features: ["Multi-tenant Agency Support", "Regional Language AI", "Versionlabs Data Storage", "Cert-In Audited Portals"]
    },
    {
      id: "ai",
      title: "Versionlabs AI Integration",
      subtitle: "CITIZEN SERVICE AUTOMATION",
      desc: "Deploying secure, localized LLMs that assist citizens in their native languages while keeping data within national boundaries.",
      specs: [
        { label: "Models", value: "Llama-3 / Custom" },
        { label: "Privacy", value: "Air-gapped Ready" },
        { label: "Latency", value: "<100ms Inference" }
      ],
      features: ["Automated Document Verification", "Multilingual Voice Liaisons", "Predictive Governance Analytics", "Citizen Intent Mapping"]
    },
    {
      id: "portals",
      title: "Strategic Gov-Portals",
      subtitle: "CENTRALIZED SERVICE DELIVERY",
      desc: "Digital gateways that unify disparate government services into a single, cohesive, and highly secure citizen journey.",
      specs: [
        { label: "Security", value: "Zero Trust Arch" },
        { label: "Mobile", value: "PWA Optimized" },
        { label: "Integrations", value: "NIC / DigiLocker" }
      ],
      features: ["Unified Single Sign-On (SSO)", "High-Fidelity UI/UX", "Massive Scalability", "Real-time Compliance Monitoring"]
    }
  ];

  return (
    <div className="pt-40 pb-20 bg-white">
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
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Service Portfolio</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            Mission-Ready <br />
            <span className="text-accent italic font-light">Versionlabs Assets.</span>
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            We don't build websites. We build the digital infrastructure that defines a nation's relationship with its citizens.
          </p>
        </div>

        <div className="space-y-32">
          {deepServices.map((service, idx) => (
            <div key={service.id} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <div>
                <span className="inline-block px-4 py-1.5 border border-accent/20 bg-accent/5 text-accent text-sm font-black uppercase tracking-ultra mb-8">
                  Capability {idx + 1}
                </span>
                <h3 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 mb-6 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-accent text-sm font-black uppercase tracking-ultra mb-10">
                  {service.subtitle}
                </p>
                <p className="text-slate-500 text-lg leading-relaxed mb-12 font-light">
                  {service.desc}
                </p>
                <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center space-x-3 text-base font-medium text-slate-700">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-12 relative group shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="text-8xl font-display font-black text-accent">0{idx + 1}</span>
                </div>
                <h4 className="text-base font-black uppercase tracking-ultra text-slate-400 mb-10">Technical Specifications</h4>
                <div className="space-y-10">
                  {service.specs.map(spec => (
                    <div key={spec.label} className="border-b border-slate-200 pb-6">
                      <p className="text-sm font-black uppercase tracking-ultra text-accent/60 mb-2">{spec.label}</p>
                      <p className="text-3xl font-display font-black text-obsidian-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10 border-t border-slate-200">
                   <button className="w-full py-5 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center justify-center space-x-4 group">
                      <span>Download Tech Manual</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesView;

