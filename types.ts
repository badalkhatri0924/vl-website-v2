import React from 'react';

export interface ServiceCardProps {
  title: string;
  items: string[];
  highlights: string[];
  icon: React.ReactNode;
}

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface CaseStudyProps {
  title: string;
  location: string;
  impact: ImpactMetric[];
  services: string[];
  imageUrl: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface PressItem {
  id: string;
  region: string;
  headline: string;
  publisher: string;
  imageUrl: string;
  date: string;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  features: string[];
  category: string;
  link?: string;
  testimonial?: string;
}