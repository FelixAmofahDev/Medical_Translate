import type { RecordingStatus } from '@/types'

const statusStyles: Record<RecordingStatus, { label: string; className: string }> = {
  idle: {
    label: 'Ready',
    className: 'bg-gray-100 text-gray-700',
  },
  recording: {
    label: 'Recording',
    className: 'bg-red-50 text-red-700',
  },
  processing: {
    label: 'Processing',
    className: 'bg-amber-50 text-amber-700',
  },
  done: {
    label: 'Complete',
    className: 'bg-emerald-50 text-emerald-700',
  },
  error: {
    label: 'Error',
    className: 'bg-red-50 text-red-700',
  },
}

interface StatusBadgeProps {
  status: RecordingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusStyles[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {status === 'recording' && (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      )}
      {label}
    </span>
  )
}
