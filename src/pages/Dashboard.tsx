import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const doctorName = user?.displayName || user?.email?.split('@')[0] || 'Doctor'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {doctorName}
          </h1>
          <p className="mt-1 text-gray-600">
            Start a new consultation to translate patient speech from Twi to English.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Consultation</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Record the patient&apos;s Twi speech and get an instant English translation.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/consultation')}
                className="shrink-0"
              >
                Start Consultation
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Recent Consultations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Consultation history will be available once connected to the backend.
          </p>
        </div>
      </main>
    </div>
  )
}
