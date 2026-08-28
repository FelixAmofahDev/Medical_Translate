import { useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setState({ user, loading: false, error: null })
      },
      (error) => {
        setState({ user: null, loading: false, error: error.message })
      }
    )
    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, error: null }))
    const auth = getFirebaseAuth()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setState((prev) => ({ ...prev, error: message }))
      throw error
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null }))
    const auth = getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed'
      setState((prev) => ({ ...prev, error: message }))
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth()
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed'
      setState((prev) => ({ ...prev, error: message }))
      throw error
    }
  }, [])

  return { ...state, signIn, signInWithGoogle, signOut }
}
