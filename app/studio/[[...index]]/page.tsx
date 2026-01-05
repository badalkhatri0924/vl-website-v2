'use client'

// Polyfill for useEffectEvent - React 19 compatibility for Sanity Studio
// This must run before any Sanity imports
if (typeof window !== 'undefined') {
  try {
    const React = require('react')
    const { useEffectEvent: polyfillUseEffectEvent } = require('use-effect-event')
    
    // If React doesn't have useEffectEvent, add the polyfill
    if (React && !React.useEffectEvent) {
      React.useEffectEvent = polyfillUseEffectEvent
    }
  } catch (e) {
    // Fallback: create a simple polyfill
    const React = require('react')
    if (React && !React.useEffectEvent) {
      React.useEffectEvent = function useEffectEvent(callback: any) {
        const ref = { current: callback }
        React.useEffect(() => {
          ref.current = callback
        })
        return React.useCallback((...args: any[]) => {
          return ref.current(...args)
        }, [])
      }
    }
  }
}

import dynamic from 'next/dynamic'
import config from '../../../sanity.config'

// Dynamically import NextStudio to avoid SSR issues and React 19 compatibility
const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div>Loading Sanity Studio...</div>
    </div>
  ),
})

export default function StudioPage() {
  return <NextStudio config={config} />
}

