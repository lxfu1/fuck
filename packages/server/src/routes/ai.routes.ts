import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { AIController } from '../controllers/ai.controller';

const router: RouterType = Router();
const controller = new AIController();

router.post('/chat', controller.chat);

export { router as aiRoutes };
