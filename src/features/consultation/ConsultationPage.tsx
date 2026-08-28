import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Spinner } from '@/components/ui/Spinner'
import { useAudioRecorder } from '@/features/consultation/useConsultation'
import { formatDuration } from '@/utils/format'

export function ConsultationPage() {
  const navigate = useNavigate()
  const recorder = useAudioRecorder()
  const {
    handleRecord,
    handleStop,
    processRecording,
    retryLast,
    resetConsultation,
    turns,
    currentError,
    status,
    durationSeconds,
    error,
  } = recorder
  const recordingCompletedRef = useRef(false)

  useEffect(() => {
    if (status === 'done' && !recordingCompletedRef.current) {
      recordingCompletedRef.current = true
      processRecording()
    }
    if (status === 'idle') {
      recordingCompletedRef.current = false
    }
  }, [status, processRecording])

  const isRecording = status === 'recording'
  const isProcessing = turns.length > 0 && turns[turns.length - 1].status === 'processing'
  const isBusy = isRecording || isProcessing

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Record the patient&apos;s statement in Twi.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Exit
          </Button>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                <span className="text-2xl font-mono text-gray-900">
                  {formatDuration(durationSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status === 'idle' && (
                <Button onClick={handleRecord} disabled={isBusy}>
                  <span className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                  Record
                </Button>
              )}

              {status === 'recording' && (
                <Button variant="danger" onClick={handleStop}>
                  <span className="mr-2 h-3 w-3 rounded-sm bg-white" />
                  Stop
                </Button>
              )}

              {(status === 'done' || status === 'error') && (
                <Button onClick={resetConsultation} variant="secondary">
                  Clear
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {currentError && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-700">{currentError}</p>
              <Button variant="secondary" size="sm" onClick={retryLast}>
                Retry
              </Button>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-4">
              <Spinner />
              <p className="text-sm text-amber-700">Processing audio...</p>
            </div>
          )}
        </Card>

        {turns.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
            {turns.map((turn) => (
              <Card key={turn.id} className="overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Statement
                  </span>
                  <span className="text-xs text-gray-400">
                    {turn.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {turn.status === 'processing' && (
                  <div className="flex items-center gap-3 py-6">
                    <Spinner />
                    <p className="text-sm text-gray-600">Translating...</p>
                  </div>
                )}

                {turn.status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-700">{turn.error || 'Translation failed'}</p>
                    <Button variant="secondary" size="sm" className="mt-2" onClick={retryLast}>
                      Retry
                    </Button>
                  </div>
                )}

                {turn.status === 'done' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Twi
                      </h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {turn.twiText}
                      </p>
                    </div>
                    <div className="rounded-lg bg-teal-50 border border-teal-100 p-4">
                      <h4 className="text-xs font-medium text-teal-700 uppercase tracking-wider mb-2">
                        English
                      </h4>
                      <p className="text-teal-900 leading-relaxed whitespace-pre-wrap font-medium">
                        {turn.englishText}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {turns.length === 0 && status === 'idle' && (
          <div className="text-center py-12 text-gray-500">
            <p>No statements recorded yet.</p>
            <p className="text-sm mt-1">Press Record to begin the consultation.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            This is a translation assistant only. Important clinical information should be verified when necessary.
          </p>
        </div>
      </main>
    </div>
  )
}
