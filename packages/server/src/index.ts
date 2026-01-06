import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createLogger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { chartRoutes } from './routes/chart.routes';
import { insightRoutes } from './routes/insight.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { templateRoutes } from './routes/template.routes';
import { aiRoutes } from './routes/ai.routes';
import { monitoringRoutes } from './routes/monitoring.routes';
import { dataRoutes } from './routes/data.routes';

dotenv.config();

const app: Express = express();
const logger = createLogger();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/charts', chartRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/data', dataRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Insight Studio Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
