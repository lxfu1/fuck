import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoring.service';

export class MonitoringController {
  private service = new MonitoringService();

  getMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await this.service.getMetrics();
      
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'METRICS_FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  health = async (req: Request, res: Response) => {
    try {
      const health = await this.service.checkHealth();
      
      res.json({
        success: true,
        data: health,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
