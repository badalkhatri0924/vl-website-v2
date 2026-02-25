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
              We architect the digital foundation for sovereign governance. 
              Designing mission-ready platforms for state and national initiatives.
            </p>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Navigation</h4>
            <ul className="space-y-4 text-base font-light text-slate-500">
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              {/* <li><Link href="/solution-learning" className="hover:text-accent transition-colors">Enterprise LMS</Link></li> */}
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/products" className="hover:text-accent transition-colors">Products</Link></li>
              <li><Link href="/strategy" className="hover:text-accent transition-colors">AI Strategy</Link></li>
              <li><Link href="/press" className="hover:text-accent transition-colors">Press</Link></li>

            </ul>
          </div>
          
          {/* <div className="md:col-span-2 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Enterprise</h4>
            <ul className="space-y-4 text-base font-light text-slate-500">
              <li><Link href="/vl" className="hover:text-accent font-bold transition-colors">Versionlabs Live Projects</Link></li>
              <li><Link href="/intel" className="hover:text-accent font-bold transition-colors">Intel Live Projects</Link></li>
              <li><Link href="/press" className="hover:text-accent transition-colors">Press</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">GIGW Compliance</Link></li>
            </ul>
          </div> */}

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-base font-black uppercase tracking-ultra text-accent">Inquiries</h4>
            <p className="text-base font-light text-slate-500 leading-relaxed">
              Our team operates with the highest level of administrative discretion for sensitive public sector projects.
            </p>
            <div className="p-8 border border-slate-100 bg-slate-50/50 hover:border-accent/40 transition-colors">
              <Link
                href="/enquiry"
                className="flex items-center space-x-4 mb-3 group"
              >
                 <div className="w-8 h-px bg-accent group-hover:bg-accent/80 transition-colors"></div>
                 <span className="text-base font-black uppercase tracking-ultra text-accent group-hover:text-obsidian-900 transition-colors">
                  Secure Line
                 </span>
              </Link>
              <a
                href="mailto:contact@versionlabs.co"
                className="text-obsidian-900 font-display text-base mb-3 hover:text-accent transition-colors"
              >
                contact@versionlabs.co
              </a>
              <div className="flex items-center justify-between gap-4 mt-4">
                {/* <Link 
                  href="/enquiry"
                  className="text-sm font-black uppercase tracking-ultra text-obsidian-900 hover:text-accent transition-colors"
                >
                  Contact Us
                </Link> */}
                <div className="flex items-center space-x-3">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/version-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Version Labs on LinkedIn"
                    className="p-2 rounded-full border border-slate-200 hover:border-accent/60 hover:bg-white transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-[#0077B5] transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM7.118 20.452H3.56V9h3.559v11.452zM5.34 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm15.11 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.353V9h3.414v1.561h.047c.476-.9 1.636-1.85 3.369-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
                    </svg>
                  </a>

                  {/* X (formerly Twitter) */}
                  <a
                    href="https://x.com/versionlabs?s=20"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Version Labs on X"
                    className="p-2 rounded-full border border-slate-200 hover:border-accent/60 hover:bg-white transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-black transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Institutional Strip */}
        <div className="pt-12 border-t border-slate-100">
          <div className="flex justify-center">
            <p className="text-base font-black uppercase tracking-[0.2em] text-slate-300 text-center">
              © 2025 Version Labs LLP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
