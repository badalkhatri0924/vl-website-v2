import StrategySolutionView from '@/components/StrategySolutionView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Strategy & Build Services | Digital Transformation Consulting',
  description: 'Strategic roadmapping and custom-built digital assets for high-stakes governmental and educational missions. End-to-end transformation services turning vision into resilient digital architecture.',
  openGraph: {
    title: 'AI Strategy & Build Services | Digital Transformation Consulting',
    description: 'Strategic roadmapping and custom-built digital assets for high-stakes governmental missions. End-to-end transformation services for resilient digital architecture.',
    url: 'https://versionlabs.co/solution-strategy',
  },
}

export default function StrategySolutionPage() {
  return <StrategySolutionView />
}

