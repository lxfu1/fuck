import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { TemplateController } from '../controllers/template.controller';

const router: RouterType = Router();
const controller = new TemplateController();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);

export { router as templateRoutes };
