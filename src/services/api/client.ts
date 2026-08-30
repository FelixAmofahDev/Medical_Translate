import type { TranscriptionResponse } from './types'

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  return base.replace(/\/$/, '')
}

export async function transcribeAudio(
  audioBlob: Blob
): Promise<TranscriptionResponse> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/transcribe`

  console.log(
    '[API] POST',
    url,
    'blob bytes:',
    audioBlob.size,
    'type:',
    audioBlob.type
  )

  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    console.log(
      '[API] Transcription status:',
      response.status,
      response.statusText
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error('[API] Transcription error:', errorText)

      throw new Error(
        errorText ||
          `Transcription failed with status ${response.status}`
      )
    }

    const data = (await response.json()) as TranscriptionResponse

    console.log('[API] Transcription data:', data)

    return data
  } catch (error) {
    console.error('[API] Request failed:', error)
    throw error
  }
}
