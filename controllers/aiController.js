// controllers/geminiProController.js
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
require('dotenv').config();

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-pro', // ensure this model is supported
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY
});

async function processPrompt(prompt) {
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }
  try {
    const response = await model.invoke(prompt);
    return response.content
  } catch (error) {
    console.error('Error invoking Gemini Pro:', error.message);
    return error;
  }
}

module.exports = { processPrompt };
