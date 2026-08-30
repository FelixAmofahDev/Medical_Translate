import type {
  TranscriptionResponse,
  TranslationResponse,
} from './types'
import OpenAI from 'openai'

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL

  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set')
  }

  return base.replace(/\/$/, '')
}

export async function transcribeAudio(
  audioBlob: Blob
): Promise<TranslationResponse> {
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
    // 1. Transcribe audio
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

    // Adjust this depending on what your Whisper API returns.
    const twiText = data.text

    if (!twiText) {
      throw new Error('No transcription text returned from API')
    }

    console.log('[API] Twi transcription:', twiText)

    // 2. Translate transcription using OpenAI
    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    console.log('[OpenAI] Translating Twi...')

    const openaiResponse = await client.responses.create({
      model: 'gpt-5.6-luna',
      instructions:
        'This transcription is patient talking to a doctor at a consultation. Translate the Twi text into clear English focusing on the sounds it insunuate becuase the transcription is noisy and not so accurate so we focus on the sounds. Preserve the patient’s exact meaning and medical information. Do not add, remove, or invent information. Return only the English translation. If not so clear, reurn this: "Sound not so clear, pplease record again"',
      input: twiText,
    })

    const translation = openaiResponse.output_text

    console.log('[OpenAI] Translation:', translation)

    // 3. Return both
    return {
  transcription: twiText,
  translation,
} as TranslationResponse
  } catch (error) {
    console.error('[API] Request failed:', error)
    throw error
  }
}