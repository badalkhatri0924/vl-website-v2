'use client'

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductPostViewProps {
  product: Product;
}

const ProductPostView: React.FC<ProductPostViewProps> = ({ product }) => {
  return (
    <div className="bg-white">
      {/* Product Hero */}
      <section className="relative pt-48 pb-32 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[10s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/products"
              className="mb-12 flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-black uppercase tracking-ultra">Back to Products</span>
            </Link>
            
            <div className="mb-10 flex items-center space-x-6">
              <span className="px-5 py-2 border border-accent/40 bg-accent/10 text-accent text-sm font-black uppercase tracking-ultra">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] tracking-tighter mb-6">
              {product.name}
            </h1>
            
            <p className="text-2xl md:text-3xl text-accent font-light italic mb-12">
              {product.tagline}
            </p>

            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-4 bg-accent hover:bg-accent-600 text-white px-8 py-4 text-sm font-black uppercase tracking-ultra transition-all duration-300 shadow-xl group/btn"
              >
                <span>Visit Product Website</span>
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="prose prose-slate prose-xl font-light leading-relaxed text-slate-600 mb-16">
              <p className="text-2xl text-obsidian-900 font-medium mb-12 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <h2 className="text-4xl font-display font-black text-obsidian-900 mb-10 tracking-tight">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature, i) => (
                  <div 
                    key={i}
                    className="flex items-start space-x-4 p-6 bg-white border border-slate-100 hover:border-accent/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                    <p className="text-lg text-slate-700 font-medium leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases Section */}
            <div className="mb-16 bg-obsidian-950 p-12 text-white">
              <h2 className="text-4xl font-display font-black mb-8 tracking-tight">
                Use Cases
              </h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-slate-300">
                <p>
                  {product.name} is designed for organizations that require enterprise-grade solutions with uncompromising security and scalability. Whether you're a government agency, educational institution, or large corporation, our platform adapts to your unique requirements.
                </p>
                <p>
                  The platform has been successfully deployed across multiple countries, handling millions of transactions daily while maintaining the highest standards of data protection and system reliability.
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-16">
              <h2 className="text-4xl font-display font-black text-obsidian-900 mb-10 tracking-tight">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border-b border-slate-200 pb-6">
                  <p className="text-sm font-black uppercase tracking-ultra text-accent/60 mb-2">Security</p>
                  <p className="text-2xl font-display font-black text-obsidian-900">Enterprise-Grade</p>
                </div>
                <div className="border-b border-slate-200 pb-6">
                  <p className="text-sm font-black uppercase tracking-ultra text-accent/60 mb-2">Uptime</p>
                  <p className="text-2xl font-display font-black text-obsidian-900">99.99% SLA</p>
                </div>
                <div className="border-b border-slate-200 pb-6">
                  <p className="text-sm font-black uppercase tracking-ultra text-accent/60 mb-2">Compliance</p>
                  <p className="text-2xl font-display font-black text-obsidian-900">GDPR Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-40 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8">Product Inquiry</h4>
          <p className="text-4xl md:text-6xl font-display font-black text-obsidian-900 tracking-tighter mb-12 max-w-3xl mx-auto">
            Ready to explore <br /> <span className="text-accent italic">{product.name}?</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/enquiry"
              className="px-14 py-7 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-xl"
            >
              Request Product Demo
            </Link>
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-14 py-7 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm"
              >
                Visit Product Website
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPostView;

