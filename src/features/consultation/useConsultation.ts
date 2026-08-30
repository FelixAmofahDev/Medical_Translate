import { useCallback, useState } from 'react'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { transcribeAudio } from '@/services/api/client'
import type { TranslationTurn } from '@/types'

export function useAudioRecorder() {
  const recorder = useMediaRecorder()
  const [turns, setTurns] = useState<TranslationTurn[]>([])
  const [currentError, setCurrentError] = useState<string | null>(null)

  const handleRecord = useCallback(async () => {
    console.log('[Consultation] handleRecord clicked')
    setCurrentError(null)
    await recorder.startRecording()
  }, [recorder])

  const handleStop = useCallback(async () => {
    console.log('[Consultation] handleStop clicked')
    recorder.stopRecording()
  }, [recorder])

  const processRecording = useCallback(async () => {
    const audioBlob = recorder.blob
    if (!audioBlob) {
      console.warn('[Consultation] No audio blob available')
      return
    }

    const turnId = crypto.randomUUID()
    const timestamp = new Date()

    setTurns((prev) => [
      ...prev,
      {
        id: turnId,
        twiText: '',
        englishText: '',
        timestamp,
        status: 'processing',
      },
    ])

    try {
      console.log('[Consultation] Starting transcription...')
      const data = await transcribeAudio(audioBlob)
      console.log('[Consultation] Transcription success:', data)
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                twiText: data.twi_text,
                englishText: data.english_text,
                status: 'done' as const,
              }
            : turn
        )
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed'
      console.error('[Consultation] Transcription error:', message, error)
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === turnId
            ? { ...turn, status: 'error' as const, error: message }
            : turn
        )
      )
      setCurrentError(message)
    }
  }, [recorder])

  const retryLast = useCallback(async () => {
    const lastFailed = [...turns].reverse().find((t) => t.status === 'error')
    console.log('[Consultation] retryLast clicked, lastFailed:', lastFailed?.id, 'blob:', !!recorder.blob)
    if (!lastFailed || !recorder.blob) return

    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === lastFailed.id ? { ...turn, status: 'processing', error: undefined } : turn
      )
    )
    setCurrentError(null)

    try {
      const data = await transcribeAudio(recorder.blob)
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === lastFailed.id
            ? {
                ...turn,
                twiText: data.twi_text,
                englishText: data.english_text,
                status: 'done' as const,
              }
            : turn
        )
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed'
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === lastFailed.id ? { ...turn, status: 'error' as const, error: message } : turn
        )
      )
      setCurrentError(message)
    }
  }, [recorder, turns])

  const resetConsultation = useCallback(() => {
    console.log('[Consultation] resetConsultation clicked')
    recorder.reset()
    setTurns([])
    setCurrentError(null)
  }, [recorder])

  return {
    ...recorder,
    turns,
    currentError,
    handleRecord,
    handleStop,
    processRecording,
    retryLast,
    resetConsultation,
  }
}
