import type { TranslationApiResponse, TranslationResponse } from './types'

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  return base.replace(/\/$/, '')
}

export async function transcribeAudio(audioBlob: Blob): Promise<TranslationResponse> {
  const baseUrl = getBaseUrl()
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await fetch(`${baseUrl}/transcribe`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Transcription failed with status ${response.status}`)
  }

  const data = (await response.json()) as TranslationResponse
  return data
}

export async function translateAudio(audioBlob: Blob): Promise<TranslationApiResponse> {
  const baseUrl = getBaseUrl()
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await fetch(`${baseUrl}/translate`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Translation failed with status ${response.status}`)
  }

  const data = (await response.json()) as TranslationApiResponse
  return data
}
