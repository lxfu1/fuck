import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

export class TemplateController {
  private service = new TemplateService();

  list = async (req: Request, res: Response) => {
    try {
      const templates = await this.service.listTemplates();
      
      res.json({
        success: true,
        data: templates,
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

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const template = await this.service.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found',
          },
        });
      }
      
      res.json({
        success: true,
        data: template,
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

  create = async (req: Request, res: Response) => {
    try {
      const template = await this.service.createTemplate(req.body);
      
      res.json({
        success: true,
        data: template,
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
}
