import { useState, type FormEvent } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function LoginPage() {
  const { signIn, signInWithGoogle, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await signIn(email, password)
    } catch {
      // error handled in hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch {
      // error handled in hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-lg">
          MT
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">MediTranslate</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Medical Twi to English Translation Assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="doctor@clinic.example"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting || loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleGoogle}
                loading={loading}
              >
                Google
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            For clinical use only. Verify important information when necessary.
          </p>
        </Card>
      </div>
    </div>
  )
}
