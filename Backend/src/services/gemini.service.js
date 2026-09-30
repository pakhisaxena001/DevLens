import { GoogleGenAI } from '@google/genai'
import { config } from '../config/env.js'

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
})

const responseSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
    },
    strengths: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    weaknesses: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    recommendations: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: [
    'summary',
    'strengths',
    'weaknesses',
    'recommendations',
  ],
}

export const generateRepositorySummary = async (repositoryData) => {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const prompt = `
You are DevLens, an AI assistant that analyzes GitHub repositories.

Analyze this repository using ONLY the provided information.

${JSON.stringify(repositoryData)}

Return a JSON object containing:

summary:
Write a concise 2-3 sentence overview.

strengths:
Exactly 3 specific strengths based on the metrics.

weaknesses:
Exactly 3 specific areas that could be improved.

recommendations:
Exactly 3 practical recommendations.

Do not invent information.
Do not mention information that is not provided.
Keep every item concise.
`

  try {
    console.log('Sending repository analysis to Gemini...')

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    })

    if (!response?.text) {
      throw new Error('Gemini returned an empty response')
    }

    const parsed = JSON.parse(response.text)

    console.log('Gemini AI summary generated successfully')

    return {
      summary: parsed.summary || '',
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : [],
      weaknesses: Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses
        : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
    }
  } catch (error) {
    console.error(
      'Gemini request failed:',
      error?.message || error
    )

    throw error
  }
}