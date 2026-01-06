import { Request, Response } from 'express';
import { ChartService } from '../services/chart.service';
import type { GenerateChartRequest } from '@insight-studio/shared';

export class ChartController {
  private service = new ChartService();

  generate = async (req: Request, res: Response) => {
    try {
      const request = req.body as GenerateChartRequest;
      const result = await this.service.generateChart(request);
      
      res.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date(),
          requestId: req.headers['x-request-id'] || 'unknown',
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CHART_GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const chart = await this.service.getChart(id);
      
      if (!chart) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CHART_NOT_FOUND',
            message: 'Chart not found',
          },
        });
      }
      
      res.json({
        success: true,
        data: chart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const charts = await this.service.listCharts();
      
      res.json({
        success: true,
        data: charts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteChart(id);
      
      res.json({
        success: true,
        data: { id },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  optimize = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const optimized = await this.service.optimizeChart(id);
      
      res.json({
        success: true,
        data: optimized,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'OPTIMIZATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  export = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { format } = req.body;
      const exported = await this.service.exportChart(id, format);
      
      res.json({
        success: true,
        data: exported,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
