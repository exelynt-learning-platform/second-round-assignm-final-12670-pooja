import axios from 'axios';

const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

/**
 * Sends the full conversation history to the OpenAI-compatible API
 * and returns the AI assistant's reply text.
 *
 * @param {Array<{role: string, content: string}>} messages - Full conversation history
 * @returns {Promise<string>} - The AI's response text
 */
export async function callOpenAI(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'API key is not set. Please add your VITE_OPENAI_API_KEY to the .env file and restart the dev server.'
    );
  }

  const response = await axios.post(
    `${BASE_URL}/chat/completions`,
    {
      model: MODEL,
      messages, // full message history for context
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    }
  );

  // Validate response structure
  const choice = response.data?.choices?.[0];
  if (!choice || !choice.message?.content) {
    throw new Error('Received an empty or malformed response from the AI.');
  }

  return choice.message.content;
}
