# Pet Story Generator Backend

A Node.js/TypeScript REST API service that generates personalized pet stories using OpenAI's GPT models. The service integrates with PIMS (Pet Information Management System) for pet data and Xano for data persistence, providing a complete backend solution for veterinary fundraising applications.

## Overview

This backend service enables the generation of compelling, personalized stories for pets in need of medical treatment. It combines pet information from external systems with AI-powered story generation to create engaging content for fundraising campaigns.

## Features

- **AI Story Generation**: Generate personalized pet stories using OpenAI's GPT models
- **PIMS Integration**: Fetch pet data from Pet Information Management System
- **Xano Database**: Optional data persistence for generated stories
- **Security Features**: Rate limiting, CORS protection, content moderation
- **Request Validation**: Comprehensive input validation using Zod schemas
- **Error Handling**: Structured error responses with detailed logging
- **Development Tools**: Hot reload, TypeScript compilation, linting

## Architecture

### Core Components

- **Express.js Server**: RESTful API with middleware for security and validation
- **OpenAI Service**: Handles AI story generation and content moderation
- **PIMS Service**: Manages pet data retrieval from external veterinary systems
- **Xano Service**: Handles optional data persistence for generated content
- **Security Middleware**: Implements CORS, rate limiting, and helmet protection

### Project Structure

```
src/
├── index.ts              # Application entry point and server configuration
├── middleware/           # Security, CORS, and rate limiting middleware
│   └── security.ts
├── routes/              # API route definitions
│   ├── ai.routes.ts     # Story generation endpoints
│   └── pets.routes.ts   # Pet data endpoints
├── services/            # Business logic and external integrations
│   ├── openai.service.ts
│   ├── pims.service.ts
│   └── xano.service.ts
├── types/               # TypeScript type definitions and schemas
│   └── index.ts
└── utils/               # Utility functions and helpers
```

## Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher
- OpenAI API account with valid API key
- Access to PIMS system (optional)
- Xano account for data persistence (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-story-generator-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit the `.env` file with your configuration**
   ```bash
   # Required: Add your OpenAI API key
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # Optional: Configure other services as needed
   ```

## Environment Variables

### Required Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key for story generation | - | Yes |

### Optional Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3001 | No |
| `NODE_ENV` | Environment mode | development | No |
| `FRONTEND_URL` | Frontend URL for CORS configuration | http://localhost:5173 | No |
| `PIMS_BASE_URL` | PIMS API base URL | - | No |
| `PIMS_API_KEY` | PIMS API authentication key | - | No |
| `XANO_BASE_URL` | Xano API base URL | - | No |
| `XANO_API_KEY` | Xano API authentication key | - | No |
| `MAX_REQUESTS_PER_WINDOW` | Rate limit maximum requests | 10 | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | 900000 | No |

## Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3001` with the following endpoints available:
- Health check: `http://localhost:3001/api/health`
- Pet data: `http://localhost:3001/api/pets`
- Story generation: `http://localhost:3001/api/generate-story`

### Production Mode

Build and start the production server:

```bash
npm run build
npm start
```

### Linting

Run ESLint for code quality checks:

```bash
npm run lint
```

## API Documentation

### Health Check

**GET** `/api/health`

Returns server status and configuration information.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-14T12:00:00.000Z",
  "services": {
    "openai": true,
    "pims": true,
    "xano": false
  }
}
```

### Pet Data

**GET** `/api/pets`

Retrieves all available pets from PIMS system.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Buddy",
    "type": "Dog",
    "breed": "Golden Retriever",
    "age": 3,
    "description": "Friendly and energetic dog"
  }
]
```

**GET** `/api/pets/:id`

Retrieves specific pet information by ID.

### Story Generation

**POST** `/api/generate-story`

Generates a personalized story for a pet using AI.

**Request Body:**
```json
{
  "prompt": "Create a heartwarming story about Buddy, a 3-year-old Golden Retriever who needs surgery...",
  "parameters": {
    "maxTokens": 500,
    "temperature": 0.7,
    "topP": 0.9
  },
  "options": {
    "includeSuggestions": true,
    "moderationCheck": true,
    "saveToXano": false,
    "petId": "1"
  }
}
```

**Response:**
```json
{
  "story": {
    "title": "Buddy's Journey to Recovery",
    "content": "Generated story content...",
    "tone": "heartwarming",
    "suggestedGoal": 5000,
    "keyPoints": ["loyal companion", "needs surgery", "full recovery expected"]
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 350,
    "total_tokens": 500
  },
  "model": "gpt-3.5-turbo",
  "savedToXano": false,
  "timestamp": "2025-07-14T12:00:00.000Z"
}
```

## Error Handling

The API returns structured error responses with appropriate HTTP status codes:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (development only)"
}
```

Common status codes:
- `400`: Bad Request (validation errors)
- `403`: Forbidden (CORS or rate limiting)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error
- `502`: Bad Gateway (external service unavailable)

## Security Features

- **CORS Protection**: Configurable origin allowlist with development flexibility
- **Rate Limiting**: Prevents API abuse with configurable limits
- **Helmet**: Security headers for common vulnerabilities
- **Input Validation**: Comprehensive request validation using Zod schemas
- **Content Moderation**: Optional OpenAI moderation for generated content

## Development

### Code Style

The project uses ESLint with TypeScript-specific rules. Code is automatically formatted and validated on build.

### Testing

To add tests, install a testing framework and create test files in a `__tests__` directory:

```bash
npm install --save-dev jest @types/jest ts-jest
```

### Debugging

Enable debug logging by setting `NODE_ENV=development` in your `.env` file. The application provides detailed console logging for all operations.

## Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Ensure OpenAI API key has sufficient quota
4. Configure CORS settings for your production domain

### Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Verify API key is valid and has sufficient quota
   - Check OpenAI service status

2. **CORS Errors**
   - Ensure frontend URL is configured in `FRONTEND_URL`
   - Check network configuration for development

3. **PIMS Connection Issues**
   - Verify PIMS URL and credentials
   - Check network connectivity to PIMS system

4. **Rate Limiting**
   - Adjust rate limit settings in environment variables
   - Implement client-side request queuing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes following the existing code style
4. Add tests for new functionality
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

## License

This project is licensed under the ISC License. See the package.json file for details.
