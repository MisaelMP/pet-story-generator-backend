import { Router } from 'express';
import { StoryController } from '../controllers/storyController';

const router = Router();
const storyController = new StoryController();

// POST /api/generate-story
router.post('/generate-story', (req, res) => {
  storyController.generateStory(req, res);
});

export { router as storyRoutes };
