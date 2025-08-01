import axios, { AxiosInstance } from 'axios';
import { PIMSPet } from '../types';

export class PIMSService {
	private static _client: AxiosInstance | null = null;

	private static get client(): AxiosInstance {
		if (!this._client) {
			this._client = axios.create({
				baseURL:
					process.env.PIMS_BASE_URL || 'https://api.mybalto.com/api:D60OKSek',
				timeout: 15000,
				headers: {
					'Content-Type': 'application/json',
					...(process.env.PIMS_API_KEY && {
						Authorization: `Bearer ${process.env.PIMS_API_KEY}`,
					}),
				},
			});
		}
		return this._client;
	}

	static async getAllPets(): Promise<PIMSPet[]> {
		try {
			const response = await this.client.get('/pims/patients');

			// Handle different possible response formats
			let petsData: PIMSPet[];

			if (Array.isArray(response.data)) {
				petsData = response.data;
			} else if (response.data.items && Array.isArray(response.data.items)) {
				petsData = response.data.items;
			} else if (response.data.data && Array.isArray(response.data.data)) {
				petsData = response.data.data;
			} else if (
				response.data.patients &&
				Array.isArray(response.data.patients)
			) {
				petsData = response.data.patients;
			} else if (
				response.data.results &&
				Array.isArray(response.data.results)
			) {
				petsData = response.data.results;
			} else {
				console.warn('Unexpected PIMS response format:', response.data);
				petsData = [response.data]; // Treat as single pet
			}

			return petsData;
		} catch (error) {
			console.error('PIMS API error:', error);

			if (axios.isAxiosError(error)) {
				if (error.code === 'ENOTFOUND') {
					throw new Error('Unable to connect to PIMS server');
				}
				if (error.response?.status === 401) {
					throw new Error('PIMS authentication failed');
				}
				if (error.response?.status === 403) {
					throw new Error('PIMS access denied');
				}
				if (error.response?.status === 404) {
					throw new Error('PIMS endpoint not found');
				}
				if (error.response?.status && error.response.status >= 500) {
					throw new Error('PIMS server error');
				}
			}

			throw new Error('Failed to fetch pets from PIMS');
		}
	}

	static async getPetById(id: string): Promise<PIMSPet | null> {
		try {
			// Try specific endpoint first
			try {
				const response = await this.client.get(`/pims/patients/${id}`);
				return response.data;
			} catch (detailError) {
				// Fallback: get all pets and find the specific one
				console.log('Pet detail endpoint not available, using fallback');
				const allPets = await this.getAllPets();
				const foundPet = allPets.find(
					(pet) =>
						pet.id === id ||
						pet.id === Number(id).toString() ||
						String(pet.id) === id
				);
				return foundPet || null;
			}
		} catch (error) {
			console.error(`PIMS get pet ${id} error:`, error);
			throw new Error(`Failed to fetch pet ${id} from PIMS`);
		}
	}
}
