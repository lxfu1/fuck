import { ChartType, ChartCategory, ChartLibrary } from './types';

/**
 * 图表类型映射到库
 */
export const CHART_TYPE_TO_LIBRARY: Record<ChartType, ChartLibrary> = {
  // G2Plot
  'line': 'g2plot',
  'area': 'g2plot',
  'column': 'g2plot',
  'bar': 'g2plot',
  'pie': 'g2plot',
  'donut': 'g2plot',
  'rose': 'g2plot',
  'scatter': 'g2plot',
  'bubble': 'g2plot',
  'heatmap': 'g2plot',
  'box': 'g2plot',
  'violin': 'g2plot',
  'histogram': 'g2plot',
  'gauge': 'g2plot',
  'liquid': 'g2plot',
  'bullet': 'g2plot',
  'funnel': 'g2plot',
  'radar': 'g2plot',
  'waterfall': 'g2plot',
  'sankey': 'g2plot',
  'sunburst': 'g2plot',
  'treemap': 'g2plot',
  'circlepacking': 'g2plot',
  'dual-axes': 'g2plot',
  'grouped-column': 'g2plot',
  'stacked-column': 'g2plot',
  'percent-stacked-column': 'g2plot',
  'grouped-bar': 'g2plot',
  'stacked-bar': 'g2plot',
  'percent-stacked-bar': 'g2plot',
  'stacked-area': 'g2plot',
  'percent-stacked-area': 'g2plot',
  'range-column': 'g2plot',
  'range-bar': 'g2plot',
  'range-area': 'g2plot',
  'multi-view': 'g2plot',
  'mix': 'g2plot',
  // G6
  'force-graph': 'g6',
  'dagre': 'g6',
  'radial': 'g6',
  'circular': 'g6',
  'tree': 'g6',
  'dendrogram': 'g6',
  'indented-tree': 'g6',
  'mindmap': 'g6',
  'organization-chart': 'g6',
  // X6
  'flowchart': 'x6',
  'bpmn': 'x6',
  'er-diagram': 'x6',
  'uml': 'x6',
  // L7
  'point-map': 'l7',
  'heatmap-map': 'l7',
  'choropleth-map': 'l7',
  'hex-map': 'l7',
  'arc-map': 'l7',
  'path-map': 'l7',
  // S2
  'pivot-table': 's2',
  'table': 's2',
  // F2
  'mobile-line': 'f2',
  'mobile-area': 'f2',
  'mobile-column': 'f2',
};

/**
 * 图表类型分类映射
 */
export const CHART_TYPE_TO_CATEGORY: Record<ChartType, ChartCategory> = {
  'line': 'trend',
  'area': 'trend',
  'column': 'comparison',
  'bar': 'comparison',
  'pie': 'composition',
  'donut': 'composition',
  'rose': 'composition',
  'scatter': 'relationship',
  'bubble': 'relationship',
  'heatmap': 'distribution',
  'box': 'distribution',
  'violin': 'distribution',
  'histogram': 'distribution',
  'gauge': 'comparison',
  'liquid': 'comparison',
  'bullet': 'comparison',
  'funnel': 'flow',
  'radar': 'comparison',
  'waterfall': 'comparison',
  'sankey': 'flow',
  'sunburst': 'hierarchy',
  'treemap': 'hierarchy',
  'circlepacking': 'hierarchy',
  'dual-axes': 'trend',
  'grouped-column': 'comparison',
  'stacked-column': 'composition',
  'percent-stacked-column': 'composition',
  'grouped-bar': 'comparison',
  'stacked-bar': 'composition',
  'percent-stacked-bar': 'composition',
  'stacked-area': 'composition',
  'percent-stacked-area': 'composition',
  'range-column': 'comparison',
  'range-bar': 'comparison',
  'range-area': 'trend',
  'multi-view': 'comparison',
  'mix': 'comparison',
  'force-graph': 'network',
  'dagre': 'hierarchy',
  'radial': 'hierarchy',
  'circular': 'network',
  'tree': 'hierarchy',
  'dendrogram': 'hierarchy',
  'indented-tree': 'hierarchy',
  'mindmap': 'hierarchy',
  'organization-chart': 'hierarchy',
  'flowchart': 'flow',
  'bpmn': 'flow',
  'er-diagram': 'relationship',
  'uml': 'relationship',
  'point-map': 'geographic',
  'heatmap-map': 'geographic',
  'choropleth-map': 'geographic',
  'hex-map': 'geographic',
  'arc-map': 'geographic',
  'path-map': 'geographic',
  'pivot-table': 'comparison',
  'table': 'comparison',
  'mobile-line': 'trend',
  'mobile-area': 'trend',
  'mobile-column': 'comparison',
};

/**
 * 支持的文件类型
 */
export const SUPPORTED_FILE_TYPES = {
  csv: 'text/csv',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
} as const;

/**
 * 最大文件大小（字节）
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  CHARTS: {
    GENERATE: '/api/charts/generate',
    GET: '/api/charts/:id',
    LIST: '/api/charts',
    DELETE: '/api/charts/:id',
    OPTIMIZE: '/api/charts/:id/optimize',
    EXPORT: '/api/charts/:id/export',
  },
  INSIGHTS: {
    PREDICT: '/api/insights/predict',
    DETECT_ANOMALIES: '/api/insights/anomalies',
    GENERATE_REPORT: '/api/insights/report',
  },
  DASHBOARDS: {
    CREATE: '/api/dashboards',
    GET: '/api/dashboards/:id',
    LIST: '/api/dashboards',
    UPDATE: '/api/dashboards/:id',
    DELETE: '/api/dashboards/:id',
    SHARE: '/api/dashboards/:id/share',
    EXPORT: '/api/dashboards/:id/export',
  },
  TEMPLATES: {
    LIST: '/api/templates',
    GET: '/api/templates/:id',
    CREATE: '/api/templates',
  },
  AI: {
    CHAT: '/api/ai/chat',
  },
  MONITORING: {
    METRICS: '/api/monitoring/metrics',
    HEALTH: '/api/monitoring/health',
  },
  ANALYTICS: {
    TRACK: '/api/analytics/track',
  },
} as const;

/**
 * 默认主题配置
 */
export const DEFAULT_THEME = {
  colorScheme: 'light' as const,
  primaryColor: '#1890ff',
  colors: [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E86452',
    '#6DC8EC',
    '#945FB9',
    '#FF9845',
    '#1E9493',
    '#FF99C3',
  ],
};

/**
 * 预测算法配置
 */
export const PREDICTION_ALGORITHMS = {
  arima: {
    name: 'ARIMA',
    description: '自回归移动平均模型，适合时间序列预测',
  },
  lstm: {
    name: 'LSTM',
    description: '长短期记忆网络，适合复杂的非线性时间序列',
  },
  prophet: {
    name: 'Prophet',
    description: 'Facebook Prophet，适合有季节性和节假日影响的时间序列',
  },
  linear: {
    name: '线性回归',
    description: '简单的线性趋势预测',
  },
} as const;
