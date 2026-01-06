import type { AIChatRequest, AIChatResponse } from '@insight-studio/shared';

export class AIService {
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    const message = request.message.toLowerCase();
    
    let response: AIChatResponse;

    if (message.includes('图表') || message.includes('chart')) {
      response = {
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
    } else if (message.includes('看板') || message.includes('dashboard')) {
      response = {
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
    } else if (message.includes('洞察') || message.includes('insight') || message.includes('分析')) {
      response = {
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
      response = {
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

    return response;
  }
}
