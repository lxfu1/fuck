import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        });
      } else {
        next(error);
      }
    }
  };
}

export const schemas = {
  generateChart: z.object({
    query: z.string().min(1, 'Query is required'),
    dataSource: z.optional(
      z.object({
        type: z.enum(['file', 'url', 'inline']),
        content: z.optional(z.any()),
        url: z.optional(z.string().url()),
      })
    ),
    preferences: z.optional(
      z.object({
        library: z.optional(z.string()),
        theme: z.optional(z.string()),
        colorScheme: z.optional(z.array(z.string())),
      })
    ),
    enableWebSearch: z.optional(z.boolean()),
  }),

  predictTrend: z.object({
    chartId: z.string().min(1, 'Chart ID is required'),
    config: z.object({
      period: z.enum(['1m', '3m', '6m', '1y']),
      algorithm: z.enum(['arima', 'lstm', 'prophet', 'linear']),
      confidence: z.number().min(0).max(1),
    }),
  }),

  generateInsight: z.object({
    chartIds: z.array(z.string()).min(1, 'At least one chart ID is required'),
    dataRange: z.optional(
      z.object({
        start: z.string().or(z.date()),
        end: z.string().or(z.date()),
      })
    ),
    metrics: z.optional(z.array(z.string())),
  }),

  createDashboard: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.optional(z.string()),
    templateId: z.optional(z.string()),
  }),

  updateDashboard: z.object({
    name: z.optional(z.string().min(1)),
    description: z.optional(z.string()),
    items: z.optional(z.array(z.any())),
    layout: z.optional(z.any()),
    theme: z.optional(z.any()),
    settings: z.optional(z.any()),
  }),

  aiChat: z.object({
    message: z.string().min(1, 'Message is required'),
    context: z.optional(
      z.object({
        dashboardId: z.optional(z.string()),
        chartId: z.optional(z.string()),
        history: z.optional(
          z.array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          )
        ),
      })
    ),
  }),
};
