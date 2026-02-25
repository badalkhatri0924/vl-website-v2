import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ProductShowcase from '@/components/ProductShowcase'
import WhyUs from '@/components/WhyUs'
import CaseStudies from '@/components/CaseStudies'
import PressSection from '@/components/PressSection'
import Testimonials from '@/components/Testimonials'
import { getBlogPosts, formatDate } from '@/lib/sanity/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Infrastructure for Government | Version Labs',
  description: 'Enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals.',
  openGraph: {
    title: 'Digital Infrastructure for Government | Version Labs',
    description: 'Enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals.',
    url: 'https://versionlabs.co',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media',
        width: 1200,
        height: 630,
        alt: 'Version Labs - Digital Infrastructure for Government',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Infrastructure for Government | Version Labs',
    description: 'Enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals.',
    images: ['https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media'],
  },
}

export default async function Home() {
  const allPosts = await getBlogPosts()
  const posts = allPosts.slice(0, 3)

  return (
    <>
      <Hero />
      <Features />
      <ProductShowcase />
      <WhyUs />
      <CaseStudies />
      <PressSection />
      {/* <Testimonials /> */}

      {/* Blog preview section */}
      <section className="py-24 bg-[#FDFDFD]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-accent text-sm font-black uppercase tracking-ultra mb-4">
                Insights
              </h2>
              <h1 className="text-[8vw] font-display font-extralight text-accent italic leading-none tracking-tighter mb-10">
                Blogs
              </h1>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-3 px-6 py-3 bg-obsidian-900 text-white text-xs md:text-sm font-black uppercase tracking-ultra hover:bg-accent transition-colors duration-300"
            >
              <span>View more</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl || 'https://via.placeholder.com/800x450/4A5568/FFFFFF?text=Blog+Post'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[11px] font-black uppercase tracking-ultra text-slate-400 mb-3">
                    {post.category}
                  </p>
                  <h3 className="text-lg md:text-xl font-display font-black text-obsidian-900 leading-snug tracking-tight mb-3">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-[11px] font-black uppercase tracking-ultra text-slate-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="text-slate-500">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      {/* High-Impact Bottom Call to Action */}
      <section className="py-36 bg-obsidian-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* <div className="mb-10 inline-flex items-center space-x-3 text-accent text-sm font-black uppercase tracking-ultra">
              <div className="w-10 h-px bg-accent"></div>
              <span>Global Mission</span>
            </div> */}
            <h2 className="text-6xl md:text-9xl font-display font-black text-white mb-12 leading-tight tracking-tighter">
              Transform at <span className="text-accent italic">Scale.</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-20 leading-relaxed font-light max-w-3xl mx-auto text-balance">
              Whether you are planning a national LMS, a government portal, or a digital governance platform - our team is ready to support your mission.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <Link 
                href="/enquiry"
                className="flex flex-col items-center cursor-pointer group"
              >
               <p className="text-base font-black text-accent uppercase tracking-ultra mb-3 transition-transform group-hover:-translate-y-1">Primary Consultation</p>
               <p className="text-white font-display text-2xl border-b border-accent/40 pb-2 group-hover:text-accent transition-colors">contact@versionlabs.co</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

