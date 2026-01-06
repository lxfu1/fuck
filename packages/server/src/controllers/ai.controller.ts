import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import type { AIChatRequest } from '@insight-studio/shared';

export class AIController {
  private service = new AIService();

  chat = async (req: Request, res: Response) => {
    try {
      const request = req.body as AIChatRequest;
      const response = await this.service.chat(request);
      
      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CHAT_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
