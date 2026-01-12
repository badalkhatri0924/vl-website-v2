import { BlogPost } from '@/types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "The Case for Sovereign AI: Why Nations are Building Their Own Intelligence.",
    excerpt: "In an era of data dominance, nations are recognizing that true digital autonomy requires owning the underlying intelligence models that serve their citizens.",
    content: "Full content would be a long-form article about sovereign AI architecture, data localization, and the shift from global LLMs to localized, fine-tuned models for national languages...",
    author: {
      name: "Chirag Gupta",
      title: "Chief Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    date: "MAR 12, 2024",
    category: "Sovereign AI",
    readTime: "8 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "b2",
    title: "Architecting National-Scale LMS: Lessons from 10 Million Concurrent Learners.",
    excerpt: "Scaling a digital learning platform for a nation isn't just a technical challenge—it's a massive demographic and logistical mission.",
    content: "Details on microservices, high-availability clusters, and regional edge computing for low-latency education...",
    author: {
      name: "Research Team",
      title: "Infrastructure Division",
      avatar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200"
    },
    date: "FEB 24, 2024",
    category: "LMS Scaling",
    readTime: "12 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "b3",
    title: "Inclusive by Design: Reimagining Citizen UX for Diverse Demographics.",
    excerpt: "Why the public sector requires a different UI/UX playbook, focused on accessibility, multi-language support, and low-bandwidth resilience.",
    content: "Discussion on WCAG 2.1, GIGW compliance, and ethnographic design principles...",
    author: {
      name: "Linh Nguyen",
      title: "Head of Product Design",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    date: "JAN 15, 2024",
    category: "Product Design",
    readTime: "6 MIN READ",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"
  }
];

