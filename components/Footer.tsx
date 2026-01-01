'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 pt-40 pb-20 border-t border-slate-100 relative overflow-hidden">
      {/* Refined background branding */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full opacity-[0.03] pointer-events-none select-none text-center">
        <h1 className="text-[14vw] font-display font-black leading-none mb-[-2vw] text-obsidian-900 whitespace-nowrap tracking-tighter">
          VERSIONLABS
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-24 mb-32">
          <div className="md:col-span-5 space-y-12">
            <Link 
              href="/"
              className="flex items-center space-x-5 group cursor-pointer"
            >
              {/* Logo from public folder - Dark version for white background */}
              <Image
                src="/DarkVersion-vl-logo.png"
                alt="Version Labs Logo"
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-lg text-slate-500 leading-relaxed font-light max-w-md">
              We architect the digital foundation for Versionlabs governance. 
              Designing mission-ready platforms for state and national initiatives.
            </p>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Verticals</h4>
            <ul className="space-y-4 text-base font-light text-slate-500">
              <li><Link href="/services" className="hover:text-accent transition-colors">Government Portals</Link></li>
              <li><Link href="/solution-learning" className="hover:text-accent transition-colors">Enterprise LMS</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Insights & Journal</Link></li>
              <li><Link href="/strategy" className="hover:text-accent transition-colors">AI Strategy</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Enterprise</h4>
            <ul className="space-y-4 text-base font-light text-slate-500">
              <li><Link href="/vl" className="hover:text-accent font-bold transition-colors">Versionlabs Live Projects</Link></li>
              <li><Link href="/intel" className="hover:text-accent font-bold transition-colors">Intel Live Projects</Link></li>
              <li><Link href="/press" className="hover:text-accent transition-colors">Media Relations</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">GIGW Compliance</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Inquiries</h4>
            <p className="text-base font-light text-slate-500 leading-relaxed">
              Our team operates with the highest level of administrative discretion for sensitive public sector projects.
            </p>
            <Link 
              href="/enquiry"
              className="p-8 border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-accent/40 transition-colors block"
            >
              <div className="flex items-center space-x-4 mb-3">
                 <div className="w-8 h-px bg-accent"></div>
                 <span className="text-base font-black uppercase tracking-ultra text-accent">Secure Line</span>
              </div>
              <p className="text-obsidian-900 font-display text-base">contact@versionlabs.co</p>
            </Link>
          </div>
        </div>
        
        {/* Bottom Institutional Strip */}
        <div className="pt-12 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            <div className="flex items-center space-x-8">
              <p className="text-base font-black uppercase tracking-[0.2em] text-slate-300">
                © 2025 Version Labs LLP. All rights reserved.
              </p>
              <div className="hidden lg:block h-5 w-px bg-slate-200"></div>
              <div className="flex items-center space-x-3 text-base font-black text-accent/60 uppercase tracking-widest">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                <span>Certified Versionlabs Platform</span>
              </div>
            </div>

            {/* <div className="flex flex-wrap justify-center gap-x-8 gap-y-5 text-base font-black uppercase tracking-ultra text-slate-300">
              <button className="hover:text-accent transition-colors">DIGITAL PRIVACY ACT</button>
              <span className="hidden lg:block text-slate-200">•</span>
              <button className="hover:text-accent transition-colors">STANDARD PROTOCOLS</button>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
