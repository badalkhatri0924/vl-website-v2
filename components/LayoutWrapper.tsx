'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  return (
    <>
      {!isStudioRoute && <Header />}
      <main className={isStudioRoute ? '' : 'animate-in fade-in duration-1000'}>
        {children}
      </main>
      {!isStudioRoute && <Footer />}
    </>
  )
}


