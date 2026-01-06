/**
 * AntV 图表库类型
 */
export type ChartLibrary = 'g2plot' | 'g6' | 'x6' | 'l7' | 's2' | 'f2';

/**
 * 图表类型分类
 */
export type ChartCategory = 
  | 'comparison'      // 对比
  | 'trend'           // 趋势
  | 'distribution'    // 分布
  | 'composition'     // 组成
  | 'relationship'    // 关系
  | 'geographic'      // 地理
  | 'hierarchy'       // 层级
  | 'flow'            // 流程
  | 'network';        // 网络

/**
 * 具体图表类型（60+ 图表）
 */
export type ChartType =
  // G2Plot - 统计图表
  | 'line'                // 折线图
  | 'area'                // 面积图
  | 'column'              // 柱状图
  | 'bar'                 // 条形图
  | 'pie'                 // 饼图
  | 'donut'               // 环形图
  | 'rose'                // 玫瑰图
  | 'scatter'             // 散点图
  | 'bubble'              // 气泡图
  | 'heatmap'             // 热力图
  | 'box'                 // 箱线图
  | 'violin'              // 小提琴图
  | 'histogram'           // 直方图
  | 'gauge'               // 仪表盘
  | 'liquid'              // 水波图
  | 'bullet'              // 子弹图
  | 'funnel'              // 漏斗图
  | 'radar'               // 雷达图
  | 'waterfall'           // 瀑布图
  | 'sankey'              // 桑基图
  | 'sunburst'            // 旭日图
  | 'treemap'             // 矩形树图
  | 'circlepacking'       // 圆堆积图
  | 'dual-axes'           // 双轴图
  | 'grouped-column'      // 分组柱状图
  | 'stacked-column'      // 堆叠柱状图
  | 'percent-stacked-column' // 百分比堆叠柱状图
  | 'grouped-bar'         // 分组条形图
  | 'stacked-bar'         // 堆叠条形图
  | 'percent-stacked-bar' // 百分比堆叠条形图
  | 'stacked-area'        // 堆叠面积图
  | 'percent-stacked-area'// 百分比堆叠面积图
  | 'range-column'        // 区间柱状图
  | 'range-bar'           // 区间条形图
  | 'range-area'          // 区间面积图
  | 'multi-view'          // 多视图
  | 'mix'                 // 混合图表
  // G6 - 关系图
  | 'force-graph'         // 力导向图
  | 'dagre'               // 层次图
  | 'radial'              // 辐射图
  | 'circular'            // 环形布局
  | 'tree'                // 树图
  | 'dendrogram'          // 生态树
  | 'indented-tree'       // 缩进树
  | 'mindmap'             // 脑图
  | 'organization-chart'  // 组织架构图
  // X6 - 流程图/拓扑图
  | 'flowchart'           // 流程图
  | 'bpmn'                // BPMN
  | 'er-diagram'          // ER 图
  | 'uml'                 // UML 图
  // L7 - 地理可视化
  | 'point-map'           // 点地图
  | 'heatmap-map'         // 热力地图
  | 'choropleth-map'      // 分级统计地图
  | 'hex-map'             // 蜂窝地图
  | 'arc-map'             // 弧线地图
  | 'path-map'            // 路径地图
  // S2 - 表格
  | 'pivot-table'         // 透视表
  | 'table'               // 明细表
  // F2 - 移动端图表
  | 'mobile-line'         // 移动端折线图
  | 'mobile-area'         // 移动端面积图
  | 'mobile-column';      // 移动端柱状图

/**
 * 图表配置接口
 */
export interface ChartConfig {
  library: ChartLibrary;
  type: ChartType;
  category: ChartCategory;
  data: unknown;
  options: Record<string, unknown>;
}

/**
 * 数据源类型
 */
export type DataSourceType = 'file' | 'url' | 'manual' | 'database';

/**
 * 数据源接口
 */
export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  data?: unknown;
  url?: string;
  file?: {
    name: string;
    type: string;
    size: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 图表方案推荐
 */
export interface ChartRecommendation {
  id: string;
  config: ChartConfig;
  score: number;
  reason: string;
  preview?: string;
}

/**
 * 图表优化建议
 */
export interface OptimizationSuggestion {
  type: 'readability' | 'color' | 'label' | 'layout' | 'performance';
  severity: 'low' | 'medium' | 'high';
  description: string;
  solution: string;
  autoFix?: boolean;
}

/**
 * 图表结果
 */
export interface ChartResult {
  id: string;
  config: ChartConfig;
  code: {
    javascript: string;
    typescript: string;
    react: string;
    vue: string;
  };
  exports: {
    image?: string;
    svg?: string;
    html?: string;
  };
  optimizations: OptimizationSuggestion[];
  createdAt: Date;
}
