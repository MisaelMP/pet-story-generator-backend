import { z } from 'zod';

// Request validation schemas
export const storyRequestSchema = z.object({
	prompt: z.string().min(50).max(5000),
	parameters: z.object({
		maxTokens: z.number().min(100).max(2000),
		temperature: z.number().min(0).max(1),
		topP: z.number().min(0).max(1),
	}),
	options: z.object({
		includeSuggestions: z.boolean(),
		moderationCheck: z.boolean(),
		saveToXano: z.boolean().optional(),
		petId: z.string().optional(),
		// More specific typing for form data - common fields we expect
		formData: z
			.record(
				z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
			)
			.optional(),
	}),
});

export type StoryRequest = z.infer<typeof storyRequestSchema>;

// OpenAI response types
export interface OpenAIResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

// Medical history entry type for better PIMS typing
export interface MedicalHistoryEntry {
	date?: string;
	condition?: string;
	treatment?: string;
	notes?: string;
	veterinarian?: string;
	[key: string]: unknown; // For unknown medical fields
}

// PIMS types
export interface PIMSPet {
	id: string;
	name: string;
	species?: string;
	breed?: string;
	age?: number;
	weight?: number;
	photo?: string;
	owner_id?: string;
	owner_name?: string;
	owner_email?: string;
	owner_phone?: string;
	medical_history?: MedicalHistoryEntry[];
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown; // For unknown PIMS fields
}

// Xano types
export interface XanoStoryPayload {
	pims_pet_id: string;
	title: string;
	content: string;
	tone: string;
	suggested_goal: number;
	key_points: string[];
	form_data: Record<string, string | number | boolean | string[]>;
}

// More specific error types
export interface APIError {
	error: string;
	message?: string;
	details?: string | object; // More specific than unknown
}

// Story response structure for better type safety in routes
export interface StoryResponse {
	title: string;
	content: string;
	tone: string;
	suggestedGoal: number;
	keyPoints: string[];
}

// Add validation schema for story response parsing
export const storyResponseSchema = z.object({
	title: z.string().default('Generated Pet Story'),
	content: z.string(),
	tone: z.string().default('heartwarming'),
	suggestedGoal: z.number().default(5000),
	keyPoints: z.array(z.string()).default([]),
});

export type StoryResponseData = z.infer<typeof storyResponseSchema>;
