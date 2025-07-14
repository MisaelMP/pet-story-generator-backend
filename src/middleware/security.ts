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
		];

		// Allow requests with no origin (mobile apps, Postman, etc.)
		if (!origin) return callback(null, true);

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
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
