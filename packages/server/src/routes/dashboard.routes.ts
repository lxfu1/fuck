import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router: RouterType = Router();
const controller = new DashboardController();

router.post('/', controller.create);
router.get('/:id', controller.getById);
router.get('/', controller.list);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/share', controller.share);
router.post('/:id/export', controller.export);

export { router as dashboardRoutes };
