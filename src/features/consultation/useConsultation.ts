import { useCallback, useState } from 'react'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { translateAudio } from '@/services/api/client'
import type { TranslationTurn } from '@/types'

export function useAudioRecorder() {
  const recorder = useMediaRecorder()
  const [turns, setTurns] = useState<TranslationTurn[]>([])
  const [currentError, setCurrentError] = useState<string | null>(null)

  const handleRecord = useCallback(async () => {
    setCurrentError(null)
    await recorder.startRecording()
  }, [recorder])

  const handleStop = useCallback(async () => {
    recorder.stopRecording()
  }, [recorder])

  const processRecording = useCallback(async () => {
    const audioBlob = recorder.blob
    if (!audioBlob) return

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
      const data = await translateAudio(audioBlob)
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
      const message = error instanceof Error ? error.message : 'Translation failed'
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
    if (!lastFailed || !recorder.blob) return

    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === lastFailed.id ? { ...turn, status: 'processing', error: undefined } : turn
      )
    )
    setCurrentError(null)

    try {
      const data = await translateAudio(recorder.blob)
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
      const message = error instanceof Error ? error.message : 'Translation failed'
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === lastFailed.id ? { ...turn, status: 'error' as const, error: message } : turn
        )
      )
      setCurrentError(message)
    }
  }, [recorder, turns])

  const resetConsultation = useCallback(() => {
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
