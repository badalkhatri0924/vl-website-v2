'use client'

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cardContent = (
    <div className="bg-white border border-slate-100 flex flex-col h-full group transition-all duration-500 overflow-hidden hover:border-accent/40 hover:shadow-lg cursor-pointer">
      {/* Visual Header */}
      <div className="h-64 relative overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <div className="bg-white px-3 py-1 flex items-center space-x-2 text-sm font-black uppercase tracking-ultra text-obsidian-900 border border-slate-100 shadow-sm">
            <span>{product.category}</span>
          </div>
        </div> */}
      </div>

      {/* Content Body */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-2xl font-display font-black text-obsidian-900 leading-tight mb-3 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-accent text-base font-black uppercase tracking-ultra mb-4">
            {product.tagline}
          </p>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light line-clamp-3">
          {product.description}
        </p>

        {/* Features List */}
        <div className="mt-auto pt-8 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-ultra text-slate-400 mb-4">Key Features</h4>
          <ul className="space-y-2">
            {product.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-accent"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="inline-flex items-center space-x-3 bg-accent text-white px-6 py-3 text-sm font-black uppercase tracking-ultra group-hover:bg-obsidian-900 transition-all duration-300">
            <span>View Details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/products/${product.id}`} className="block">
      {cardContent}
    </Link>
  );
};

const ProductsView: React.FC = () => {
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
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Product Portfolio</h1>
          <h2 className="text-6xl md:text-8xl font-display font-black text-obsidian-900 leading-[0.9] tracking-tighter mb-12">
            VersionLabs <br />
            <span className="text-accent italic font-light">Products.</span>
          </h2>
          <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl">
            Discover our suite of innovative products designed to transform digital workflows and enhance productivity across industries.
          </p>
        </div>

        {/* Products Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State Message (if no products) */}
        {PRODUCTS.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-light">More products coming soon...</p>
          </div>
        )}

        {/* Contact CTA Strip */}
        <div className="mt-20 border-t border-slate-100 pt-24 text-center">
          <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8">Product Inquiries</h4>
          <p className="text-3xl font-display font-black text-obsidian-900 tracking-tight mb-12">
            Interested in learning more about our products?
          </p>
          <div className="flex justify-center">
            <Link 
              href="/enquiry"
              className="px-12 py-6 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group"
            >
              <span>Request Product Demo</span>
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

export default ProductsView;

