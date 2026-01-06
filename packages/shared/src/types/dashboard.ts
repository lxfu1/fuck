import { ChartConfig } from './chart';

/**
 * 看板布局项
 */
export interface DashboardItem {
  id: string;
  chartId: string;
  config: ChartConfig;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
  title?: string;
  description?: string;
}

/**
 * 看板配置
 */
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  items: DashboardItem[];
  layout: {
    cols: number;
    rowHeight: number;
    breakpoints?: Record<string, number>;
  };
  theme?: {
    colorScheme: 'light' | 'dark';
    primaryColor?: string;
    backgroundColor?: string;
  };
  settings: {
    refreshInterval?: number;
    allowExport: boolean;
    allowShare: boolean;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 看板模板
 */
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'finance' | 'operations' | 'custom';
  thumbnail?: string;
  dashboard: Omit<Dashboard, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>;
  tags: string[];
  usageCount: number;
  rating?: number;
  isOfficial: boolean;
}

/**
 * 看板分享配置
 */
export interface DashboardShare {
  id: string;
  dashboardId: string;
  type: 'public' | 'private' | 'password';
  password?: string;
  expiresAt?: Date;
  allowDownload: boolean;
  allowComment: boolean;
  shareUrl: string;
  viewCount: number;
  createdAt: Date;
}

/**
 * 看板导出配置
 */
export interface DashboardExportConfig {
  format: 'pdf' | 'png' | 'svg' | 'html' | 'json';
  quality?: 'low' | 'medium' | 'high';
  includeData?: boolean;
  includeInsights?: boolean;
}
