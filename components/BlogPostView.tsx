'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SanityBlogPost, formatDate } from '@/lib/sanity/utils';
import PortableTextRenderer from './PortableTextRenderer';
import ShareButton from './ShareButton';

interface BlogPostViewProps {
  post: SanityBlogPost;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post }) => {
  const pathname = usePathname();
  
  return (
    <div className="bg-white">
      {/* Article Hero */}
      <section className="relative pt-20 md:pt-56 pb-20 md:pb-40 bg-obsidian-950 overflow-hidden">
        {/* Background image for desktop only */}
        <div className="absolute inset-0 z-0 hidden md:block">
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
        
        <div className="container mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Link 
              href="/blog"
              className="mb-6 md:mb-14 flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-black uppercase tracking-ultra">Back to Insights</span>
            </Link>
            
            {/* Mobile Layout: Category, Date, Image (flex-col) */}
            <div className="md:hidden flex flex-col gap-4 mb-8">
              <span className="px-5 py-2.5 border border-accent/60 bg-accent/20 text-white text-xs font-black uppercase tracking-ultra w-fit">
                {post.category}
              </span>
              <span className="text-slate-400 text-xs font-black uppercase tracking-ultra">{formatDate(post.publishedAt)}</span>
              
              {/* Mobile Image */}
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <img 
                  src={post.imageUrl || 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'
                  }}
                />
              </div>
            </div>
            
            {/* Desktop Layout: Category, Date, Read Time (flex-row) */}
            <div className="hidden md:flex flex-wrap items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <span className="px-5 md:px-6 py-2.5 border border-accent/60 bg-accent/20 text-white text-xs md:text-sm font-black uppercase tracking-ultra">
                {post.category}
              </span>
              <span className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-ultra">{formatDate(post.publishedAt)}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-ultra">{post.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tighter mb-10 md:mb-14">
              {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-2">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/10 grayscale shadow-xl flex-shrink-0">
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm md:text-base font-black uppercase tracking-ultra truncate">{post.author.name}</p>
                  <p className="text-accent text-xs md:text-sm font-black uppercase tracking-widest truncate">{post.author.title}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ShareButton 
                  url={pathname}
                  title={post.title}
                  description={post.excerpt}
                  className="text-white [&_button]:hover:bg-white/10 [&_svg]:text-white/80 [&_span]:text-white/60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20 md:pb-20 md:pt-2 pt-2">
        <div className="container mx-auto px-5 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="prose prose-slate prose-xl font-light leading-relaxed text-slate-600">
              {/* Intro excerpt paragraph hidden as requested
              <p className="text-xl md:text-2xl lg:text-3xl text-obsidian-900 font-medium mb-12 md:mb-16 leading-relaxed">
                {post.excerpt}
              </p>
              */}
              <div className="space-y-8 md:space-y-12 text-base md:text-lg lg:text-xl">
                <PortableTextRenderer content={post.content} />
              </div>
            </div>

            {/* Tags & Sharing */}
            <div className="mt-16 md:mt-32 pt-12 md:pt-16 border-t border-slate-100">
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3 md:gap-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs md:text-sm font-black uppercase tracking-ultra text-slate-400 bg-slate-50 px-4 md:px-5 py-2.5 border border-slate-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <ShareButton 
                url={pathname}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-24 md:py-48 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-5 md:px-8 lg:px-12 text-center">
          <h4 className="text-accent text-sm font-black uppercase tracking-ultra mb-8 md:mb-10">Strategic Follow-up</h4>
          <p className="text-2xl md:text-4xl lg:text-6xl font-display font-black text-obsidian-900 tracking-tighter mb-12 md:mb-16 max-w-3xl mx-auto leading-tight">
            Ready to implement <br className="hidden md:block" /> these <span className="text-accent italic">strategies?</span>
          </p>
          <Link 
            href="/enquiry"
            className="inline-block px-10 md:px-16 py-6 md:py-8 bg-obsidian-900 text-white text-xs md:text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-xl"
          >
            Request a Discovery Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPostView;

