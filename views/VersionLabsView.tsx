'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Copy, Check, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Project {
  name: string;
  users: number;
  projectUrl: string;
  admin?: {
    url: string;
    password: string | null;
  };
}

interface ApiProject {
  name: string;
  count: number;
  projectUrl: string;
  admin?: {
    url: string;
    password: string | null;
  };
}

const ADMIN_PASSWORD = "vl@2025";

const ProjectStatCard: React.FC<{ 
  title: string; 
  count: number; 
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ title, count, onClick, icon }) => (
  <div className="group relative cursor-pointer" onClick={onClick}>
    {/* Glow Effect */}
    <div className="absolute -inset-[1px] bg-gradient-to-r from-accent to-blue-400 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative bg-obsidian-950/60 backdrop-blur-3xl border border-white/5 p-12 rounded-2xl h-[340px] flex flex-col justify-between overflow-hidden hover:border-accent/20 transition-all duration-500">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-ultra text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">
            Live
          </span>
        </div>
        
        <h3 className="text-white font-display font-black text-2xl mb-3 tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h3>
      </div>

      <div className="relative z-10">
        <div className="h-px w-full bg-white/5 mb-6"></div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] font-black uppercase tracking-ultra mb-2">
            Total Active Registered Users
          </span>
          <span className="text-white font-display font-black text-5xl tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
            {count.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const VersionLabsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Check authentication status from localStorage
    const storedAuth = localStorage.getItem('versionlabs-dashboard-auth');
    if (storedAuth === 'authenticated') {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
    } else {
      setShowLoginDialog(true);
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
          const res = await fetch(
            "https://getallusersfromversionlabs-detxk7y6rq-uc.a.run.app"
          );

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();

          const projectsArray: Project[] = data.data.map((item: ApiProject) => ({
            name: item.name,
            users: item.count,
            projectUrl: item.projectUrl,
            admin: item.admin,
          }));

          setProjects(projectsArray);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch projects";
          console.error("Error fetching projects:", message);
          setError(message);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (!enteredPassword.trim()) {
      setLoginError("Password is required.");
      return;
    }

    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      setLoginError("");
      localStorage.setItem('versionlabs-dashboard-auth', 'authenticated');
    } else {
      setLoginError("Incorrect password. Please try again.");
      setEnteredPassword("");
    }
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
    setCopiedPassword(false);
  };

  const handleGoToAdmin = () => {
    if (selectedProject?.admin?.url) {
      window.open(selectedProject.admin.url, "_blank");
    }
  };

  const handleCopyPassword = async () => {
    if (selectedProject?.admin?.password) {
      try {
        await navigator.clipboard.writeText(selectedProject.admin.password);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      } catch (err) {
        console.error("Failed to copy password:", err);
      }
    }
  };

  const getProjectIcon = (projectName: string) => {
    const name = projectName.toLowerCase();
    if (name.includes('doc') || name.includes('document')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (name.includes('tech') || name.includes('equity') || name.includes('learning')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Login Dialog - Only show after checking auth and if not authenticated */}
      {!checkingAuth && (
        <Dialog open={showLoginDialog} onOpenChange={() => {}} closeOnClickOutside={false}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center justify-center">
              <Lock size={24} className="text-accent" />
              <span>Enter Password</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-400 font-sans">{loginError}</p>
            )}

            <Button
              onClick={handleLogin}
              className="w-full"
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}

      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Only show main content if authenticated or checking auth is complete */}
      {(!checkingAuth && isAuthenticated) && (
        <div className="container mx-auto px-8 lg:px-24 relative z-10 pt-48 pb-40">
          {/* Dynamic Header Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-32 border-b border-white/5 pb-16">
            <Link 
              href="/"
              className="flex items-center cursor-pointer group"
            >
              <Image
                src="/WhiteVersion-vl-logo.png"
                alt="Version Labs Logo"
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center space-x-12 mt-10 md:mt-0">
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-ultra text-slate-500 block mb-1">Global System Load</span>
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-mono text-sm">OPTIMAL [0.04ms]</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10"></div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-ultra text-slate-500 block mb-1">Active Instances</span>
                <span className="text-white font-display font-bold">{projects.length} Projects</span>
              </div>
            </div>
          </div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-[2px] bg-accent"></div>
            <span className="text-accent text-[11px] font-black uppercase tracking-ultra">Proprietary Core Dashboard</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter mb-10 leading-[0.9]">
            Sovereign <br />
            <span className="text-accent italic font-light">Implementations.</span>
          </h1>
          <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl text-balance">
            Real-time aggregate monitoring of VersionLabs' proprietary digital assets and citizen engagement infrastructure.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 font-sans">{error}</p>
          </div>
        )}

        {/* Project Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectStatCard 
                key={project.name} 
                title={project.name} 
                count={project.users}
                onClick={() => handleCardClick(project)}
                icon={getProjectIcon(project.name)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl font-light">No projects found.</p>
          </div>
        )}

        {/* Return Action */}
        <div className="mt-32 flex flex-col items-center">
          <Link 
            href="/"
            className="group px-12 py-6 bg-transparent border border-white/10 text-white text-[11px] font-black uppercase tracking-ultra hover:bg-white hover:text-obsidian-900 transition-all duration-500 flex items-center space-x-6"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Exit Dashboard</span>
          </Link>
        </div>
      </div>
      )}

      {/* Project Detail Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="max-w-md" showCloseButton={true} onClose={handleCloseDialog}>
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-ultra mb-2">Registered Users</p>
              <p className="text-white font-display font-black text-5xl tracking-tighter">
                {selectedProject?.users.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 flex flex-col">
              <Button
                onClick={handleGoToAdmin}
                disabled={!selectedProject?.admin?.url}
                variant="primary"
                className="w-full"
              >
                <ExternalLink size={18} />
                Go to Admin
              </Button>

              {selectedProject?.admin?.password && (
                <Button
                  onClick={handleCopyPassword}
                  variant="primary"
                  className="w-full"
                >
                  {copiedPassword ? (
                    <>
                      <Check size={18} />
                      Password Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy Password
                    </>
                  )}
                </Button>
              )}

              {selectedProject?.admin && !selectedProject.admin.password && selectedProject.admin.url && (
                <p className="text-sm text-slate-500 text-center py-2 font-sans">
                  No admin password needed for this project. Admin and super admin can access.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(selectedProject?.projectUrl, "_blank")
                }
                className="w-full justify-center"
              >
                Visit Project Site
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decorative Background Labels */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-between px-20 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[20vw] font-display font-black text-white uppercase tracking-tighter">VL</span>
        <span className="text-[20vw] font-display font-black text-white uppercase tracking-tighter">LIVE</span>
      </div>
    </div>
  );
};

export default VersionLabsView;
