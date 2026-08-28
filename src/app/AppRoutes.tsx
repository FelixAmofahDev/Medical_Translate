import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/pages/Dashboard'
import { ConsultationPage } from '@/features/consultation/ConsultationPage'
import { NotFound } from '@/pages/NotFound'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultation',
    element: (
      <ProtectedRoute>
        <ConsultationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
