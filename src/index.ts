import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {
	corsOptions,
	securityHeaders,
	generalRateLimit,
	requestLogger,
	errorHandler,
} from './middleware/security';
import aiRoutes from './routes/ai.routes';
import petsRoutes from './routes/pets.routes';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(
	(varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
	console.error('Missing required environment variables:', missingEnvVars);
	process.exit(1);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(generalRateLimit);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV === 'development') {
	app.use(requestLogger);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
		services: {
			openai: !!process.env.OPENAI_API_KEY,
			pims: !!process.env.PIMS_BASE_URL,
			xano: !!process.env.XANO_BASE_URL,
		},
	});
});

// API routes - Order matters: more specific routes first
app.use('/api/pets', petsRoutes); // This will handle /api/pets and /api/pets/:id
app.use('/api', aiRoutes); // This will handle /api/generate-story

// 404 handler
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		error: 'Endpoint not found',
		message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
	});
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
	console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
	console.log(`🐕 PIMS URL: ${process.env.PIMS_BASE_URL}`);
	console.log(`💾 Xano configured: ${!!process.env.XANO_BASE_URL}`);

	if (process.env.NODE_ENV === 'development') {
		console.log('\n📋 Available endpoints:');
		console.log('  GET  /api/health');
		console.log('  GET  /api/pets');
		console.log('  GET  /api/pets/:id');
		console.log('  POST /api/generate-story');
	}
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('SIGINT received, shutting down gracefully');
	process.exit(0);
});
