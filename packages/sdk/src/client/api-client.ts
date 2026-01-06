import type {
  ApiResponse,
  GenerateChartRequest,
  GenerateChartResponse,
  PredictTrendRequest,
  PredictionResult,
  GenerateInsightRequest,
  GenerateInsightResponse,
  AIChatRequest,
  AIChatResponse,
  Dashboard,
  CreateDashboardRequest,
  UpdateDashboardRequest,
  DashboardTemplate,
  MonitoringMetrics,
  ChartResult,
} from '@insight-studio/shared';

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class InsightStudioClient {
  private config: ClientConfig;
  private baseUrl: string;

  constructor(config: ClientConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.insight-studio.ai';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      ...this.config.headers,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async generateChart(request: GenerateChartRequest): Promise<GenerateChartResponse> {
    const response = await this.request<GenerateChartResponse>('/api/charts/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to generate chart');
    }
    
    return response.data;
  }

  async getChart(id: string): Promise<ChartResult> {
    const response = await this.request<ChartResult>(`/api/charts/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get chart');
    }
    
    return response.data;
  }

  async optimizeChart(id: string): Promise<ChartResult> {
    const response = await this.request<ChartResult>(`/api/charts/${id}/optimize`, {
      method: 'POST',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to optimize chart');
    }
    
    return response.data;
  }

  async predictTrend(request: PredictTrendRequest): Promise<PredictionResult> {
    const response = await this.request<PredictionResult>('/api/insights/predict', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to predict trend');
    }
    
    return response.data;
  }

  async generateInsight(request: GenerateInsightRequest): Promise<GenerateInsightResponse> {
    const response = await this.request<GenerateInsightResponse>('/api/insights/report', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to generate insight');
    }
    
    return response.data;
  }

  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    const response = await this.request<AIChatResponse>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to chat');
    }
    
    return response.data;
  }

  async createDashboard(request: CreateDashboardRequest): Promise<Dashboard> {
    const response = await this.request<Dashboard>('/api/dashboards', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create dashboard');
    }
    
    return response.data;
  }

  async getDashboard(id: string): Promise<Dashboard> {
    const response = await this.request<Dashboard>(`/api/dashboards/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get dashboard');
    }
    
    return response.data;
  }

  async updateDashboard(id: string, request: UpdateDashboardRequest): Promise<Dashboard> {
    const response = await this.request<Dashboard>(`/api/dashboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update dashboard');
    }
    
    return response.data;
  }

  async listTemplates(): Promise<DashboardTemplate[]> {
    const response = await this.request<DashboardTemplate[]>('/api/templates');
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to list templates');
    }
    
    return response.data;
  }

  async getMonitoringMetrics(): Promise<MonitoringMetrics> {
    const response = await this.request<MonitoringMetrics>('/api/monitoring/metrics');
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get monitoring metrics');
    }
    
    return response.data;
  }
}
