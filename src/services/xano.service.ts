import axios, { AxiosInstance } from 'axios';
import { XanoStoryPayload } from '../types';

export class XanoService {
	private static client: AxiosInstance | null = null;

	private static getClient(): AxiosInstance {
		if (!this.client && process.env.XANO_BASE_URL) {
			this.client = axios.create({
				baseURL: process.env.XANO_BASE_URL,
				timeout: 10000,
				headers: {
					'Content-Type': 'application/json',
					...(process.env.XANO_API_KEY && {
						Authorization: `Bearer ${process.env.XANO_API_KEY}`,
					}),
				},
			});
		}

		if (!this.client) {
			throw new Error('Xano not configured');
		}

		return this.client;
	}

	static async saveStory(payload: XanoStoryPayload): Promise<unknown> {
		try {
			const client = this.getClient();
			console.log('Saving story to Xano:', {
				title: payload.title,
				petId: payload.pims_pet_id,
			});

			const response = await client.post('/generated_stories', payload);

			console.log('Story saved to Xano:', {
				id: response.data.id,
				title: response.data.title,
			});

			return response.data;
		} catch (error) {
			console.error('Xano save error:', error);
			throw new Error('Failed to save story to Xano');
		}
	}

	static isConfigured(): boolean {
		return !!process.env.XANO_BASE_URL;
	}
}
