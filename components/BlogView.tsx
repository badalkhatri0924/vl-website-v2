'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SanityBlogPost, formatDate } from '@/lib/sanity/utils';

interface BlogViewProps {
  posts: SanityBlogPost[];
}

const BlogView: React.FC<BlogViewProps> = ({ posts }) => {
  const router = useRouter();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  if (!featuredPost) {
    return (
      <div className="pt-40 py-20 bg-[#FDFDFD]">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-black uppercase tracking-ultra">Back to Home</span>
            </Link>
            <Link
              href="/studio/structure/post"
              className="flex items-center space-x-2 px-6 py-3 bg-accent text-white text-sm font-black uppercase tracking-ultra hover:bg-accent/90 transition-all duration-300 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Blog Post</span>
            </Link>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">VersionLabs Insights</h1>
            <h2 className="text-4xl md:text-6xl font-display font-black text-obsidian-900 leading-tight tracking-tighter mb-8">
              No blog posts yet
            </h2>
            <p className="text-slate-600 text-xl mb-12">
              Get started by creating your first blog post in Sanity Studio.
            </p>
            <Link
              href="/studio/structure/post"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Your First Post</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePostClick = (post: SanityBlogPost) => {
    router.push(`/blog/${post.slug.current}`);
  };

  return (
    <div className="pt-40 py-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-black uppercase tracking-ultra">Back to Home</span>
          </Link>
          {/* <Link
            href="/studio/structure/post"
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white text-sm font-black uppercase tracking-ultra hover:bg-accent/90 transition-all duration-300 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Blog Post</span>
          </Link> */}
        </div>

        {/* Editorial Header */}
        <div className="max-w-4xl mb-32">
          <h1 className="text-accent text-base font-black uppercase tracking-ultra mb-8">VersionLabs Insights</h1>
          <h2 className="text-6xl md:text-9xl font-display font-black text-obsidian-900 leading-[0.85] tracking-tighter mb-12">
            The Digital <br />
            <span className="text-accent italic font-light">Loom.</span>
          </h2>
          <p className="text-slate-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl text-balance">
            Strategic commentary on digital governance, nation-scale infrastructure, and the sovereign AI revolution.
          </p>
        </div>

        {/* Featured Post */}
        <div 
          onClick={() => handlePostClick(featuredPost)}
          className="relative group cursor-pointer mb-32 overflow-hidden bg-obsidian-950 border border-slate-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            <div className="lg:col-span-7 relative overflow-hidden">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/40 to-transparent"></div>
            </div>
            <div className="lg:col-span-5 p-12 md:p-20 flex flex-col justify-center text-white relative z-10">
              <div className="mb-10 flex items-center space-x-4">
                <span className="px-4 py-1.5 border border-accent/40 bg-accent/10 text-accent text-base font-black uppercase tracking-ultra">
                  {featuredPost.category}
                </span>
                <span className="text-slate-400 text-sm font-black uppercase tracking-ultra">{featuredPost.readTime}</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-black mb-8 leading-tight tracking-tight group-hover:text-accent transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed mb-12">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 grayscale">
                  <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-ultra">{featuredPost.author.name}</p>
                  <p className="text-accent text-sm font-black uppercase tracking-widest">{featuredPost.author.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
          {otherPosts.map((post) => (
            <div 
              key={post._id} 
              onClick={() => handlePostClick(post)}
              className="bg-white p-12 md:p-20 group cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-accent text-base font-black uppercase tracking-ultra">
                  {post.category}
                </span>
                <span className="text-slate-400 text-sm font-black uppercase tracking-ultra">{formatDate(post.publishedAt)}</span>
              </div>
              <h3 className="text-2xl font-display font-black text-obsidian-900 mb-8 leading-tight tracking-tight group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-500 text-lg font-light leading-relaxed mb-12 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden grayscale opacity-40 group-hover:opacity-100 transition-opacity">
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                  </div>
                    <span className="text-base font-black uppercase tracking-ultra text-slate-400 group-hover:text-obsidian-900 transition-colors">
                    {post.author.name}
                  </span>
                </div>
                <div className="text-accent group-hover:translate-x-2 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Strip */}
        <div className="mt-20 border-t border-slate-100 pt-24 text-center">
           <h4 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Strategic Intelligence</h4>
           <p className="text-3xl font-display font-black text-obsidian-900 tracking-tight mb-12 max-w-2xl mx-auto">
             Stay informed on the evolution of national digital infrastructure.
           </p>
           <div className="flex justify-center space-x-6">
             <button 
              className="px-12 py-6 bg-obsidian-900 text-white text-sm font-black uppercase tracking-ultra hover:bg-accent transition-all duration-300 shadow-sm"
             >
                Subscribe to Insights
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BlogView;

