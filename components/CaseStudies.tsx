'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const PROJECTS = [
  {
    id: "india",
    region: "India",
    flag: "🇮🇳",
    type: "Learning Platform",
    title: "AI for All – India",
    subtitle: "Hon. Prime Minister",
    desc: "Our LMS platform powers this massive government initiative, delivering AI education to millions through scalable, multi-language learning experiences backed by real-time analytics.",
    metrics: [
      { label: "Learners Onboarded", value: "4.3M" },
      { label: "Indian Languages", value: "11" }
    ],
    tags: ["NEP 2020 Aligned", "Multi-tenant", "Sovereign AI"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://ai-for-all.in",
  },
  {
    id: "ai-impact-pledge",
    region: "India",
    flag: "🇮🇳",
    type: "National Initiative",
    title: "AI Impact Pledge",
    subtitle: "IndiaAI, Govt. of India",
    desc: "The AI Impact Pledge is a nationwide initiative encouraging organisations to adopt responsible and ethical AI practices that align with India's vision for safe, inclusive, and transparent AI deployment.",
    metrics: [
      { label: "Registered Users", value: "2.8M+" },
      { label: "Badge Earned", value: "2.5M+" }
    ],
    tags: ["Responsible AI", "Ethical AI", "IndiaAI"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/project-thumbnail%2Faipledge.webp?alt=media",
    projectLink: "https://aipledge.indiaai.gov.in/",
  },
  {
    id: "g20",
    region: "Global Initiative",
    flag: "🌍",
    type: "Learning Platform",
    title: "TechEquity – G20 Empower",
    subtitle: "Smt. Smriti Zubin Irani",
    desc: "Our learning platform enables this global initiative to bridge the gender digital divide, providing intelligent course recommendations and gamified learning at international scale.",
    metrics: [
      { label: "Women Impacted", value: "2.0M" },
      { label: "Expert-led Courses", value: "95+" }
    ],
    tags: ["Global Scale", "Gamified", "Impact Analytics"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://techequity.g20empower.com/",
  },
  {
    id: "malaysia",
    region: "Malaysia",
    flag: "🇲🇾",
    type: "Learning Platform",
    title: "AI Untuk Rakyat – Malaysia",
    subtitle: "Malaysian Prime Minister",
    desc: "Our enterprise LMS technology drives Malaysia's national AI education strategy, supporting multi-language delivery and integrated analytics with the National AI Office.",
    metrics: [
      { label: "Target Malaysians", value: "1.3M" },
      { label: "Languages", value: "4" }
    ],
    tags: ["National AI Strategy", "MyDigital ID", "Scalable"],
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://aiur.ai.gov.my/",
  },
  {
    id: "niti-aayog",
    region: "India",
    flag: "🇮🇳",
    type: "Government Initiative",
    title: "AI for All – Entrepreneurship India",
    subtitle: "AIM, NITI Aayog",
    desc: "Atal Innovation Mission (AIM), NITI Aayog is the Government of India's flagship initiative to promote a culture of innovation and entrepreneurship across the country. AIM fosters a problem-solving mindset in schools and nurtures a strong entrepreneurial ecosystem among youth.",
    metrics: [
      { label: "Registered Users", value: "119.7K" },
      { label: "Indian Languages", value: "23" }
    ],
    tags: ["NITI Aayog", "Digital India", "Entrepreneurship"],
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://atl-entrepreneurship.digitalreadiness.org/",
  },
  {
    id: "vietnam-nic",
    region: "Vietnam",
    flag: "🇻🇳",
    type: "National Program",
    title: "AI for All – Vietnam",
    subtitle: "NIC, Vietnam & Intel",
    desc: "AI for All is a self-learning program (based on Intel® AI for Citizens) designed to raise public awareness about Artificial Intelligence (AI). This initiative was rolled out by the National Innovation Center (NIC) under the Ministry of Finance, Vietnam, in collaboration with Intel Vietnam, with support from the Posts and Telecommunications Institute of Technology (PTIT).",
    metrics: [
      { label: "Registered Users", value: "18.9K" },
      { label: "Intel® AI Support", value: "Yes" }
    ],
    tags: ["NIC Vietnam", "Intel", "Digital Mindset"],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://ai-intel.nic.gov.vn/",
  },
  {
    id: "odisha-state",
    region: "Odisha, India",
    flag: "🇮🇳",
    type: "State Initiative",
    title: "AI for All – Odisha",
    subtitle: "Govt. of Odisha",
    desc: "Odisha for AI' is a self-learning online program designed to raise public awareness about Artificial Intelligence. It aims to demystify AI for people from all walks of life-students, stay-at-home parents, professionals from any field, senior citizens, and anyone interested in AI who wants to build a digital-first mindset.",
    metrics: [
      { label: "Registered Users", value: "4146" },
      { label: "Indian Languages", value: "2" }
    ],
    tags: ["Digital Odisha", "Inclusive AI", "Skill Development"],
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1000",
    projectLink: "https://ai.odisha.gov.in/",
  },
  {
    id: "gujarat-state",
    region: "Gujarat, India",
    flag: "🇮🇳",
    type: "State Initiative",
    title: "AI for All – Gujarat",
    subtitle: "Govt. of Gujarat",
    desc: "AI for All is a self-learning online program developed by Samagra Shiksha, the Education Department of Gujarat, and Intel India to raise awareness about artificial intelligence.",
    metrics: [
      { label: "Registered Users", value: "3193" },
      { label: "Indian Languages", value: "2" }
    ],
    tags: ["Digital Gujarat", "FutureSkills", "GujaratStudents"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/project-thumbnail%2Fai-for-all-gujarat.jpeg?alt=media",
    projectLink: "https://ai.gshala.in/",
  },
  {
    id: "uttar-pradesh-state",
    region: "Uttar Pradesh, India",
    flag: "🇮🇳",
    type: "State Initiative",
    title: "AI for All – Uttar Pradesh",
    subtitle: "Govt. of Uttar Pradesh",
    desc: "AI for All is a self-learning online program developed by Samagra Shiksha, the Education Department of Uttar Pradesh, and Intel India to raise awareness about artificial intelligence.",
    metrics: [
      { label: "Registered Users", value: "1446" },
      { label: "Indian Languages", value: "2" }
    ],
    tags: ["Digital Uttar Pradesh", "FutureSkills", "Uttar PradeshStudents"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/project-thumbnail%2Fai-for-all-up.webp?alt=media",
    projectLink: "https://aipragya.ai-for-all.in/",
  },
  {
    id: "ai-for-space",
    region: "India",
    flag: "🇮🇳",
    type: "Government Initiative",
    title: "AI For Space",
    subtitle: "ISRO, NITI Aayog, Intel",
    desc: "Artificial Intelligence (AI) is emerging as a game-changer in how we explore, understand, and utilize outer space. From planning complex missions to monitoring astronaut health and tracking space debris, AI is revolutionizing the future of space science and exploration.",
    metrics: [
      { label: "Registered Users", value: "379" },
      { label: "Indian Languages", value: "23" }
    ],
    tags: ["Space Technology", "Space Education", "Space Awareness"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/project-thumbnail%2Fai-for-space.webp?alt=media",
    projectLink: "https://ai-for-space.digitalreadiness.org/",
  },
  {
    id: "ai-for-accessibility",
    region: "India",
    flag: "🇮🇳",
    type: "Foundation Initiative",
    title: "AI For Accessibility",
    subtitle: "Changelnkk Foundation, Intel",
    desc: "AI for Accessibility - a short, self-paced microlearning module that explores how Artificial Intelligence (AI) can enhance accessibility and inclusion. You will discover how AI solutions can help remove barriers, improve independence, and create inclusive experiences that benefit everyone.",
    metrics: [
      { label: "Registered Users", value: "16" },
      { label: "Indian Languages", value: "23" }
    ],
    tags: ["Accessibility", "Inclusion", "AI for Accessibility"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/project-thumbnail%2Fai-for-accessibility.webp?alt=media",
    projectLink: "https://ai4accessibility.digitalreadiness.org/",
  },
];

interface CountUpProps {
  value: string;
  duration?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState<string>("0");
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const match = value.match(/(\d+\.?\d*)(.*)/);
    if (!match) {
      setCount(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = (easedProgress * target).toFixed(target % 1 === 0 ? 0 : 1);

      setCount(`${currentVal}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, value, duration]);

  return <div ref={elementRef}>{count}</div>;
};

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const [hasAppeared, setHasAppeared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAppeared(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white border border-slate-200 transition-all duration-500 overflow-hidden shadow-none group transform ${hasAppeared ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${project.projectLink ? 'hover:border-accent/40 hover:shadow-lg' : ''}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Content Side */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between relative z-10 bg-white">
          <div>
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-xl">{project.flag}</span>
              <span className="text-base font-black uppercase tracking-ultra text-slate-400">{project.region}</span>
              <span className="w-px h-3 bg-slate-200"></span>
              <span className="text-base font-black uppercase tracking-ultra text-accent">{project.type}</span>
            </div>

            <h4 className="text-4xl font-display font-black text-obsidian-900 mb-6 tracking-tight text-balance">
              {project.title}
            </h4>

            {/* Subtitle marker */}
            <div className="flex items-center space-x-3 mb-4 group/lead">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/5 border border-accent/20 text-accent transition-transform group-hover/lead:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l.395.07c1.33.237 2.45 1.054 3.128 2.174A2 2 0 0116 8.5V11l1.293 1.293A1 1 0 0018 13v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011.707-.707L5 11V8.5a2 2 0 01.477-1.933c.678-1.12 1.798-1.937 3.128-2.174L9 4.323V3a1 1 0 011-1zM8 16a2 2 0 004 0H8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-accent/60 leading-none mb-1">Inaugurated By</span>
                <span className="text-base font-black uppercase tracking-ultra text-obsidian-900 border-b border-accent/40 pb-0.5 inline-block transition-colors group-hover/lead:text-accent">
                  {project.subtitle}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-4 max-w-xl font-light">
              {project.desc}
            </p>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 pt-10 border-t border-slate-100">
            <div className="flex gap-12">
              {project.metrics.map((m: any, i: number) => (
                <div key={i}>
                  <div className="text-3xl font-display font-black text-obsidian-900 mb-1">
                    <CountUp value={m.value} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-ultra text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>

            {/* <div className="flex flex-row flex-wrap gap-3">
              {project.tags.map((tag: string) => (
                <div 
                  key={tag} 
                  className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-0.5 cursor-default"
                >
                  {tag}
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Media Side */}
        <div className="lg:col-span-5 relative min-h-[450px] overflow-hidden bg-slate-100">
          <div className="absolute inset-0">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-accent/30 z-20 group-hover:border-accent group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>
          <div className="absolute bottom-10 left-12 z-20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-sm font-black uppercase tracking-ultra text-obsidian-900 bg-white/95 backdrop-blur px-4 py-1.5 border border-accent/20 shadow-sm">
                Live System Snapshot
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (project.projectLink) {
    return (
      <a
        href={project.projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

// Compact Card Variant for Grid Layout
const CompactProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const [hasAppeared, setHasAppeared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAppeared(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white border border-slate-200 transition-all duration-500 overflow-hidden shadow-none group transform h-full flex flex-col ${hasAppeared ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${project.projectLink ? 'hover:border-accent/40 hover:shadow-lg' : ''}`}
    >
      {/* Image on Top */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <div className="absolute inset-0">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent z-10"></div>
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{project.flag}</span>
            <span className="text-xs font-black uppercase tracking-ultra text-slate-600 bg-white/95 backdrop-blur px-3 py-1 border border-slate-200">
              {project.region}
            </span>
          </div>
        </div>
      </div>

      {/* Content Below */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="text-xs font-black uppercase tracking-ultra text-accent mb-2 inline-block">{project.type}</span>
          <h4 className="text-2xl font-display font-black text-obsidian-900 mb-3 tracking-tight leading-tight">
            {project.title}
          </h4>
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l.395.07c1.33.237 2.45 1.054 3.128 2.174A2 2 0 0116 8.5V11l1.293 1.293A1 1 0 0018 13v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011.707-.707L5 11V8.5a2 2 0 01.477-1.933c.678-1.12 1.798-1.937 3.128-2.174L9 4.323V3a1 1 0 011-1zM8 16a2 2 0 004 0H8z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-black uppercase tracking-ultra text-obsidian-900">
              {project.subtitle}
            </span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4 font-light line-clamp-3">
            {project.desc}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex gap-6">
            {project.metrics.map((m: any, i: number) => (
              <div key={i}>
                <div className="text-2xl font-display font-black text-obsidian-900 mb-1">
                  <CountUp value={m.value} />
                </div>
                <div className="text-xs font-black uppercase tracking-ultra text-slate-400">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (project.projectLink) {
    return (
      <a
        href={project.projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

const CaseStudies: React.FC = () => {
  const featuredProjects = PROJECTS.slice(0, 4);

  // Partners data with Logo Images from public folder
  const partners = [
    {
      name: "Intel",
      logo: (
        <Image
          src="/intel-logo.svg"
          alt="Intel Logo"
          width={150}
          height={50}
          className="object-contain"
        />
      )
    },

    {
      name: "Ministry of Digial Malaysia",
      logo: (
        <Image
          src="/ministry-of-digital-malaysia-logo.png"
          alt="Ministry of Digial Malaysia Logo"
          width={90}
          height={50}
          className="object-contain"
        />
      )
    },
    {
      name: "NIC",
      logo: (
        <Image
          src="/nic-logo.jpeg"
          alt="NIC Logo"
          width={140}
          height={50}
          className="object-contain"
        />
      )
    },
    {
      name: "FICCI",
      logo: (
        <Image
          src="/ficci-logo.png"
          alt="FICCI Logo"
          width={90}
          height={50}
          className="object-contain"
        />
      )
    },
    {
      name: "Digital India",
      logo: (
        <Image
          src="/digital-india-logo.png"
          alt="Digital India Logo"
          width={150}
          height={50}
          className="object-contain"
        />
      )
    },
    {
      name: "Dell",
      logo: (
        <Image
          src="/dell-logo.png"
          alt="Dell Logo"
          width={90}
          height={50}
          className="object-contain"
        />
      )
    }
  ];

  return (
    <section id="cases" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16">
          <h3 className="text-4xl md:text-6xl font-display font-black text-obsidian-900 leading-tight tracking-tighter max-w-5xl">
            Defining the Future of <br />
            <span className="text-accent italic">Digital Sovereignty</span>.
          </h3>
        </div>

        {/* Project Cards - Stacked Vertically (One by One) */}
        <div className="space-y-8 mb-20">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View More Button */}
        <div className="flex flex-col items-center mb-40">
          <Link href="/portfolio" className="px-12 py-6 bg-white border border-slate-200 text-obsidian-900 text-sm font-black uppercase tracking-ultra hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 flex items-center space-x-4 group shadow-sm">
            <span>View More Projects</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Strategic Alliances Section - MATCHING SCREENSHOT EXACTLY */}
        <div className="pt-20 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <div className="max-w-md">
              {/* <h4 className="text-accent text-sm font-black uppercase tracking-[0.25em] mb-4">STRATEGIC ALLIANCES</h4> */}
              <p className="text-4xl md:text-5xl font-display font-bold text-obsidian-950 tracking-tight">Trust In High Places.</p>
            </div>
            <div className="md:text-right pt-2">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.35em] leading-[1.6] opacity-70">
                Leading Technology Service Provider
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-slate-100 bg-[#F9FBFC] overflow-hidden">
            {partners.map((partner, i) => (
              <div
                key={i}
                className={`h-56 flex flex-col items-center justify-center group hover:bg-white transition-all duration-700 cursor-default relative ${i !== partners.length - 1 ? 'lg:border-r border-slate-100' : ''
                  } border-slate-100 border-b md:border-b-0`}
              >
                {/* Logo Representation - Centered */}
                <div className="text-obsidian-900 transition-all duration-700 group-hover:scale-105">
                  {partner.logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;