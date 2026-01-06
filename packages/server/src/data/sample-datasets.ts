/**
 * Sample datasets for demonstration and testing
 */

export const sampleDatasets = {
  salesTrend: {
    name: '销售趋势数据',
    description: '过去12个月的销售数据',
    data: [
      { month: '2024-01', sales: 12500, orders: 245, avgOrderValue: 51.02 },
      { month: '2024-02', sales: 13200, orders: 268, avgOrderValue: 49.25 },
      { month: '2024-03', sales: 15800, orders: 312, avgOrderValue: 50.64 },
      { month: '2024-04', sales: 14300, orders: 289, avgOrderValue: 49.48 },
      { month: '2024-05', sales: 16900, orders: 334, avgOrderValue: 50.60 },
      { month: '2024-06', sales: 18200, orders: 358, avgOrderValue: 50.84 },
      { month: '2024-07', sales: 19500, orders: 385, avgOrderValue: 50.65 },
      { month: '2024-08', sales: 18800, orders: 371, avgOrderValue: 50.67 },
      { month: '2024-09', sales: 20100, orders: 398, avgOrderValue: 50.50 },
      { month: '2024-10', sales: 21500, orders: 425, avgOrderValue: 50.59 },
      { month: '2024-11', sales: 22800, orders: 452, avgOrderValue: 50.44 },
      { month: '2024-12', sales: 25300, orders: 498, avgOrderValue: 50.80 },
    ],
  },

  regionalSales: {
    name: '区域销售对比',
    description: '各地区销售业绩对比',
    data: [
      { region: '华北', sales: 185000, growth: 12.5, customers: 3250 },
      { region: '华东', sales: 234000, growth: 18.3, customers: 4180 },
      { region: '华南', sales: 198000, growth: 15.7, customers: 3520 },
      { region: '华中', sales: 156000, growth: 9.8, customers: 2890 },
      { region: '西北', sales: 98000, growth: 7.2, customers: 1850 },
      { region: '西南', sales: 145000, growth: 11.4, customers: 2670 },
      { region: '东北', sales: 112000, growth: 6.5, customers: 2100 },
    ],
  },

  productCategory: {
    name: '产品类别占比',
    description: '各产品类别销售占比',
    data: [
      { category: '电子产品', value: 358000, percentage: 35.8 },
      { category: '服装', value: 245000, percentage: 24.5 },
      { category: '食品', value: 156000, percentage: 15.6 },
      { category: '家居', value: 132000, percentage: 13.2 },
      { category: '图书', value: 78000, percentage: 7.8 },
      { category: '其他', value: 31000, percentage: 3.1 },
    ],
  },

  customerSegment: {
    name: '客户分群分析',
    description: '不同客户群体的价值分析',
    data: [
      { segment: 'VIP客户', count: 850, revenue: 425000, avgValue: 500, retention: 95 },
      { segment: '活跃客户', count: 3200, revenue: 640000, avgValue: 200, retention: 78 },
      { segment: '普通客户', count: 8500, revenue: 510000, avgValue: 60, retention: 45 },
      { segment: '新客户', count: 4200, revenue: 168000, avgValue: 40, retention: 25 },
      { segment: '流失客户', count: 2100, revenue: 0, avgValue: 0, retention: 0 },
    ],
  },

  trafficSource: {
    name: '流量来源分析',
    description: '网站流量来源渠道分析',
    data: [
      { source: '搜索引擎', visitors: 45200, conversions: 2260, conversionRate: 5.0 },
      { source: '社交媒体', visitors: 32500, conversions: 975, conversionRate: 3.0 },
      { source: '直接访问', visitors: 28900, conversions: 1734, conversionRate: 6.0 },
      { source: '邮件营销', visitors: 15600, conversions: 936, conversionRate: 6.0 },
      { source: '推荐链接', visitors: 12300, conversions: 492, conversionRate: 4.0 },
      { source: '广告投放', visitors: 8900, conversions: 534, conversionRate: 6.0 },
    ],
  },

  userBehavior: {
    name: '用户行为漏斗',
    description: '用户转化漏斗数据',
    data: [
      { stage: '访问首页', users: 100000, percentage: 100 },
      { stage: '浏览商品', users: 65000, percentage: 65 },
      { stage: '加入购物车', users: 25000, percentage: 25 },
      { stage: '进入结算', users: 12000, percentage: 12 },
      { stage: '完成支付', users: 8500, percentage: 8.5 },
    ],
  },

  performanceMetrics: {
    name: '系统性能指标',
    description: '服务器性能监控数据',
    data: [
      { time: '00:00', cpu: 25, memory: 45, requests: 1250, responseTime: 85 },
      { time: '04:00', cpu: 18, memory: 42, requests: 850, responseTime: 72 },
      { time: '08:00', cpu: 45, memory: 58, requests: 3200, responseTime: 125 },
      { time: '12:00', cpu: 68, memory: 72, requests: 5800, responseTime: 186 },
      { time: '16:00', cpu: 52, memory: 65, requests: 4200, responseTime: 142 },
      { time: '20:00', cpu: 38, memory: 55, requests: 2800, responseTime: 98 },
    ],
  },

  inventoryStatus: {
    name: '库存状态',
    description: '产品库存状态监控',
    data: [
      { product: 'iPhone 15', stock: 1250, sold: 3580, status: 'normal', turnover: 2.86 },
      { product: 'MacBook Pro', stock: 580, sold: 1240, status: 'normal', turnover: 2.14 },
      { product: 'iPad Air', stock: 320, sold: 2100, status: 'low', turnover: 6.56 },
      { product: 'AirPods Pro', stock: 2100, sold: 5800, status: 'normal', turnover: 2.76 },
      { product: 'Apple Watch', stock: 150, sold: 1850, status: 'critical', turnover: 12.33 },
      { product: 'Magic Keyboard', stock: 890, sold: 680, status: 'high', turnover: 0.76 },
    ],
  },

  employeePerformance: {
    name: '员工绩效',
    description: '销售团队绩效数据',
    data: [
      { name: '张三', sales: 285000, target: 250000, achievement: 114, rating: 'A' },
      { name: '李四', sales: 312000, target: 300000, achievement: 104, rating: 'A' },
      { name: '王五', sales: 198000, target: 200000, achievement: 99, rating: 'B' },
      { name: '赵六', sales: 245000, target: 250000, achievement: 98, rating: 'B' },
      { name: '孙七', sales: 168000, target: 200000, achievement: 84, rating: 'C' },
      { name: '周八', sales: 223000, target: 250000, achievement: 89, rating: 'C' },
    ],
  },

  marketingCampaign: {
    name: '营销活动效果',
    description: '各营销活动的ROI分析',
    data: [
      { campaign: '双11大促', cost: 150000, revenue: 850000, roi: 5.67, participants: 12500 },
      { campaign: '会员日', cost: 80000, revenue: 420000, roi: 5.25, participants: 8200 },
      { campaign: '新品发布', cost: 120000, revenue: 580000, roi: 4.83, participants: 9800 },
      { campaign: '周年庆', cost: 200000, revenue: 950000, roi: 4.75, participants: 15600 },
      { campaign: '清仓促销', cost: 60000, revenue: 280000, roi: 4.67, participants: 6500 },
    ],
  },
};

export type SampleDatasetKey = keyof typeof sampleDatasets;

export function getSampleDataset(key: SampleDatasetKey) {
  return sampleDatasets[key];
}

export function getAllSampleDatasets() {
  return Object.entries(sampleDatasets).map(([key, value]) => ({
    key,
    name: value.name,
    description: value.description,
    recordCount: value.data.length,
  }));
}
