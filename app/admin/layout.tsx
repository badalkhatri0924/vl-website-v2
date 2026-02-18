'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { Avatar } from './blog/Avatar'

const ADMIN_PASSWORD = 'vl@2025'
const ADMIN_AUTH_KEY = 'admin-auth'
const ADMIN_USER_NAME_KEY = 'admin-user-name'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [enteredName, setEnteredName] = useState('')
  const [enteredPassword, setEnteredPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_AUTH_KEY) : null
      if (stored === 'authenticated') {
        setIsAuthenticated(true)
        setShowLoginDialog(false)
      } else {
        setShowLoginDialog(true)
      }
    } catch {
      setShowLoginDialog(true)
    } finally {
      setCheckingAuth(false)
    }
  }, [])

  const handleLogin = () => {
    const name = enteredName.trim()
    if (!name) {
      setLoginError('Name is required.')
      return
    }
    if (!enteredPassword.trim()) {
      setLoginError('Password is required.')
      return
    }
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setShowLoginDialog(false)
      setLoginError('')
      try {
        window.localStorage.setItem(ADMIN_AUTH_KEY, 'authenticated')
        window.localStorage.setItem(ADMIN_USER_NAME_KEY, name)
      } catch {}
    } else {
      setLoginError('Incorrect password. Please try again.')
      setEnteredPassword('')
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-black mb-8">Admin</h1>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar state="thinking" className="w-48 h-48" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-100">Checking admin access…</p>
                <p className="text-xs text-slate-400 max-w-sm">Verifying your secure session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 px-4 md:px-8 flex items-center justify-center">
        <Dialog open={showLoginDialog} onOpenChange={() => {}}>
          <DialogContent className="w-full min-w-[320px] max-w-[400px]" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center justify-center">
                <Lock size={24} className="text-accent" />
                Admin login
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="adminName">Name</Label>
                <Input
                  id="adminName"
                  type="text"
                  value={enteredName}
                  onChange={(e) => setEnteredName(e.target.value)}
                  placeholder="Your name with surname"
                  autoComplete="name"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
              {loginError && <p className="text-sm text-red-400">{loginError}</p>}
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return <>{children}</>
}
