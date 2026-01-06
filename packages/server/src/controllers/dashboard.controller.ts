import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import type { CreateDashboardRequest, UpdateDashboardRequest } from '@insight-studio/shared';

export class DashboardController {
  private service = new DashboardService();

  create = async (req: Request, res: Response) => {
    try {
      const request = req.body as CreateDashboardRequest;
      const dashboard = await this.service.createDashboard(request);
      
      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dashboard = await this.service.getDashboard(id);
      
      if (!dashboard) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DASHBOARD_NOT_FOUND',
            message: 'Dashboard not found',
          },
        });
      }
      
      res.json({
        success: true,
        data: dashboard,
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
      const dashboards = await this.service.listDashboards();
      
      res.json({
        success: true,
        data: dashboards,
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

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = req.body as UpdateDashboardRequest;
      const dashboard = await this.service.updateDashboard(id, request);
      
      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteDashboard(id);
      
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

  share = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const share = await this.service.shareDashboard(id, req.body);
      
      res.json({
        success: true,
        data: share,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SHARE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  export = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { format } = req.body;
      const exported = await this.service.exportDashboard(id, format);
      
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
