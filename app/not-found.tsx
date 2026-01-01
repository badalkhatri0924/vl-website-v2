import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-[12rem] md:text-[18rem] font-display font-black text-accent/10 leading-none tracking-tighter">
              404
            </h1>
          </div>
          
          {/* Error Message */}
          <div className="mb-10 inline-flex items-center space-x-3 text-accent text-sm font-black uppercase tracking-ultra">
            <div className="w-10 h-px bg-accent"></div>
            <span>Page Not Found</span>
            <div className="w-10 h-px bg-accent"></div>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-display font-black text-obsidian-900 mb-6 leading-tight tracking-tighter">
            The page you're looking for <span className="text-accent italic">doesn't exist.</span>
          </h2>
          
          {/* Description */}
          <p className="text-xl text-slate-600 mb-12 leading-relaxed font-light max-w-2xl mx-auto text-balance">
            It seems you've navigated to a page that doesn't exist on our platform. 
            Let's get you back on track.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="group relative px-10 py-5 font-black uppercase tracking-[0.35em] text-[11px] transition-all duration-300 flex items-center space-x-4 border-2 border-accent bg-accent text-white hover:bg-accent-600 hover:border-accent-600"
            >
              <span>Return Home</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            
            {/* <Link 
              href="/enquiry"
              className="group relative px-10 py-5 font-black uppercase tracking-[0.35em] text-[11px] transition-all duration-300 flex items-center space-x-4 border-2 border-slate-200 text-obsidian-900 hover:border-accent hover:text-accent bg-white"
            >
              <span>Contact Us</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}

