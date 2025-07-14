import { Router, Request, Response } from 'express';
import { PIMSService } from '../services/pims.service';
import { APIError } from '../types';

const router = Router();

// Get all pets
router.get('/', async (req: Request, res: Response) => {
	try {
		console.log('Fetching all pets from PIMS...');

		const pets = await PIMSService.getAllPets();

		console.log(`Successfully fetched ${pets.length} pets from PIMS`);

		return res.json(pets);
	} catch (error) {
		console.error('Get pets error:', error);

		const apiError: APIError = {
			error: 'Failed to fetch pets',
			message: error instanceof Error ? error.message : 'Unknown error',
		};

		if (error instanceof Error) {
			if (error.message.includes('Unable to connect')) {
				return res.status(502).json({
					...apiError,
					error: 'Cannot connect to veterinary system',
				});
			}
			if (error.message.includes('authentication')) {
				return res.status(502).json({
					...apiError,
					error: 'Authentication failed with veterinary system',
				});
			}
		}

		return res.status(502).json(apiError);
	}
});

// Get specific pet
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			const error: APIError = {
				error: 'Pet ID required',
				message: 'Please provide a valid pet ID',
			};
			return res.status(400).json(error);
		}

		console.log(`Fetching pet ${id} from PIMS...`);

		const pet = await PIMSService.getPetById(id);

		if (!pet) {
			const error: APIError = {
				error: 'Pet not found',
				message: `Pet with ID ${id} not found`,
			};
			return res.status(404).json(error);
		}

		console.log(`Successfully fetched pet ${id} from PIMS`);

		return res.json(pet);
	} catch (error) {
		console.error(`Get pet ${req.params.id} error:`, error);

		const apiError: APIError = {
			error: 'Failed to fetch pet',
			message: error instanceof Error ? error.message : 'Unknown error',
		};

		return res.status(502).json(apiError);
	}
});

export default router;
