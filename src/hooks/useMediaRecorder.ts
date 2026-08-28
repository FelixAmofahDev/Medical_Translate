import { useState, useRef, useCallback, useEffect } from 'react'
import type { RecordingState } from '@/types'

interface MediaRecorderResult extends RecordingState {
  blob?: Blob
  startRecording: () => Promise<void>
  stopRecording: () => void
  reset: () => void
}

export function useMediaRecorder(): MediaRecorderResult {
  const [state, setState] = useState<RecordingState>({
    status: 'idle',
    durationSeconds: 0,
  })
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined,
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        setState((prev) => ({ ...prev, status: 'done', blob }))
      }

      mediaRecorder.onerror = () => {
        clearTimer()
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Recording failed. Please check your microphone permissions.',
        }))
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000)
      startTimeRef.current = Date.now()

      setState({ status: 'recording', durationSeconds: 0 })

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setState((prev) => ({ ...prev, durationSeconds: elapsed }))
      }, 1000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Microphone access denied'
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: message,
      }))
    }
  }, [clearTimer])

  const stopRecording = useCallback(() => {
    clearTimer()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    mediaRecorderRef.current = null
    chunksRef.current = []
    setState({ status: 'idle', durationSeconds: 0 })
  }, [clearTimer])

  return {
    ...state,
    startRecording,
    stopRecording,
    reset,
  }
}
