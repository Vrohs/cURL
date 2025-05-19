const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST endpoint to handle AI prompts
app.post('/api/generate', async (req, res) => {
  try {
    // Get prompt from request body
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing prompt parameter',
        usage: 'Send a POST request with a "prompt" field in the body'
      });
    }
    
    // Initialize the Gemini model (updated to latest version)
    // For newer SDK versions, use:
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Generate content from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Return the response
    res.status(200).json({ 
      prompt,
      response: text
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Properly handle API key errors
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'API key configuration error. Make sure GEMINI_API_KEY is set properly.'
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message
    });
  }
});

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Add a root endpoint with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Gemini API Proxy</h1>
    <p>Make POST requests to /api/generate with a JSON body containing a "prompt" field.</p>
    <p>Example cURL command:</p>
    <pre>curl -X POST https://your-vercel-url/api/generate -H "Content-Type: application/json" -d '{"prompt":"Tell me a joke"}'</pre>
  `);
});

// Start the server if not in Vercel (serverless) environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
module.exports = app; 