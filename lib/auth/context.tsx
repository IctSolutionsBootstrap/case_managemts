'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User, AuthState } from './types'
import { authenticateUser, getUserById } from './demo-users'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_STORAGE_KEY = 'cms-auth-user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check for existing session on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUserId) {
      const user = getUserById(storedUserId)
      if (user && user.isActive) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        return
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = authenticateUser(email, password)
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated. Contact administrator.' }
    }

    // Store user session
    localStorage.setItem(AUTH_STORAGE_KEY, user.id)
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
