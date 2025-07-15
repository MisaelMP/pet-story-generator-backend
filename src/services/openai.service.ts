import OpenAI from 'openai';
import { OpenAIResponse } from '../types';

export class OpenAIService {
	private static client: OpenAI | null = null;

	private static getClient(): OpenAI {
		if (!this.client) {
			if (!process.env.OPENAI_API_KEY) {
				console.error('OPENAI_API_KEY environment variable is not set');
				throw new Error('OPENAI_API_KEY environment variable is not set');
			}

			this.client = new OpenAI({
				apiKey: process.env.OPENAI_API_KEY,
			});
		}
		return this.client;
	}

	static async generateStory(
		prompt: string,
		parameters: {
			maxTokens: number;
			temperature: number;
			topP: number;
		}
	): Promise<OpenAIResponse> {
		try {
			const client = this.getClient();

			// Use gpt-3.5-turbo instead of gpt-4o for cost efficiency
			const completion = await client.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content:
							'You are a professional fundraising copywriter specializing in pet medical campaigns. Write engaging, heartwarming stories.',
					},
					{
						role: 'user',
						content: prompt,
					},
				],
				max_tokens: parameters.maxTokens,
				temperature: parameters.temperature,
				top_p: parameters.topP,
			});

			return completion as OpenAIResponse;
		} catch (error) {
			console.error('OpenAI API error:', error);
			throw new Error(
				`OpenAI generation failed: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}

	static async moderateContent(content: string): Promise<boolean> {
		try {
			const client = this.getClient();
			const moderation = await client.moderations.create({
				input: content,
			});

			return moderation.results[0]?.flagged || false;
		} catch (error) {
			console.error('OpenAI moderation error:', error);
			// Don't block on moderation errors, but log them
			return false;
		}
	}
}
