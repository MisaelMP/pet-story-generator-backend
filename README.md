# Pet Story Generator Backend

A Node.js/TypeScript backend service for generating personalized pet stories using OpenAI's API with integrations for PIMS and Xano.

## Features

- Generate personalized pet stories using OpenAI GPT
- Integration with PIMS (Pet Information Management System)
- Integration with Xano database
- Rate limiting and security features
- CORS support for frontend integration
- Environment-based configuration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pet-story-generator-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your API keys:
   - Add your OpenAI API key
   - Configure PIMS integration (if needed)
   - Configure Xano integration (if needed)

## Environment Variables

| Variable                  | Description                          | Required |
| ------------------------- | ------------------------------------ | -------- |
| `PORT`                    | Server port (default: 3001)          | No       |
| `NODE_ENV`                | Environment (development/production) | No       |
| `FRONTEND_URL`            | Frontend URL for CORS                | No       |
| `OPENAI_API_KEY`          | OpenAI API key                       | Yes      |
| `PIMS_BASE_URL`           | PIMS API base URL                    | No       |
| `PIMS_API_KEY`            | PIMS API key                         | No       |
| `XANO_BASE_URL`           | Xano API base URL                    | No       |
| `XANO_API_KEY`            | Xano API key                         | No       |
| `MAX_REQUESTS_PER_WINDOW` | Rate limit max requests              | No       |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window in ms              | No       |

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Build

```bash
npm run build
```

## API Endpoints

### POST /api/generate-story

Generate a personalized pet story.

**Request Body:**

```json
{
	"petName": "Buddy",
	"petType": "dog",
	"petBreed": "Golden Retriever",
	"petAge": 3,
	"ownerName": "John",
	"storyTheme": "adventure"
}
```

**Response:**

```json
{
	"story": "Generated story content...",
	"metadata": {
		"generatedAt": "2025-07-14T12:00:00Z",
		"wordCount": 250
	}
}
```

## Project Structure

```
pet-story-generator-backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── routes/
│   └── types/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
