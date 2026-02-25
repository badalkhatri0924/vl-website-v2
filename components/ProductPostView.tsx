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
      <section className="relative pt-48 pb-14 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[10s] pt-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Navigation Breadcrumb */}
            <div className="mb-12">
              <Link 
                href="/products"
                className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-black uppercase tracking-ultra">Back to Products</span>
              </Link>
            </div>

            

            {/* Category Tag */}
            <div className="mb-10 flex items-center space-x-6">
              <span className="px-5 py-2 border border-white/40 bg-white/10 text-white text-sm font-black uppercase tracking-ultra">
                {product.category}
              </span>
            </div>
            
            {/* Product Title */}
            <h1 className="text-7xl md:text-9xl lg:text-[8rem] font-display font-black text-white leading-[1.1] tracking-tighter mb-6">
              {product.name}
            </h1>
            
            {/* Product Tagline */}
            <p className="text-3xl md:text-4xl lg:text-5xl text-accent font-light italic mb-12">
              {product.tagline}
            </p>

            {/* Stats strip (DocXpert-style) */}
            {product.stats && product.stats.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-8 md:gap-12">
                {product.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-display font-black text-white">
                      {stat.value}
                    </span>
                    <span className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* View product (external link) */}
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-4 border-white/20  text-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.6)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:bg-obsidian-900 group-hover:text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
                <div className="flex flex-col text-left">
                  {/* <span className="text-xs font-black uppercase tracking-[0.25em]">
                    Visit website
                  </span> */}
                  <span className="text-sm font-semibold">
                    Explore {product.name} live
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Description */}
            <div className="prose prose-slate prose-xl font-light leading-relaxed text-slate-600 mb-16">
              <p className="text-2xl text-obsidian-900 font-medium mb-12 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Advanced Features (DocXpert-style cards with descriptions) */}
            {product.featureDetails && product.featureDetails.length > 0 ? (
              <div className="mb-20">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-4 tracking-tight">
                  Advanced Document Solutions
                </h2>
                <p className="text-slate-600 text-lg font-light mb-10 max-w-2xl">
                  Cutting-edge features for seamless document processing, recognition, and transformation with accuracy and speed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {product.featureDetails.map((item, i) => (
                    <div
                      key={i}
                      className="p-8 border border-slate-100 bg-white hover:border-accent/30 transition-colors"
                    >
                      <h3 className="text-xl font-display font-black text-obsidian-900 mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Key Features (simple list) */
              <div className="mb-16">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-10 tracking-tight">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 bg-white border border-slate-100"
                    >
                      <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0" />
                      <p className="text-xl text-slate-700 font-medium leading-relaxed">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How it works (3-step process) */}
            {product.howItWorks && product.howItWorks.length > 0 && (
              <div className="mb-20 py-16 border-y border-slate-100">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-4 tracking-tight">
                  How {product.name} Works
                </h2>
                <p className="text-slate-600 text-lg font-light mb-12 max-w-2xl">
                  Transform your documents in just a few simple steps with our intelligent processing system.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {product.howItWorks.map((step) => (
                    <div key={step.step} className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white font-display font-black text-lg">
                          {step.step}
                        </span>
                        <h3 className="text-xl font-display font-black text-obsidian-900 tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 font-light leading-relaxed pl-16">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Image */}
            <div className="mb-20 relative h-96 md:h-[700px] overflow-hidden bg-slate-100 border border-slate-100 rounded-lg p-4">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover border border-slate-200 rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', product.imageUrl);
                }}
              />
            </div>

            {/* Use Cases Section */}
            <div className="mb-20 bg-white border border-slate-100 p-12">
              <h2 className="text-4xl font-display font-black text-obsidian-900 mb-8 tracking-tight">
                Use Cases
              </h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-slate-600">
                <p>
                  {product.name} is designed for organizations that require enterprise-grade solutions with uncompromising security and scalability. Whether you're a government agency, educational institution, or large corporation, our platform adapts to your unique requirements.
                </p>
                <p>
                  The platform has been successfully deployed across multiple countries, handling millions of transactions daily while maintaining the highest standards of data protection and system reliability.
                </p>
              </div>
            </div>

            {/* Industry Solutions */}
            {product.industrySolutions && product.industrySolutions.length > 0 && (
              <div className="mb-20">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-4 tracking-tight">
                  Tailored Solutions for Every Industry
                </h2>
                <p className="text-slate-600 text-lg font-light mb-10 max-w-2xl">
                  {product.name} adapts to the specific document needs of various industries, with specialized workflows and compliance features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.industrySolutions.map((item, i) => (
                    <div
                      key={i}
                      className="p-6 border border-slate-100 bg-white hover:border-accent/30 transition-colors"
                    >
                      <h3 className="text-lg font-display font-black text-obsidian-900 mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="mb-20">
              <h2 className="text-4xl font-display font-black text-obsidian-900 mb-10 tracking-tight">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(product.technicalSpecs && product.technicalSpecs.length > 0
                  ? product.technicalSpecs
                  : [
                      { category: 'Security', value: 'Enterprise-Grade' },
                      { category: 'Uptime', value: '99.99% SLA' },
                      { category: 'Compliance', value: 'GDPR Ready' }
                    ]
                ).map((spec, i) => (
                  <div key={i} className="border-b border-slate-200 pb-6">
                    <p className="text-sm font-black uppercase tracking-ultra text-accent/80 mb-2">
                      {spec.category}
                    </p>
                    <p className="text-2xl font-display font-black text-obsidian-900">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials (full list or single quote) */}
            {product.testimonials && product.testimonials.length > 0 ? (
              <div className="mb-20">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-10 tracking-tight">
                  What Our Customers Say
                </h2>
                <div className="space-y-12">
                  {product.testimonials.map((t, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-accent pl-8 py-4 bg-slate-50/50"
                    >
                      <p className="text-xl text-slate-700 font-light italic leading-relaxed mb-4">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <p className="text-sm font-black text-obsidian-900">{t.author}</p>
                      {t.role && (
                        <p className="text-sm text-slate-500 font-light">{t.role}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : product.testimonial ? (
              <div className="mb-20 border-l-4 border-accent pl-8 py-6">
                <p className="text-xl text-slate-700 font-light italic leading-relaxed">
                  &ldquo;{product.testimonial}&rdquo;
                </p>
              </div>
            ) : null}

            {/* FAQ Section */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="mb-20">
                <h2 className="text-4xl font-display font-black text-obsidian-900 mb-4 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-lg font-light mb-10 max-w-2xl">
                  Find answers to common questions. If you can&apos;t find what you need, reach out to our support team.
                </p>
                <div className="space-y-6">
                  {product.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-slate-100 p-6 bg-white"
                    >
                      <h4 className="text-lg font-display font-black text-obsidian-900 mb-3 tracking-tight">
                        {faq.question}
                      </h4>
                      <p className="text-slate-600 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Links */}
            {product.link && (
              <div className="mb-20 flex flex-col sm:flex-row items-start gap-6">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-4 bg-accent hover:bg-obsidian-900 text-white px-8 py-4 text-sm font-black uppercase tracking-ultra transition-all duration-300 group/btn"
                >
                  <span>Visit Product Website</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8">Product Inquiries</h4>
          <p className="text-3xl font-display font-black text-obsidian-900 tracking-tight mb-12">
            Interested in learning more about {product.name}?
          </p>
          <div className="flex justify-center">
            <Link 
              href="/enquiry"
              className="px-6 py-3 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group"
            >
              <span>Request Product Demo</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPostView;

