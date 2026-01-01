import Hero from '@/components/Hero'
import Features from '@/components/Features'
import WhyUs from '@/components/WhyUs'
import CaseStudies from '@/components/CaseStudies'
import PressSection from '@/components/PressSection'
import Testimonials from '@/components/Testimonials'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <WhyUs />
      <CaseStudies />
      <PressSection />
      {/* <Testimonials /> */}
      
      {/* High-Impact Bottom Call to Action */}
      <section className="py-60 bg-obsidian-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-10 inline-flex items-center space-x-3 text-accent text-sm font-black uppercase tracking-ultra">
              <div className="w-10 h-px bg-accent"></div>
              <span>Global Mission</span>
            </div>
            <h2 className="text-6xl md:text-9xl font-display font-black text-white mb-12 leading-tight tracking-tighter">
              Transform at <span className="text-accent italic">Scale.</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-20 leading-relaxed font-light max-w-3xl mx-auto text-balance">
              Whether you are planning a national LMS, a government portal, or a digital governance platform — our team is ready to support your mission.
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

