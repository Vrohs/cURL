# Gemini API Proxy

A simple API proxy for Google's Gemini 1.5 Pro AI, deployable to Vercel and accessible via cURL.

## Features

- POST endpoint to send prompts to Google's Gemini 1.5 Pro AI
- Secure API key handling via environment variables
- Error handling for missing prompts and API issues
- Ready for Vercel deployment

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000  # Optional for local development
   ```
4. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Local Development

Run the server locally:
```
npm start
```

The server will be available at `http://localhost:3000`.

## Deployment to Vercel

1. Install Vercel CLI (if you haven't already):
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Set up environment variables in the Vercel dashboard:
   - Go to your project settings
   - Add `GEMINI_API_KEY` with your API key

## Usage

### Using cURL

Send a prompt to the API:

```bash
# For local development
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Tell me a joke about programming"}'

# For Vercel deployment
curl -X POST https://your-vercel-url.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Tell me a joke about programming"}'
```

### Response Format

```json
{
  "prompt": "Tell me a joke about programming",
  "response": "Why do programmers prefer dark mode? Because light attracts bugs!"
}
```

## Error Handling

The API includes error handling for:
- Missing prompts
- API key configuration issues
- Gemini API errors

## License

ISC 