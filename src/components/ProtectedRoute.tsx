'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import AuthDialog from '@/components/AuthDialog'
import { Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('buyer' | 'supplier')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e33f3f] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page. Please sign in or create an account to continue.
          </p>
          <AuthDialog>
            <Button className="w-full mbs-red mbs-red-hover">
              Sign In / Create Account
            </Button>
          </AuthDialog>
        </div>
      </div>
    )
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This page is restricted to {allowedRoles.join(' and ')} accounts only.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
