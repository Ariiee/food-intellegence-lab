# Food Intelligence Lab - Backend Proxy

This backend service acts as a secure proxy for API keys, preventing them from being exposed in the frontend code.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-intelligence-lab
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   - Environment variables are now centrally managed in the root directory.
   - Create a `.env` file in the **root** folder (`../.env` relative to this backend) and add your database and API keys:
     ```env
     DATABASE_URL="postgresql://username:password@host/database"
     BETTER_AUTH_SECRET="your_random_secret_string"
     GOOGLE_CLIENT_ID="your_google_oauth_client_id"
     GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
     GITHUB_CLIENT_ID="your_github_oauth_client_id"
     GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
     VITE_GEMINI_API_KEY="your_gemini_api_key_here"
     ```

4. **Initialize Database Schema**
   ```bash
   npx prisma db push
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   # or
   node server.js
   ```

6. **Configure frontend**
   - The frontend communicates with this backend via Vite's proxy configured in `vite.config.js`.
   - Ensure you start the frontend from the root directory on port 3000.

7. **Start the frontend**
   ```bash
   # From the root directory
   npm run dev
   ```

## How It Works

1. The frontend makes requests to `/api/food-profile` on the backend
2. The backend receives the request and adds the API keys from environment variables
3. The backend makes the actual API calls to external services (Gemini, USDA, etc.)
4. The backend returns the response to the frontend
5. API keys never leave the backend server, keeping them secure

## Security Benefits

- API keys are never exposed in client-side code
- API keys are not visible in browser developer tools
- API keys are not included in JavaScript bundles
- Rate limiting and API key rotation can be implemented on the backend
- Request logging and monitoring can be added centrally

## API Endpoints

### POST `/api/food-profile`
Request body:
```json
{
  "materialName": "turmeric"
}
```

Response format: Same as the original Gemini API response format

## Development Notes

- The backend uses CORS to allow requests from the frontend
- Error handling is included for missing API keys and failed requests
- The server falls back to gracefully handling missing configuration
- In production, consider adding rate limiting, request validation, and logging

## Production Deployment

For production deployment:
1. Use a process manager like PM2 or Docker
2. Set environment variables through your hosting platform
3. Consider adding a reverse proxy (NGINX) for SSL termination
4. Implement rate limiting and request validation
5. Add comprehensive logging and monitoring