'use client'

import React from 'react';
import Link from 'next/link';

export const TESTIMONIALS = [
  {
    id: "t1",
    quote: "The ability to deploy a national-scale learning platform that handles millions of concurrent citizens while maintaining total data sovereignty is why we partner with this platform.",
    author: "Dato' Seri Mohd Zuki",
    position: "National AI Office Lead",
    organization: "Malaysia",
    institution: "Federal Government",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t2",
    quote: "The platform understands that in the public sector, UI/UX is an accessibility requirement, not a luxury. Their inclusive design approach has been critical to our G20 mission success.",
    author: "Dr. Ananya Sharma",
    position: "Strategic Advisor",
    organization: "G20 Empower",
    institution: "Global Initiative",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t3",
    quote: "Securing national digital infrastructure against modern threats requires a partner who builds with a security-first mindset. This platform is that partner for our skilling ecosystem.",
    author: "Shri Rajesh Kumar",
    position: "Director General",
    organization: "Innovation Council",
    institution: "Govt. of India",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t4",
    quote: "Our transition to digital governance was seamless thanks to the platform's deep understanding of bureaucratic workflows and administrative needs.",
    author: "Tan Sri Ahmad",
    position: "Chief Secretary",
    organization: "Govt. Agency",
    institution: "Public Sector",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t5",
    quote: "The personalized learning paths enabled by our AI platform have significantly increased completion rates across our rural skill centers.",
    author: "Smt. Priya Singh",
    position: "Education Director",
    organization: "Skill India Mission",
    institution: "State Level",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t6",
    quote: "Scalability was our biggest challenge until the platform architected our citizen portal. It now handles peak traffic with zero latency issues.",
    author: "Linh Nguyen",
    position: "Digital Transformation Lead",
    organization: "NIC Vietnam",
    institution: "Strategic Program",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  }
];

export const TestimonialCard: React.FC<{ testimonial: typeof TESTIMONIALS[0] }> = ({ testimonial }) => (
  <div className="bg-white border border-slate-100 p-8 flex flex-col h-full hover:border-accent/40 transition-all duration-500 shadow-sm hover:shadow-md group">
    <div className="flex items-center space-x-4 mb-8">
      <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 filter grayscale group-hover:grayscale-0 transition-all duration-700 flex-shrink-0">
        <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
      </div>
      <div className="overflow-hidden">
        <h4 className="text-base font-display font-black text-obsidian-900 truncate tracking-tight">{testimonial.author}</h4>
        <p className="text-accent text-base font-black uppercase tracking-ultra truncate">
          {testimonial.position} <br />
          <span className="opacity-60">{testimonial.organization}</span>
        </p>
      </div>
    </div>
    <div className="relative">
      <svg className="absolute -top-4 -left-2 w-8 h-8 text-accent/5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12" />
      </svg>
      <p className="text-slate-500 text-base leading-relaxed font-light line-clamp-3 relative z-10 italic">
        "{testimonial.quote}"
      </p>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const featured = TESTIMONIALS.slice(0, 3);

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-accent text-base font-black uppercase tracking-ultra mb-4">Institutional Trust</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black text-obsidian-900 tracking-tighter">
            Voices from the <span className="text-accent italic font-light">Public Sector.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featured.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link 
            href="/testimonials"
            className="px-6 py-3 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm flex items-center space-x-4 group"
          >
            <span>View All Testimonials</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;