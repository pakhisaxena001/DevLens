import { config } from '../config/env.js';

let openai;

try {
  const OpenAI = (await import('openai')).default;
  openai = new OpenAI({ apiKey: config.openaiApiKey });
} catch (error) {
  console.warn('OpenAI not available');
}

export const analyzeCode = async (code) => {
  if (!openai) throw new Error('OpenAI not configured');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis expert.',
        },
        {
          role: 'user',
          content: `Analyze this code and provide insights:\n\n${code}`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

export const generateSuggestions = async (repositoryData) => {
  if (!openai) throw new Error('OpenAI not configured');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a software improvement expert.',
        },
        {
          role: 'user',
          content: `Suggest improvements for this repository:\n\n${JSON.stringify(
            repositoryData,
            null,
            2
          )}`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Suggestion generation failed: ${error.message}`);
  }
};

export const chat = async (message, context = '') => {
  if (!openai) throw new Error('OpenAI not configured');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for DevLens, a GitHub repository analysis platform. ${context}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Chat failed: ${error.message}`);
  }
};
