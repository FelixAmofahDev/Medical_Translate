import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@/features/auth/firebase'

export function Header() {
  const { user, signOut: localSignOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth())
      localSignOut()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-sm">
              MT
            </div>
            <span className="text-lg font-semibold text-gray-900">MediTranslate</span>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {user.displayName || user.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
