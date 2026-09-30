import { GoogleGenAI } from '@google/genai'
import { config } from './src/config/env.js'

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
})

const response = await ai.models.generateContent({
  model: 'gemini-3.7-flash',
  contents: 'Say hello in one sentence.',
})

console.log(response.text)