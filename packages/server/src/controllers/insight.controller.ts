import { Request, Response } from 'express';
import { InsightService } from '../services/insight.service';
import type { PredictTrendRequest, GenerateInsightRequest } from '@insight-studio/shared';

export class InsightController {
  private service = new InsightService();

  predict = async (req: Request, res: Response) => {
    try {
      const request = req.body as PredictTrendRequest;
      const prediction = await this.service.predictTrend(request);
      
      res.json({
        success: true,
        data: prediction,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'PREDICTION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  detectAnomalies = async (req: Request, res: Response) => {
    try {
      const { chartId } = req.body;
      const anomalies = await this.service.detectAnomalies(chartId);
      
      res.json({
        success: true,
        data: anomalies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'ANOMALY_DETECTION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  generateReport = async (req: Request, res: Response) => {
    try {
      const request = req.body as GenerateInsightRequest;
      const report = await this.service.generateReport(request);
      
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'REPORT_GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
