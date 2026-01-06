import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { InsightController } from '../controllers/insight.controller';

const router: RouterType = Router();
const controller = new InsightController();

router.post('/predict', controller.predict);
router.post('/anomalies', controller.detectAnomalies);
router.post('/report', controller.generateReport);

export { router as insightRoutes };
