/**
 * 洞察类型
 */
export type InsightType = 
  | 'trend'           // 趋势洞察
  | 'anomaly'         // 异常洞察
  | 'correlation'     // 相关性洞察
  | 'distribution'    // 分布洞察
  | 'comparison'      // 对比洞察
  | 'prediction';     // 预测洞察

/**
 * 洞察严重程度
 */
export type InsightSeverity = 'info' | 'warning' | 'critical';

/**
 * 洞察接口
 */
export interface Insight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  evidence: {
    metric: string;
    value: number;
    change?: number;
    changePercent?: number;
  };
  recommendations: string[];
  chartId?: string;
  createdAt: Date;
}

/**
 * 趋势预测配置
 */
export interface PredictionConfig {
  period: '1m' | '3m' | '6m' | '1y';
  algorithm: 'arima' | 'lstm' | 'prophet' | 'linear';
  confidence: number;
}

/**
 * 趋势预测结果
 */
export interface PredictionResult {
  id: string;
  config: PredictionConfig;
  predictions: Array<{
    date: Date;
    value: number;
    confidence: {
      lower: number;
      upper: number;
    };
  }>;
  accuracy?: number;
  model: {
    name: string;
    parameters: Record<string, unknown>;
  };
  createdAt: Date;
}

/**
 * 异常检测结果
 */
export interface AnomalyDetection {
  id: string;
  point: {
    index: number;
    value: number;
    date?: Date;
    label?: string;
  };
  expected: {
    value: number;
    range: {
      min: number;
      max: number;
    };
  };
  deviation: number;
  severity: InsightSeverity;
  reason: string;
  suggestions: string[];
}

/**
 * 决策建议报告
 */
export interface DecisionReport {
  id: string;
  title: string;
  summary: string;
  insights: Insight[];
  predictions?: PredictionResult[];
  anomalies?: AnomalyDetection[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    action: string;
    impact: string;
    effort: string;
  }>;
  metadata: {
    dataRange: {
      start: Date;
      end: Date;
    };
    metrics: string[];
    generatedBy: string;
  };
  createdAt: Date;
}

/**
 * 解释模式（Explanation Schema）
 */
export interface ExplanationSchema {
  chartId: string;
  narrative: {
    title: string;
    summary: string;
    keyFindings: string[];
    context: string;
  };
  insights: Insight[];
  dataStory: {
    whatHappened: string;
    whyItMatters: string;
    whatToDoNext: string[];
  };
  metadata: {
    dataQuality: 'high' | 'medium' | 'low';
    confidence: number;
    limitations: string[];
  };
}
