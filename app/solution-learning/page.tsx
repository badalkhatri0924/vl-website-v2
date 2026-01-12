import LearningSolutionView from '@/components/LearningSolutionView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'National Learning Management System | Intelligent Learning Solutions',
  description: 'Deploying national-scale LMS architecture that transforms citizen skilling missions. AI-powered learning platforms that scale to millions with personalized pathways and blockchain credential engines.',
  openGraph: {
    title: 'National Learning Management System | Intelligent Learning Solutions',
    description: 'Deploying national-scale LMS architecture that transforms citizen skilling missions. AI-powered learning platforms that scale to millions with personalized pathways.',
    url: 'https://versionlabs.co/solution-learning',
  },
}

export default function LearningSolutionPage() {
  return <LearningSolutionView />
}

