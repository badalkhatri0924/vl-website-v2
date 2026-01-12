# Enterprise Digital Infrastructure Platform

A modern, enterprise-grade website built with Next.js 15 for showcasing digital infrastructure solutions, government platforms, and national-scale learning management systems. This platform features AI-powered content generation, Sanity CMS integration, and comprehensive case study presentations.

## 🚀 Features

### Core Functionality
- **Modern Next.js 15 Architecture** - Built with React 19, TypeScript, and App Router
- **Sanity CMS Integration** - Headless CMS for blog posts and content management
- **AI-Powered Features** - Gemini AI integration for chatbot and content generation
- **Responsive Design** - Fully responsive with Tailwind CSS
- **SEO Optimized** - Comprehensive metadata and Open Graph support
- **Firebase Hosting** - Deployed on Firebase with channel-based deployments

### Key Pages & Sections
- **Home** - Hero section with case studies and features
- **Services** - Detailed service portfolio and capabilities
- **Strategy** - Strategic framework and methodology
- **Portfolio** - Showcase of national-scale projects
- **Blog** - AI-powered blog with Sanity CMS integration
- **Press** - Press releases and media coverage
- **Impact** - Project impact metrics and statistics
- **Enquiry** - Contact and inquiry forms
- **Partnership** - Partnership inquiry portal

### Special Features
- **AI Chatbot** - Virtual liaison powered by Gemini AI
- **Blog Generation** - AI-assisted blog post creation
- **Image Generation** - AI-powered image generation for blog posts
- **Real-time Analytics** - Dashboard for monitoring live projects
- **Multi-language Support** - Designed for international markets

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1.0** - React framework with App Router
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5.8.2** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend & Services
- **Sanity CMS** - Headless content management
- **Google Gemini AI** - AI chatbot and content generation
- **Resend** - Email service for inquiries
- **Firebase Hosting** - Production hosting and deployment

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Firebase CLI** (for deployment)
- **Git** (for version control)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vl-website-local-by-chirag
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   API_KEY=your_gemini_api_key_here
   
   # Sanity CMS Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   
   # Resend Email Configuration
   RESEND_API_KEY=your_resend_api_key
   
   # Unsplash (Optional - for image fallback)
   UNSPLASH_ACCESS_KEY=your_unsplash_key
   
   # Sanity Webhook Secret (for blog revalidation)
   SANITY_REVALIDATE_SECRET=your_secret_token
   ```

4. **Configure Sanity CMS**
   
   Update `sanity.config.ts` with your Sanity project details:
   ```typescript
   projectId: 'your-project-id',
   dataset: 'production',
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
vl-website-local-by-chirag/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── blog/            # Blog API endpoints
│   │   ├── chat/            # Chatbot API
│   │   └── enquiry/         # Contact form API
│   ├── blog/                # Blog pages
│   ├── services/            # Services page
│   ├── strategy/            # Strategy page
│   ├── portfolio/           # Portfolio page
│   └── ...                  # Other pages
├── components/               # React components
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── Hero.tsx             # Hero section
│   ├── CaseStudies.tsx      # Case studies showcase
│   └── ...                  # Other components
├── lib/                      # Utility libraries
│   ├── sanity/              # Sanity CMS utilities
│   └── content/              # Content helpers
├── services/                 # Service modules
│   ├── geminiService.ts     # Gemini AI service
│   └── aiContentService.ts  # AI content generation
├── data/                     # Static data
│   ├── blogPosts.ts         # Blog post data
│   └── products.ts          # Product data
├── sanity/                   # Sanity CMS schemas
│   └── schemas/              # Content schemas
├── public/                   # Static assets
│   ├── images/              # Image assets
│   └── logos/                # Partner logos
└── project-features-guide-doc/ # Documentation
```

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment
```bash
npm run deploy              # Deploy to Firebase production
npm run deploy:develop      # Deploy to Firebase develop channel
npm run develop:list        # List Firebase hosting channels
```

## 🌐 API Routes

### Chat API
- **POST** `/api/chat` - Chatbot endpoint using Gemini AI
  ```json
  {
    "message": "Your message here",
    "history": []
  }
  ```

### Blog API
- **POST** `/api/blog/generate` - Generate blog content with AI
- **POST** `/api/blog/revalidate` - Revalidate blog posts (webhook)

### Enquiry API
- **POST** `/api/enquiry` - Submit contact/inquiry form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "organization": "Company Name",
    "message": "Inquiry message"
  }
  ```

