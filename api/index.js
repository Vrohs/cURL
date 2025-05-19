const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validate that API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please check your .env file');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing prompt parameter',
        usage: 'Send a POST request with a "prompt" field in the body'
      });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    res.status(200).json({ 
      prompt,
      response: text
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'API key configuration error. Make sure GEMINI_API_KEY is set properly.'
      });
    }
    
    if (error.message && error.message.includes('429')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'The Gemini API quota has been exceeded. Please try again later.',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Gemini API Proxy</h1>
    <p>Make POST requests to /api/generate with a JSON body containing a "prompt" field.</p>
    <p>Example cURL command:</p>
    <pre>curl -X POST https://your-vercel-url/api/generate -H "Content-Type: application/json" -d '{"prompt":"Tell me a joke"}'</pre>
  `);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; 