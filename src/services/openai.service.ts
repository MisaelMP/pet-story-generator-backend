import OpenAI from 'openai';
import { OpenAIResponse } from '../types';

export class OpenAIService {
	private static client = new OpenAI({
		apiKey: (() => {
			if (!process.env.OPENAI_API_KEY) {
				throw new Error('OPENAI_API_KEY environment variable is not set');
			}
			return process.env.OPENAI_API_KEY;
		})(),
	});

	static async generateStory(
		prompt: string,
		parameters: {
			maxTokens: number;
			temperature: number;
			topP: number;
		}
	): Promise<OpenAIResponse> {
		try {
			const completion = await this.client.chat.completions.create({
				model: 'gpt-4o',
				messages: [
					{
						role: 'system',
						content:
							'You are a professional fundraising copywriter specializing in pet medical campaigns. Always respond with valid JSON only.',
					},
					{
						role: 'user',
						content: prompt,
					},
				],
				max_tokens: parameters.maxTokens,
				temperature: parameters.temperature,
				top_p: parameters.topP,
				response_format: { type: 'json_object' },
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
			const moderation = await this.client.moderations.create({
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
