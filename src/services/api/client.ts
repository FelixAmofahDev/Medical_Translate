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
  const url = `${baseUrl}/transcribe`
  console.log('[API] POST', url, 'blob bytes:', audioBlob.size, 'type:', audioBlob.type)

  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    console.log('[API] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Error body:', errorText)
      throw new Error(errorText || `Transcription failed with status ${response.status}`)
    }

    const data = (await response.json()) as TranslationResponse
    console.log('[API] Response data:', data)
    return data
  } catch (error) {
    console.error('[API] Request failed:', error)
    throw error
  }
}

export async function translateAudio(audioBlob: Blob): Promise<TranslationApiResponse> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/translate`
  console.log('[API] POST', url, 'blob bytes:', audioBlob.size, 'type:', audioBlob.type)

  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    console.log('[API] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Error body:', errorText)
      throw new Error(errorText || `Translation failed with status ${response.status}`)
    }

    const data = (await response.json()) as TranslationApiResponse
    console.log('[API] Response data:', data)
    return data
  } catch (error) {
    console.error('[API] Request failed:', error)
    throw error
  }
}
