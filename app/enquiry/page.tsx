import EnquiryView from '@/components/EnquiryView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Consult with Digital Infrastructure Architects',
  description: 'Schedule a consultation with Version Labs for your national LMS, government portal, or enterprise digital transformation project. Expert architects ready to support your mission.',
  openGraph: {
    title: 'Contact Us | Consult with Digital Infrastructure Architects',
    description: 'Schedule a consultation with Version Labs for your national LMS, government portal, or enterprise digital transformation project.',
    url: 'https://versionlabs.co/enquiry',
  },
}

export default function EnquiryPage() {
  return <EnquiryView />
}

