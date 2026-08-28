export interface TranslationTurn {
  id: string
  twiText: string
  englishText: string
  timestamp: Date
  status: 'idle' | 'processing' | 'done' | 'error'
  error?: string
}

export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'done' | 'error'

export interface RecordingState {
  status: RecordingStatus
  durationSeconds: number
  error?: string
}
