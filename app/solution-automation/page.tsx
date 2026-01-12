import AutomationSolutionView from '@/components/AutomationSolutionView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI & Process Automation Services | Enterprise Automation Solutions',
  description: 'Streamlining bureaucratic complexity with high-security AI agents and automated workflow orchestrators. Comprehensive AI solutions that streamline complex processes at enterprise scale.',
  openGraph: {
    title: 'AI & Process Automation Services | Enterprise Automation Solutions',
    description: 'Streamlining bureaucratic complexity with high-security AI agents and automated workflow orchestrators. Comprehensive AI solutions for enterprise scale.',
    url: 'https://versionlabs.co/solution-automation',
  },
}

export default function AutomationSolutionPage() {
  return <AutomationSolutionView />
}

