import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting for AI endpoints
export const aiRateLimit = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
	max: parseInt(process.env.MAX_REQUESTS_PER_WINDOW || '10'), // 10 requests per window
	message: {
		error: 'Too many AI requests',
		message: 'Please try again later',
		retryAfter: '15 minutes',
	},
	standardHeaders: true,
	legacyHeaders: false,
	// Skip rate limiting for successful requests that were cached
	skip: (req: Request) => {
		return req.path === '/api/health';
	},
});

// General rate limiting
export const generalRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // 100 requests per window
	message: {
		error: 'Too many requests',
		message: 'Please try again later',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// CORS configuration (for use with cors middleware in index.ts)
export const corsOptions = {
	origin: function (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) {
		const allowedOrigins = [
			process.env.FRONTEND_URL || 'http://localhost:5173',
			'http://localhost:3000', // React dev server alternative
			'http://127.0.0.1:5173', // Alternative localhost
			'http://localhost:5173/', // With trailing slash
			'http://127.0.0.1:5173/', // With trailing slash
			'http://192.168.1.97:5173', // Network IP address
			'http://192.168.1.97:5173/', // Network IP address with trailing slash
			// Production Vercel frontend URLs
			'https://pet-story-generator-18ror73rr-misael-ms-projects.vercel.app',
			'https://pet-story-generator-18ror73rr-misael-ms-projects.vercel.app/',
			'https://pet-story-generator.vercel.app',
			'https://pet-story-generator.vercel.app/',
		];

		// Allow requests with no origin (mobile apps, Postman, etc.)
		if (!origin) return callback(null, true);

		// Remove trailing slash from origin for comparison
		const normalizedOrigin = origin?.replace(/\/$/, '');
		const normalizedAllowedOrigins = allowedOrigins.map((url) =>
			url.replace(/\/$/, '')
		);

		// Check exact matches first
		if (normalizedAllowedOrigins.includes(normalizedOrigin || '')) {
			console.log(`CORS: Allowing origin: ${origin}`);
			callback(null, true);
			return;
		}

		// For development: allow any local network IP on port 5173
		if (process.env.NODE_ENV !== 'production') {
			const localNetworkPattern =
				/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):5173\/?$/;
			if (localNetworkPattern.test(origin)) {
				console.log(`CORS: Allowing local network origin: ${origin}`);
				callback(null, true);
				return;
			}
		}

		callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Security headers
export const securityHeaders = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", 'data:', 'https:'],
			connectSrc: [
				"'self'",
				'https://api.openai.com',
				'https://api.mybalto.com',
				'https://*.xano.io',
			],
		},
	},
	crossOriginEmbedderPolicy: false,
});

// Request logging middleware
export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(
			`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
		);
	});

	next();
};

// Error handling middleware
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error('Error:', err);

	// CORS errors
	if (err.message === 'Not allowed by CORS') {
		return res.status(403).json({
			error: 'CORS error',
			message: 'Origin not allowed',
		});
	}

	// Rate limit errors
	if (err.message.includes('Too many requests')) {
		return res.status(429).json({
			error: 'Rate limit exceeded',
			message: err.message,
		});
	}

	// Default error
	return res.status(500).json({
		error: 'Internal server error',
		message:
			process.env.NODE_ENV === 'development'
				? err.message
				: 'Something went wrong',
	});
};
