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

const ADMIN_PASSWORD = "intel@2025";

const StatCard: React.FC<{ 
  title: string; 
  count: number; 
  trend: string;
  onClick: () => void;
}> = ({ title, count, trend, onClick }) => (
  <div className="group relative cursor-pointer" onClick={onClick}>
    {/* Animated Border Gradient on Hover */}
    <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/50 to-amber-500/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative bg-obsidian-950/40 backdrop-blur-3xl border border-white/5 p-10 rounded-2xl h-64 flex flex-col justify-between overflow-hidden hover:border-accent/20 transition-all duration-500">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Live</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            {trend}
          </span>
        </div>
        <h3 className="text-white font-display font-bold text-lg leading-tight tracking-tight max-w-[200px] group-hover:text-accent transition-colors">
          {title}
        </h3>
      </div>

      <div className="relative z-10 flex flex-col items-end">
        <span className="text-slate-500 text-[9px] font-black uppercase tracking-ultra mb-2">
          Registered Users
        </span>
        <div className="flex items-baseline space-x-1">
          <span className="text-white font-display font-black text-4xl tracking-tighter group-hover:scale-105 transition-transform origin-right duration-500">
            {count.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700"></div>
    </div>
  </div>
);

const IntelView: React.FC = () => {
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
    const storedAuth = localStorage.getItem('intel-dashboard-auth');
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
            "https://getallusersfromintel-detxk7y6rq-uc.a.run.app"
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
      localStorage.setItem('intel-dashboard-auth', 'authenticated');
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

  const getTrend = (users: number): string => {
    // Simple trend logic - can be enhanced with actual trend data
    if (users > 1000000) return "Scale Phase";
    if (users > 100000) return "+24% Growth";
    if (users > 10000) return "+12% Growth";
    if (users > 1000) return "+5% Growth";
    if (users > 100) return "Stable";
    return "Active";
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden selection:bg-accent selection:text-white">
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
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] translate-y-1/2"></div>
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Only show main content if authenticated or checking auth is complete */}
      {(!checkingAuth && isAuthenticated) && (
        <div className="container mx-auto px-8 lg:px-20 relative z-10 pt-40 pb-40">
        {/* Top Header Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12 border-b border-white/5 pb-12">
          {/* Intel Branding */}
          <div className="flex items-center space-x-6 group">
            <Image
              src="/intel-logo.png"
              alt="Intel Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,104,181,0.5)]"
            />
            <div className="h-10 w-[1px] bg-white/10"></div>
            <Image
              src="/WhiteVersion-vl-logo.png"
              alt="Version Labs Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Sync Stats */}
          <div className="flex items-center space-x-12">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-ultra text-slate-500 mb-1">Last Update</span>
              <span className="text-white font-mono text-sm uppercase">Just Now</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-ultra text-slate-500 mb-1">Deployment Status</span>
              <div className="flex items-center space-x-2">
                <span className="text-accent font-black text-xs uppercase tracking-ultra">Syncing Global Data</span>
                <div className="w-2 h-2 rounded-full bg-accent animate-ping"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Title Section */}
        <div className="mb-20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-px bg-accent"></div>
            <span className="text-accent text-[11px] font-black uppercase tracking-ultra">Enterprise Mission Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-8 max-w-4xl">
            Intel Live <span className="text-accent italic font-light">Infrastructure.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl text-balance">
            Real-time citizen engagement monitoring across all sovereign AI and learning platforms deployed in partnership with Intel.
          </p>
        </div>

        {/* Loading State */}
        {loading && isAuthenticated && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && isAuthenticated && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 font-sans">{error}</p>
          </div>
        )}

        {/* Metric Grid */}
        {!loading && !error && isAuthenticated && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <StatCard 
                key={project.name} 
                title={project.name} 
                count={project.users}
                trend={getTrend(project.users)}
                onClick={() => handleCardClick(project)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && isAuthenticated && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl font-light">No projects found.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <Link 
            href="/"
            className="flex items-center space-x-4 text-slate-500 hover:text-white transition-all group"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-ultra">Back to Command Hub</span>
          </Link>

          <div className="flex items-center space-x-8">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-ultra text-slate-500">Security Protocol</p>
              <p className="text-white text-xs font-bold tracking-tight">E2E ENCRYPTED STREAM</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
               </svg>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Extreme Background Text */}
      <div className="absolute top-0 right-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[30vw] font-display font-black text-white leading-none -mt-[5vw] whitespace-nowrap tracking-tighter uppercase translate-x-1/4">
          INTEL
        </h2>
      </div>

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
    </div>
  );
};

export default IntelView;
