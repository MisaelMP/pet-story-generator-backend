import { Request, Response } from 'express';
import { z } from 'zod';
import { StoryService } from '../services/storyService';

const storyRequestSchema = z.object({
  petName: z.string().min(1, 'Pet name is required'),
  petType: z.string().min(1, 'Pet type is required'),
  petBreed: z.string().optional(),
  petAge: z.number().positive().optional(),
  ownerName: z.string().min(1, 'Owner name is required'),
  storyTheme: z.string().optional(),
  storyLength: z.enum(['short', 'medium', 'long']).optional(),
});

export class StoryController {
  private storyService: StoryService;

  constructor() {
    this.storyService = new StoryService();
  }

  async generateStory(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedRequest = storyRequestSchema.parse(req.body);
      
      // Generate story
      const story = await this.storyService.generateStory(validatedRequest);
      
      res.status(200).json(story);
    } catch (error) {
      console.error('Error in generateStory controller:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
        return;
      }
      
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}
