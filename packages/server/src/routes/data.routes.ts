import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { DataController } from '../controllers/data.controller';

const router: RouterType = Router();
const controller = new DataController();

router.get('/samples', controller.listSamples);
router.get('/samples/:key', controller.getSample);

export { router as dataRoutes };
