import { Product } from '@/types';

/** Product IDs to show on the landing page (order preserved) */
export const LANDING_PRODUCT_IDS = ['docxpert', 'felloz', 'uncloud'] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'docxpert',
    name: 'DocXpert',
    tagline: 'Document Processing Platform',
    description: 'Transform documents with precision using advanced OCR technology and multilingual translation. Experience seamless results in seconds with 99.8% accuracy.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/products-images%2Fdocxpert.webp?alt=media',
    category: 'Document Processing',
    link: 'https://docxpert.in',
    testimonial: 'This platform offers exceptional value with competitive pricing, accurate OCR, and multilingual translation features.',
    features: [
      'Handwritten Text Recognition',
      'Language Translation (50+ languages)',
      'Document Structure Formatting',
      'PDF OCR'
    ]
  },
  {
    id: 'felloz',
    name: 'Felloz',
    tagline: 'Where work feels like community',
    description: 'A platform that turns work into community. Connect teams, share context, and collaborate in a space designed for how people actually work together.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/products-images%2Fmyfelloz.webp?alt=media',
    category: 'Workplace & Community',
    link: 'https://myfelloz.com',
    testimonial: 'Where work feels like community.',
    features: [
      'Team collaboration',
      'Community-driven workflows',
      'Context sharing',
      'Modern workspace design'
    ]
  },
  {
    id: 'uncloud',
    name: 'UnCloud',
    tagline: 'Free Online Privacy Tools',
    description: 'Your data. Your control. 45+ tools that run 100% in your browser—no uploads, zero tracking, no sign-up. Privacy-first, client-side only.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/products-images%2Funcloudnow.webp?alt=media',
    category: 'Privacy & Security',
    link: 'https://uncloudnow.com',
    testimonial: 'Privacy tooling that feels like product design - not punishment. Everything runs 100% in your browser.',
    features: [
      '45+ tools · 100% client-side',
      'No uploads, zero tracking',
      'PDF, image, text & dev tools',
      'Works offline'
    ]
  }
  // {
  //   id: 'sovereign-ai',
  //   name: 'Sovereign AI',
  //   tagline: 'Air-Gapped AI Infrastructure',
  //   description: 'Deploy powerful AI models within your national boundaries. Our air-gapped ready infrastructure ensures complete data sovereignty while delivering enterprise-grade AI capabilities.',
  //   imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  //   category: 'AI Infrastructure',
  //   link: '/products/sovereign-ai',
  //   testimonial: 'Sovereign AI has transformed how we handle sensitive government data while maintaining cutting-edge AI capabilities.',
  //   features: [
  //     'Air-Gapped Deployment',
  //     'On-Premise LLM Support',
  //     'Multi-Language AI Models',
  //     'Government-Grade Security',
  //     'Real-Time Inference',
  //     'Custom Model Training'
  //   ]
  // },
  // {
  //   id: 'national-lms',
  //   name: 'National LMS',
  //   tagline: 'Nation-Wide Learning Platform',
  //   description: 'Scalable learning management system architected for millions of concurrent users. Built for government skilling missions with 99.99% uptime guarantee.',
  //   imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  //   category: 'Education Technology',
  //   link: '/products/national-lms',
  //   testimonial: 'The platform seamlessly handles our national skilling mission with over 2 million active learners daily.',
  //   features: [
  //     '100k+ Concurrent Users',
  //     'Multi-Tenant Architecture',
  //     'Regional Language Support',
  //     'Cert-In Audited',
  //     'Mobile PWA Ready',
  //     'Advanced Analytics Dashboard'
  //   ]
  // },
  // {
  //   id: 'citizen-portal',
  //   name: 'Citizen Portal',
  //   tagline: 'Unified Government Services',
  //   description: 'Single sign-on platform that unifies all government services into one seamless citizen journey. Built with zero-trust architecture and GDPR compliance.',
  //   imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  //   category: 'Government Services',
  //   link: '/products/citizen-portal',
  //   testimonial: 'Citizen Portal has reduced service delivery time by 70% and increased citizen satisfaction significantly.',
  //   features: [
  //     'Unified SSO',
  //     'Zero Trust Architecture',
  //     'NIC Integration',
  //     'DigiLocker Support',
  //     'Multi-Language Interface',
  //     'Real-Time Status Tracking'
  //   ]
  // },
  // {
  //   id: 'data-sovereignty',
  //   name: 'Data Sovereignty Suite',
  //   tagline: 'Sovereign Data Management',
  //   description: 'Complete data management platform ensuring all citizen data remains within national boundaries. Features advanced encryption, compliance monitoring, and audit trails.',
  //   imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  //   category: 'Data Management',
  //   link: '/products/data-sovereignty',
  //   testimonial: 'Finally, a solution that gives us complete control over our data while maintaining global standards.',
  //   features: [
  //     'End-to-End Encryption',
  //     'GDPR Compliance',
  //     'Automated Compliance Monitoring',
  //     'Comprehensive Audit Trails',
  //     'Data Residency Controls',
  //     'Backup & Disaster Recovery'
  //   ]
  // },
  // {
  //   id: 'ai-governance',
  //   name: 'AI Governance Platform',
  //   tagline: 'Ethical AI Deployment',
  //   description: 'Comprehensive platform for deploying, monitoring, and governing AI systems in government contexts. Ensures transparency, fairness, and accountability.',
  //   imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  //   category: 'AI Governance',
  //   link: '/products/ai-governance',
  //   testimonial: 'AI Governance Platform helps us maintain ethical standards while scaling our AI initiatives.',
  //   features: [
  //     'Bias Detection & Mitigation',
  //     'Model Explainability',
  //     'Performance Monitoring',
  //     'Compliance Automation',
  //     'Risk Assessment Tools',
  //     'Transparency Reporting'
  //   ]
  // }
];

