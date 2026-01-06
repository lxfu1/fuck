import type {
  PredictTrendRequest,
  PredictionResult,
  AnomalyDetection,
  GenerateInsightRequest,
  GenerateInsightResponse,
  DecisionReport,
} from '@insight-studio/shared';
import { generateId } from '@insight-studio/shared';

export class InsightService {
  async predictTrend(request: PredictTrendRequest): Promise<PredictionResult> {
    const predictions = this.generatePredictions(request.config.period);

    return {
      id: generateId('pred'),
      config: request.config,
      predictions,
      accuracy: 0.85,
      model: {
        name: request.config.algorithm,
        parameters: {
          period: request.config.period,
          confidence: request.config.confidence,
        },
      },
      createdAt: new Date(),
    };
  }

  async detectAnomalies(chartId: string): Promise<AnomalyDetection[]> {
    return [
      {
        id: generateId('anomaly'),
        point: {
          index: 5,
          value: 250,
          date: new Date('2024-06-01'),
          label: 'June',
        },
        expected: {
          value: 180,
          range: { min: 160, max: 200 },
        },
        deviation: 38.9,
        severity: 'warning',
        reason: 'Value significantly higher than expected range',
        suggestions: [
          'Verify data accuracy',
          'Check for external events affecting metrics',
          'Review data collection process',
        ],
      },
    ];
  }

  async generateReport(request: GenerateInsightRequest): Promise<GenerateInsightResponse> {
    const report: DecisionReport = {
      id: generateId('report'),
      title: 'Business Intelligence Report',
      summary: 'Comprehensive analysis of selected metrics and charts',
      insights: [
        {
          id: generateId('insight'),
          type: 'trend',
          severity: 'info',
          title: 'Positive Growth Trend',
          description: 'Metrics show consistent upward trajectory',
          evidence: {
            metric: 'revenue',
            value: 200,
            change: 50,
            changePercent: 33.3,
          },
          recommendations: [
            'Maintain current strategies',
            'Allocate additional resources to high-performing areas',
          ],
          createdAt: new Date(),
        },
      ],
      predictions: undefined,
      anomalies: undefined,
      recommendations: [
        {
          priority: 'high',
          category: 'Growth',
          action: 'Expand successful initiatives',
          impact: 'Expected 30% increase in efficiency',
          effort: 'Medium',
        },
        {
          priority: 'medium',
          category: 'Optimization',
          action: 'Streamline underperforming processes',
          impact: 'Cost reduction of 15%',
          effort: 'Low',
        },
      ],
      metadata: {
        dataRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-06-30'),
        },
        metrics: request.metrics || ['revenue', 'growth', 'efficiency'],
        generatedBy: 'Insight Studio AI',
      },
      createdAt: new Date(),
    };

    return { report };
  }

  private generatePredictions(period: string) {
    const periodMap: Record<string, number> = {
      '1m': 1,
      '3m': 3,
      '6m': 6,
      '1y': 12,
    };

    const months = periodMap[period] || 3;
    const predictions = [];
    let baseValue = 200;

    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);

      baseValue += Math.random() * 20 + 5;
      const confidence = 0.85;

      predictions.push({
        date,
        value: Math.round(baseValue),
        confidence: {
          lower: Math.round(baseValue * (1 - confidence)),
          upper: Math.round(baseValue * (1 + confidence)),
        },
      });
    }

    return predictions;
  }
}
