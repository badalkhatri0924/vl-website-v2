'use client'

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { PRODUCTS, LANDING_PRODUCT_IDS } from '@/data/products';

const ProductShowcase: React.FC = () => {
  const landingProducts = LANDING_PRODUCT_IDS
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p != null);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-6 inline-flex items-center space-x-4 text-accent text-base font-display font-black uppercase tracking-[0.3em]">
            <div className="w-10 h-[2px] bg-accent" />
            <span>Our Products</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 mb-6 leading-tight">
            Build with <span className="text-accent italic">precision.</span>
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            From document intelligence and privacy-first tools to community-driven work-our products power modern teams and workflows.
          </p>
        </div>

        {/* 4-product 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl m-auto">
          {landingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/products"
            className="inline-flex items-center space-x-4 bg-accent hover:bg-accent-600 transition-all duration-500 p-1 shadow-[0_10px_40px_rgba(0,100,224,0.2)] group"
          >
            <div className="bg-accent-400 p-4 text-white group-hover:scale-110 transition-transform">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="pr-8 text-white font-black uppercase tracking-widest text-sm">View all products</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cardContent = (
    <div className="bg-white border border-slate-100 flex flex-col h-full transition-all duration-500 overflow-hidden hover:border-accent/40 hover:shadow-lg group">
      <div className="h-60 relative overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-display font-black text-obsidian-900 leading-tight mb-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-accent text-sm font-black uppercase tracking-ultra mb-4">
          {product.tagline}
        </p>
        <p className="text-slate-500 text-sm leading-relaxed font-light line-clamp-3 mb-6">
          {product.description}
        </p>
        {/* Key Features */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-ultra text-slate-400 mb-4">Key Features</h4>
          <ul className="space-y-2 mb-6">
            {product.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {product.link && (
            <div className="pt-2">
              <div className="inline-flex items-center space-x-3 bg-accent text-white px-6 py-3 text-sm font-black uppercase tracking-ultra group-hover:bg-obsidian-900 transition-all duration-300 w-fit">
                <span>View Details</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // If a link is provided, make the whole card clickable to the external site
  if (product.link) {
    return (
      <Link
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {cardContent}
      </Link>
    );
  }

  // Fallback: non-clickable card if no external link is defined
  return cardContent;
};

export default ProductShowcase;
