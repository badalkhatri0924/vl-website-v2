'use client'

import React from 'react';
import Link from 'next/link';
import { SanityBlogPost, formatDate } from '@/lib/sanity/utils';
import PortableTextRenderer from './PortableTextRenderer';

interface BlogPostViewProps {
  post: SanityBlogPost;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post }) => {
  return (
    <div className="bg-white">
      {/* Article Hero */}
      <section className="relative pt-48 pb-32 bg-obsidian-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={post.imageUrl || 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[10s]"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.src = 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="mb-12 flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-black uppercase tracking-ultra">Back to Insights</span>
            </Link>
            
            <div className="mb-10 flex items-center space-x-6">
              <span className="px-5 py-2 border border-accent/40 bg-accent/10 text-accent text-sm font-black uppercase tracking-ultra">
                {post.category}
              </span>
              <span className="text-slate-400 text-sm font-black uppercase tracking-ultra">{formatDate(post.publishedAt)}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-slate-400 text-sm font-black uppercase tracking-ultra">{post.readTime}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] tracking-tighter mb-12">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 grayscale shadow-xl">
                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white text-base font-black uppercase tracking-ultra">{post.author.name}</p>
                <p className="text-accent text-sm font-black uppercase tracking-widest">{post.author.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate prose-xl font-light leading-relaxed text-slate-600">
              <p className="text-2xl text-obsidian-900 font-medium mb-12 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="space-y-10 text-lg md:text-xl">
                <PortableTextRenderer content={post.content} />
              </div>
            </div>

            {/* Tags & Sharing */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-24 pt-12 border-t border-slate-100 flex flex-wrap gap-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-sm font-black uppercase tracking-ultra text-slate-400 bg-slate-50 px-4 py-2 border border-slate-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-40 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8">Strategic Follow-up</h4>
          <p className="text-4xl md:text-6xl font-display font-black text-obsidian-900 tracking-tighter mb-12 max-w-3xl mx-auto">
            Ready to implement <br /> these <span className="text-accent italic">strategies?</span>
          </p>
          <Link 
            href="/enquiry"
            className="inline-block px-14 py-7 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-xl"
          >
            Request a Discovery Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPostView;

