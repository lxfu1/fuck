import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { ChartController } from '../controllers/chart.controller';

const router: RouterType = Router();
const controller = new ChartController();

router.post('/generate', controller.generate);
router.get('/:id', controller.getById);
router.get('/', controller.list);
router.delete('/:id', controller.delete);
router.post('/:id/optimize', controller.optimize);
router.post('/:id/export', controller.export);

export { router as chartRoutes };
