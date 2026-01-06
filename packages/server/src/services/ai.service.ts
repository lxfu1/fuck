import type { AIChatRequest, AIChatResponse } from '@insight-studio/shared';

interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

interface GLMResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  private model: string = 'glm-4';

  constructor() {
    this.apiKey = process.env.GLM_API_KEY || process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️  GLM_API_KEY or OPENAI_API_KEY not set. AI features will use fallback responses.');
    }
  }

  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    if (!this.apiKey) {
      return this.getFallbackResponse(request.message);
    }

    try {
      const messages: GLMMessage[] = [
        {
          role: 'system',
          content: `你是 Insight Studio 的 AI 助手，专门帮助用户进行数据可视化和分析。你的能力包括：
1. 帮助用户生成各种类型的数据可视化图表（支持 60+ 种图表类型）
2. 创建和管理数据看板
3. 进行数据分析和洞察
4. 提供数据趋势预测
5. 检测数据异常

请用简洁、专业的语言回答用户问题，并在适当时候建议用户创建图表或看板。`,
        },
      ];

      if (request.context?.history) {
        for (const msg of request.context.history) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          });
        }
      }

      messages.push({
        role: 'user',
        content: request.message,
      });

      const glmRequest: GLMRequest = {
        model: this.model,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(glmRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GLM API Error:', response.status, errorText);
        throw new Error(`GLM API request failed: ${response.statusText}`);
      }

      const glmResponse = await response.json() as GLMResponse;
      const aiMessage = glmResponse.choices[0]?.message?.content || '';

      return this.parseAIResponse(aiMessage, request);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(request.message);
    }
  }

  private parseAIResponse(aiMessage: string, request: AIChatRequest): AIChatResponse {
    const message = request.message.toLowerCase();
    const response: AIChatResponse = {
      message: aiMessage,
      action: { type: 'none' },
      suggestions: [],
    };

    if (message.includes('图表') || message.includes('chart') || message.includes('可视化')) {
      response.action = {
        type: 'create_chart',
        payload: {
          suggestedQuery: request.message,
        },
      };
      response.suggestions = [
        '展示销售趋势',
        '对比各地区业绩',
        '查看用户增长情况',
      ];
    } else if (message.includes('看板') || message.includes('dashboard')) {
      response.action = {
        type: 'update_dashboard',
      };
      response.suggestions = [
        '创建新看板',
        '添加图表到看板',
        '调整看板布局',
      ];
    } else if (message.includes('洞察') || message.includes('insight') || message.includes('分析') || message.includes('预测')) {
      response.action = {
        type: 'generate_insight',
      };
      response.suggestions = [
        '生成趋势预测',
        '检测数据异常',
        '创建决策报告',
      ];
    } else {
      response.suggestions = [
        '生成图表',
        '创建看板',
        '数据分析',
      ];
    }

    return response;
  }

  private getFallbackResponse(message: string): AIChatResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('图表') || lowerMessage.includes('chart')) {
      return {
        message: '我可以帮你生成图表。请描述你想要的图表类型和数据，例如："展示过去6个月的销售趋势"',
        action: {
          type: 'create_chart',
          payload: {
            suggestedQuery: message,
          },
        },
        suggestions: [
          '展示销售趋势',
          '对比各地区业绩',
          '查看用户增长情况',
        ],
      };
    } else if (lowerMessage.includes('看板') || lowerMessage.includes('dashboard')) {
      return {
        message: '我可以帮你创建或调整看板。你想做什么操作？',
        action: {
          type: 'update_dashboard',
        },
        suggestions: [
          '创建新看板',
          '添加图表到看板',
          '调整看板布局',
        ],
      };
    } else if (lowerMessage.includes('洞察') || lowerMessage.includes('insight') || lowerMessage.includes('分析')) {
      return {
        message: '我可以为你生成数据洞察报告，分析趋势、异常和提供决策建议。',
        action: {
          type: 'generate_insight',
        },
        suggestions: [
          '生成趋势预测',
          '检测数据异常',
          '创建决策报告',
        ],
      };
    } else {
      return {
        message: '你好！我是 Insight Studio AI 助手。我可以帮你：\n1. 生成数据可视化图表\n2. 创建和管理看板\n3. 分析数据并提供洞察\n\n你想做什么呢？',
        action: {
          type: 'none',
        },
        suggestions: [
          '生成图表',
          '创建看板',
          '数据分析',
        ],
      };
    }
  }
}
