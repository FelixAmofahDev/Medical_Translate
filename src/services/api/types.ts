export interface TranscriptionResponse {
  transcription: string
  text: string
  filename: string
}

export interface TranslationResponse {
  text: any | string
  transcription: string
  translation: string
}