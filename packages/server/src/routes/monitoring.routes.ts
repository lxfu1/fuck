import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { MonitoringController } from '../controllers/monitoring.controller';

const router: RouterType = Router();
const controller = new MonitoringController();

router.get('/metrics', controller.getMetrics);
router.get('/health', controller.health);

export { router as monitoringRoutes };
