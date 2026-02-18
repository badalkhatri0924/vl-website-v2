import { Product } from '@/types';

/** Product IDs to show on the landing page (order preserved) - 4 cards in 2×2 grid */
export const LANDING_PRODUCT_IDS = ['docxpert', 'felloz', 'uncloud', 'clef'] as const;

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
    ],
    stats: [
      { label: 'OCR accuracy', value: '99.8%' },
      { label: 'Languages supported', value: '50+' },
      { label: 'Compliance', value: 'GDPR compliant' }
    ],
    featureDetails: [
      {
        title: 'Handwritten Text Recognition',
        description: "DocXpert's advanced recognition technology identifies handwritten text with impressive accuracy. Get instant readability from paper documents."
      },
      {
        title: 'Language Translation',
        description: 'Supported by 50+ languages, DocXpert translates documents accurately with perfect formatting preserved.'
      },
      {
        title: 'Document Structure Formatting',
        description: "Explore structure formatting for tables, bullets, and professional layouts with perfect preservation."
      },
      {
        title: 'PDF OCR',
        description: "Advanced OCR technology transforms PDF documents for easy editing, searching, and copying with perfect accuracy."
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Upload Document',
        description: 'Easily upload PDFs, images, or scanned documents through our intuitive drag-and-drop interface.'
      },
      {
        step: 2,
        title: 'Configure Options',
        description: 'Select recognition type, language, output format, and advanced processing settings to suit your needs.'
      },
      {
        step: 3,
        title: 'Process & Download',
        description: 'Our AI engine processes your document and delivers results in seconds, ready for download or sharing.'
      }
    ],
    technicalSpecs: [
      { category: 'Security', value: 'Enterprise-Grade' },
      { category: 'Uptime', value: '99.99% SLA' },
      { category: 'Compliance', value: 'GDPR Ready' }
    ],
    industrySolutions: [
      {
        title: 'Enterprise Document Management',
        description: 'Centralize corporate documents with smart categorization, searchability, and access controls to improve operational efficiency.'
      },
      {
        title: 'Financial Services',
        description: 'Process loan applications, financial statements, and compliance documents with high accuracy and enhanced security protocols.'
      },
      {
        title: 'Healthcare Records',
        description: 'Digitize patient records, insurance claims, and medical documents while maintaining HIPAA compliance and data privacy.'
      },
      {
        title: 'Educational Institutions',
        description: 'Manage student records, transcripts, and research papers with efficient organization and retrieval capabilities.'
      },
      {
        title: 'Legal Document Analysis',
        description: 'Extract critical information from contracts, court filings, and legal correspondence with advanced OCR and AI analysis.'
      }
    ],
    testimonials: [
      {
        quote: 'This platform offers exceptional value with competitive pricing, accurate OCR for converting PDFs, and multilingual translation features. It saves me hours of manual work and streamlines complex legal analysis. I highly recommend it to professionals seeking efficiency and modern solutions.',
        author: 'Chitrajeet Upadhyaya',
        role: 'Founder & Managing Partner | HRU Legal'
      },
      {
        quote: 'DocXpert has made my filing process effortless with its instant typing, translation, and accurate document conversion across multiple languages. It is user-friendly, cost-effective, and a real time saver, making it an essential tool for legal professionals.',
        author: 'Ms. Vilas A Purani',
        role: 'Advocate | Gujarat High Court & Central Administrative Tribunal'
      }
    ],
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, debit cards, and net banking. Enterprise customers can also pay via invoice.'
      },
      {
        question: 'How does the pricing work for teams?',
        answer: 'Team plans are based on the number of users and document volume. Contact us for a custom quote tailored to your organization.'
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes. We use enterprise-grade encryption, comply with GDPR, and process documents in secure environments. Your data is never shared with third parties.'
      },
      {
        question: 'What languages are supported?',
        answer: 'DocXpert supports 50+ languages for both OCR and translation, including major Indian and international languages.'
      },
      {
        question: 'Do you offer a free trial?',
        answer: 'Yes. You can try DocXpert with a free demo to experience our OCR and translation capabilities before subscribing.'
      }
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
    ],
    stats: [
      { label: 'Teams connected', value: 'Growing' },
      { label: 'Work style', value: 'Community-first' },
      { label: 'Focus', value: 'Real collaboration' }
    ],
    featureDetails: [
      {
        title: 'Team Collaboration',
        description: 'Bring your team into one space. Share updates, decisions, and work in progress so everyone stays aligned without endless meetings.'
      },
      {
        title: 'Community-Driven Workflows',
        description: 'Work the way your team actually works. Create spaces, channels, and rituals that fit your culture—not the other way around.'
      },
      {
        title: 'Context Sharing',
        description: 'Keep context where the work happens. Share the why behind tasks, link discussions to outcomes, and reduce back-and-forth.'
      },
      {
        title: 'Modern Workspace Design',
        description: 'A workspace built for how people work today: async-friendly, mobile-ready, and designed so work feels like community, not obligation.'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Create or Join a Space',
        description: 'Set up a space for your team, project, or community. Invite members and define how you want to work together.'
      },
      {
        step: 2,
        title: 'Share Context & Updates',
        description: 'Post updates, share decisions, and keep everyone in the loop. Context lives next to the work, not lost in email or chat.'
      },
      {
        step: 3,
        title: 'Collaborate in Flow',
        description: 'Discuss, iterate, and ship as a community. Felloz keeps work visible and collaborative so nothing falls through the cracks.'
      }
    ],
    technicalSpecs: [
      { category: 'Security', value: 'Secure & Private' },
      { category: 'Availability', value: 'Always On' },
      { category: 'Design', value: 'Community-First' }
    ],
    industrySolutions: [
      {
        title: 'Remote & Distributed Teams',
        description: 'Keep remote teams connected with shared context, async updates, and a single place for decisions and outcomes.'
      },
      {
        title: 'Startups & Scale-ups',
        description: 'Scale how you work without losing the culture. Spaces and workflows grow with your team.'
      },
      {
        title: 'Creative & Agency Teams',
        description: 'Align on briefs, feedback, and deliverables in one space. Less email, more clarity.'
      },
      {
        title: 'Communities & Networks',
        description: 'Run communities, cohorts, or networks where members share context and collaborate on shared goals.'
      },
      {
        title: 'Education & Learning Groups',
        description: 'Course teams, study groups, and learning communities in a space built for collaboration and context.'
      }
    ],
    testimonials: [
      {
        quote: 'Where work feels like community. Felloz finally gives us one place to share context and collaborate the way we actually work.',
        author: 'Teams at Felloz',
        role: 'Community-first workplaces'
      }
    ],
    faqs: [
      {
        question: 'How do I invite my team?',
        answer: 'Create a space and invite members by email or link. You can set roles and permissions so everyone has the right access.'
      },
      {
        question: 'Is there a free plan?',
        answer: 'Yes. You can get started with Felloz for free and upgrade as your team or community grows.'
      },
      {
        question: 'Can we use Felloz for async work?',
        answer: 'Absolutely. Felloz is built for async-friendly collaboration—share updates, context, and decisions without requiring everyone online at once.'
      },
      {
        question: 'What makes Felloz different from other tools?',
        answer: 'Felloz is designed so work feels like community. We focus on context sharing, visibility, and workflows that match how people actually work together.'
      }
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
    ],
    stats: [
      { label: 'Tools', value: '45+' },
      { label: 'Processing', value: '100% client-side' },
      { label: 'Sign-up', value: 'None required' }
    ],
    featureDetails: [
      {
        title: 'PDF Tools',
        description: 'Merge, split, compress, rotate, and edit PDFs locally. Convert to and from images, add watermarks or page numbers—all in your browser. Your files never leave your device.'
      },
      {
        title: 'Image & Media Tools',
        description: 'Compress, convert, crop, resize, and remove backgrounds with local AI. Image converter, EXIF viewer, and QR generator—all client-side and private.'
      },
      {
        title: 'Privacy & Security Tools',
        description: 'Secure notes with AES-256 encryption, password generator, and file checksums. Build habits that keep your data under your control.'
      },
      {
        title: 'Text, Data & Developer Tools',
        description: 'CSV/JSON editors, Markdown editor, Base64, URL tools, text diff, and more. Format, validate, and convert—all without sending data to any server.'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Pick a Tool',
        description: 'Browse 45+ tools across PDF, image, text, security, and developer categories. Everything runs in your browser.'
      },
      {
        step: 2,
        title: 'Use It in Your Browser',
        description: 'Open a tool, add your files or input. All processing happens locally—no uploads to our servers.'
      },
      {
        step: 3,
        title: 'Your Data Stays Local',
        description: 'Zero tracking, zero telemetry, zero storage of your data. Download results or copy output—your data never leaves your device.'
      }
    ],
    technicalSpecs: [
      { category: 'Privacy', value: 'Zero telemetry' },
      { category: 'Processing', value: 'Client-side only' },
      { category: 'Data', value: 'Never leaves your device' }
    ],
    industrySolutions: [
      {
        title: 'Privacy-Conscious Users',
        description: 'Anyone who wants to edit PDFs, images, or text without sending files to the cloud. Your data stays in your tab.'
      },
      {
        title: 'Developers & Technical Teams',
        description: 'JSON viewer, Base64, URL tools, checksums, and more. No sign-up, no API keys—just open and use.'
      },
      {
        title: 'Small Business & Freelancers',
        description: 'Professional PDF and image tools without subscriptions or uploads. Use offline when you need to.'
      },
      {
        title: 'Education & Personal Use',
        description: 'Convert files, compress images, generate passwords—all free and private. Great for students and everyday use.'
      }
    ],
    testimonials: [
      {
        quote: 'Privacy tooling that feels like product design - not punishment. Everything runs 100% in your browser, so sensitive data never has to leave your machine.',
        author: 'UnCloud',
        role: 'Local-first privacy toolkit'
      }
    ],
    faqs: [
      {
        question: 'Is UnCloud really free?',
        answer: 'Yes. UnCloud is completely free. All 45+ tools are available at no cost with no hidden fees or premium tiers.'
      },
      {
        question: 'Does UnCloud upload my files to a server?',
        answer: 'No. All processing happens 100% in your browser. Your files never leave your device, ensuring complete privacy and security.'
      },
      {
        question: 'What file formats does UnCloud support?',
        answer: 'UnCloud supports a wide range of formats including images (JPG, PNG, WebP), PDFs, CSV, JSON, and more. All conversions happen locally in your browser.'
      },
      {
        question: 'Can I use UnCloud offline?',
        answer: 'Yes. Once loaded, most tools work offline. UnCloud is designed to work entirely client-side without requiring a constant internet connection.'
      },
      {
        question: 'Is my data tracked or stored?',
        answer: 'No. UnCloud has zero tracking, zero analytics, and zero data collection. Your privacy is our top priority.'
      }
    ]
  },
  {
    id: 'clef',
    name: 'Clef',
    tagline: 'Governed AI for Your Organization',
    description: 'Governed AI that keeps your organization in control. Deploy and scale AI with policy, safety, and compliance built in—so you can innovate with confidence.',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/products-images%2Fuseclef.webp?alt=media',
    category: 'AI Governance',
    link: 'https://useclef.com/',
    testimonial: 'Governed AI for your organization—policy, safety, and compliance built in.',
    features: [
      'Governed AI deployment',
      'Policy and compliance controls',
      'Organization-wide safety',
      'Scale AI with confidence'
    ],
    stats: [
      { label: 'Focus', value: 'Governed AI' },
      { label: 'Control', value: 'Organization-wide' },
      { label: 'Built for', value: 'Enterprise' }
    ],
    featureDetails: [
      {
        title: 'Governed AI Deployment',
        description: 'Deploy AI across your organization with guardrails and policies that keep usage aligned with your standards.'
      },
      {
        title: 'Policy and Compliance',
        description: 'Define and enforce AI policies so every use meets your compliance and risk requirements.'
      },
      {
        title: 'Safety and Control',
        description: 'Keep AI safe and under your control with visibility and governance built in from the start.'
      },
      {
        title: 'Scale with Confidence',
        description: 'Scale AI adoption across teams while maintaining oversight and accountability.'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Define Governance',
        description: 'Set policies and guardrails for how AI is used across your organization.'
      },
      {
        step: 2,
        title: 'Deploy AI',
        description: 'Roll out governed AI tools and models with safety and compliance built in.'
      },
      {
        step: 3,
        title: 'Scale Safely',
        description: 'Grow adoption while maintaining visibility, control, and compliance.'
      }
    ],
    technicalSpecs: [
      { category: 'Governance', value: 'Policy-driven' },
      { category: 'Compliance', value: 'Built-in' },
      { category: 'Safety', value: 'Organization-wide' }
    ],
    industrySolutions: [
      {
        title: 'Enterprise AI',
        description: 'Deploy and scale AI across the organization with governance and compliance in place.'
      },
      {
        title: 'Regulated Industries',
        description: 'Meet regulatory and internal policy requirements while adopting AI.'
      }
    ],
    testimonials: [
      {
        quote: 'Governed AI for your organization—policy, safety, and compliance built in.',
        author: 'Clef',
        role: 'Governed AI platform'
      }
    ],
    faqs: [
      {
        question: 'What is governed AI?',
        answer: 'Governed AI keeps AI use under your organization’s control with policies, safety, and compliance built in.'
      },
      {
        question: 'Who is Clef for?',
        answer: 'Clef is for organizations that want to adopt AI at scale while maintaining oversight, safety, and compliance.'
      }
    ]
  },
  {
    id: 'memry',
    name: 'Memry',
    tagline: 'Save links once. Never forget why they mattered.',
    description:
      'Memry helps you save links once—and never forget why they mattered. Turn fleeting tabs and bookmarks into a searchable, contextual library you actually come back to.',
    imageUrl: 'https://savememry.com/og-image.png',
    category: 'Knowledge Management',
    link: 'https://savememry.com/',
    testimonial: 'Save links once. Never forget why they mattered.',
    features: [
      'Save and organize important links',
      'Add context, notes, and highlights',
      'Searchable personal knowledge base',
      'Collections you actually revisit'
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

