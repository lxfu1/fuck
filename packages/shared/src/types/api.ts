import { ChartConfig, ChartRecommendation, ChartResult } from './chart';
import { DecisionReport, ExplanationSchema, PredictionConfig, PredictionResult } from './insight';
import { Dashboard, DashboardTemplate } from './dashboard';

/**
 * API 响应基础接口
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 图表生成请求
 */
export interface GenerateChartRequest {
  query: string;
  dataSource?: {
    type: 'file' | 'url' | 'inline';
    content?: unknown;
    url?: string;
    file?: File;
  };
  preferences?: {
    library?: string;
    theme?: string;
    colorScheme?: string[];
  };
  enableWebSearch?: boolean;
}

/**
 * 图表生成响应
 */
export interface GenerateChartResponse {
  recommendations: ChartRecommendation[];
  selectedChart?: ChartResult;
  explanation?: ExplanationSchema;
}

/**
 * 趋势预测请求
 */
export interface PredictTrendRequest {
  chartId: string;
  config: PredictionConfig;
}

/**
 * 生成洞察报告请求
 */
export interface GenerateInsightRequest {
  chartIds: string[];
  dataRange?: {
    start: Date;
    end: Date;
  };
  metrics?: string[];
}

/**
 * 生成洞察报告响应
 */
export interface GenerateInsightResponse {
  report: DecisionReport;
}

/**
 * 看板操作请求
 */
export interface CreateDashboardRequest {
  name: string;
  description?: string;
  templateId?: string;
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  items?: Dashboard['items'];
  layout?: Dashboard['layout'];
  theme?: Dashboard['theme'];
  settings?: Dashboard['settings'];
}

/**
 * AI 对话请求
 */
export interface AIChatRequest {
  message: string;
  context?: {
    dashboardId?: string;
    chartId?: string;
    history?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  };
}

/**
 * AI 对话响应
 */
export interface AIChatResponse {
  message: string;
  action?: {
    type: 'create_chart' | 'update_dashboard' | 'generate_insight' | 'none';
    payload?: unknown;
  };
  suggestions?: string[];
}

/**
 * 模板查询参数
 */
export interface TemplateQueryParams extends PaginationParams {
  category?: DashboardTemplate['category'];
  tags?: string[];
  search?: string;
}

/**
 * 用户行为事件
 */
export interface UserActionEvent {
  userId?: string;
  sessionId: string;
  action: string;
  target: {
    type: 'chart' | 'dashboard' | 'template';
    id: string;
  };
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * 监控指标
 */
export interface MonitoringMetrics {
  server: {
    cpu: number;
    memory: number;
    uptime: number;
  };
  api: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    requestsPerSecond: number;
  };
  charts: {
    totalGenerated: number;
    averageRenderTime: number;
    successRate: number;
  };
  timestamp: Date;
}