## 📝 Content Management

### Sanity CMS Setup

1. **Install Sanity CLI** (if not already installed)
   ```bash
   npm install -g @sanity/cli
   ```

2. **Login to Sanity**
   ```bash
   sanity login
   ```

3. **Access Sanity Studio**
   - Development: `http://localhost:3000/studio`
   - Production: Configure in `sanity.config.ts`

### Blog Post Management

Blog posts are managed through Sanity CMS. The schema includes:
- Title
- Slug
- Excerpt
- Content (Portable Text)
- Author
- Category
- Featured Image
- Published Date
- Read Time

### Webhook Configuration

For automatic blog revalidation, set up webhooks in Sanity:
- **URL**: `https://your-domain.com/api/blog/revalidate`
- **Secret**: Use `SANITY_REVALIDATE_SECRET` from environment variables

See `SANITY_WEBHOOK_SETUP.md` for detailed instructions.

## 🎨 Styling

The project uses **Tailwind CSS** with custom configuration:
- **Custom Colors**: Defined in `tailwind.config.js`
- **Custom Fonts**: Inter and Manrope from Google Fonts
- **Responsive Breakpoints**: Mobile-first approach
- **Dark Mode**: Supported through CSS variables

### Custom Color Palette
- Primary Accent: Teal/Cyan (`#4FC1C6`)
- Obsidian: Dark gray/black (`#0F172A`)
- Slate: Gray scale colors

## 🚢 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to production**
   ```bash
   npm run deploy
   ```

3. **Deploy to develop channel**
   ```bash
   npm run deploy:develop
   ```

### Environment Variables in Production

Ensure all environment variables are set in your hosting platform:
- Firebase: Use Firebase Functions config or `.env` files
- Vercel: Set in project settings
- Other platforms: Follow their environment variable documentation

## 🔐 Security Considerations

- API keys are stored in environment variables
- Sanity webhook secret for revalidation
- Email validation on contact forms
- CORS configuration for API routes
- Input sanitization for user-generated content

## 📚 Documentation

Additional documentation available:
- `SANITY_WEBHOOK_SETUP.md` - Sanity webhook configuration
- `WEBHOOK_SETUP.md` - General webhook setup
- `GEMINI_IMAGE_GENERATION_GUIDE.md` - AI image generation guide
- `project-features-guide-doc/` - Feature documentation

## 🐛 Troubleshooting

### Common Issues

1. **Sanity Studio not loading**
   - Check `sanity.config.ts` configuration
   - Verify project ID and dataset
   - Ensure API token has correct permissions

2. **Chatbot not responding**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API quota limits
   - Review error logs in browser console

3. **Build errors with React 19**
   - The project includes polyfills for Sanity compatibility
   - Check `lib/polyfills/` for React compatibility fixes

4. **Image optimization issues**
   - Verify image domains in `next.config.js`
   - Check `remotePatterns` configuration
   - Ensure images are accessible via HTTPS

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For issues or questions:
- Check the documentation in `project-features-guide-doc/`
- Review API documentation in respective route files
- Contact the development team

## 🔄 Recent Updates

- Migrated to Next.js 15 with App Router
- Integrated Sanity CMS for content management
- Added AI-powered blog generation
- Implemented Firebase hosting with channel deployments
- Updated all branding references to generic terms

---

**Built with ❤️ using Next.js, React, and TypeScript**
