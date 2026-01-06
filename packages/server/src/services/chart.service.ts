import type {
  GenerateChartRequest,
  GenerateChartResponse,
  ChartResult,
  ChartRecommendation,
  ChartConfig,
  ExplanationSchema,
  OptimizationSuggestion,
} from '@insight-studio/shared';
import { generateId } from '@insight-studio/shared';
import { DataParser } from '../utils/data-parser';
import { ExportService } from './export.service';

export class ChartService {
  private charts: Map<string, ChartResult> = new Map();
  private exportService = new ExportService();

  async generateChart(request: GenerateChartRequest): Promise<GenerateChartResponse> {
    const chartId = generateId('chart');
    
    let data = this.generateSampleData();
    
    if (request.dataSource?.content) {
      data = request.dataSource.content;
    }

    const validation = DataParser.validateData(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const dataStructure = DataParser.detectDataStructure(data as unknown[]);
    const suggestedTypes = DataParser.suggestChartType(dataStructure);
    
    const config: ChartConfig = this.analyzeQuery(request.query, data, suggestedTypes);
    
    const recommendations: ChartRecommendation[] = suggestedTypes.slice(0, 3).map((type, index) => ({
      id: generateId('rec'),
      config: {
        ...config,
        type: type as ChartConfig['type'],
      },
      score: 0.95 - (index * 0.1),
      reason: this.getReasonForChartType(type, dataStructure),
      preview: undefined,
    }));

    const chart: ChartResult = {
      id: chartId,
      config,
      code: this.generateCode(config),
      exports: {},
      optimizations: this.detectOptimizations(config),
      createdAt: new Date(),
    };

    this.charts.set(chartId, chart);

    const explanation: ExplanationSchema = this.generateExplanation(chart, dataStructure);

    return {
      recommendations,
      selectedChart: chart,
      explanation,
    };
  }

  async getChart(id: string): Promise<ChartResult | null> {
    return this.charts.get(id) || null;
  }

  async listCharts(): Promise<ChartResult[]> {
    return Array.from(this.charts.values());
  }

  async deleteChart(id: string): Promise<void> {
    this.charts.delete(id);
  }

  async optimizeChart(id: string): Promise<ChartResult> {
    const chart = this.charts.get(id);
    if (!chart) {
      throw new Error('Chart not found');
    }

    const optimizedConfig = { ...chart.config };
    const updatedChart: ChartResult = {
      ...chart,
      config: optimizedConfig,
      optimizations: [],
    };

    this.charts.set(id, updatedChart);
    return updatedChart;
  }

  async exportChart(id: string, format: string): Promise<{ url: string }> {
    const chart = this.charts.get(id);
    if (!chart) {
      throw new Error('Chart not found');
    }

    return {
      url: `/exports/${id}.${format}`,
    };
  }

  private analyzeQuery(query: string, data: unknown, suggestedTypes: string[]): ChartConfig {
    const lowerQuery = query.toLowerCase();
    
    let type: ChartConfig['type'] = (suggestedTypes[0] as ChartConfig['type']) || 'line';
    let category: ChartConfig['category'] = 'trend';

    if (lowerQuery.includes('趋势') || lowerQuery.includes('trend')) {
      type = 'line';
      category = 'trend';
    } else if (lowerQuery.includes('对比') || lowerQuery.includes('compare')) {
      type = 'column';
      category = 'comparison';
    } else if (lowerQuery.includes('占比') || lowerQuery.includes('组成') || lowerQuery.includes('pie')) {
      type = 'pie';
      category = 'composition';
    } else if (lowerQuery.includes('分布') || lowerQuery.includes('distribution')) {
      type = 'histogram';
      category = 'distribution';
    } else if (lowerQuery.includes('关系') || lowerQuery.includes('relationship')) {
      type = 'scatter';
      category = 'relationship';
    }

    return {
      library: 'g2plot',
      type,
      category,
      data: this.generateSampleData(),
      options: {
        title: {
          visible: true,
          text: 'Generated Chart',
        },
        xField: 'x',
        yField: 'y',
      },
    };
  }

  private generateSampleData(): unknown {
    return [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 150 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 180 },
      { x: 'Jun', y: 200 },
    ];
  }

  private generateCode(config: ChartConfig) {
    const jsCode = `
import { ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} } from '@antv/g2plot';

const data = ${JSON.stringify(config.data, null, 2)};

const chart = new ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}('container', {
  data,
  ${Object.entries(config.options)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(',\n  ')}
});

chart.render();
    `.trim();

    return {
      javascript: jsCode,
      typescript: jsCode.replace('import', 'import type'),
      react: `
import React from 'react';
import { ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} } from '@antv/g2plot';

export default function Chart() {
  const containerRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const chart = new ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}(containerRef.current, {
      data: ${JSON.stringify(config.data)},
      ${Object.entries(config.options)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(',\n      ')}
    });
    
    chart.render();
    
    return () => chart.destroy();
  }, []);
  
  return <div ref={containerRef} />;
}
      `.trim(),
      vue: `
<template>
  <div ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} } from '@antv/g2plot';

const chartContainer = ref(null);
let chart = null;

onMounted(() => {
  chart = new ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}(chartContainer.value, {
    data: ${JSON.stringify(config.data)},
    ${Object.entries(config.options)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(',\n    ')}
  });
  
  chart.render();
});

onUnmounted(() => {
  if (chart) chart.destroy();
});
</script>
      `.trim(),
    };
  }

  private detectOptimizations(config: ChartConfig): OptimizationSuggestion[] {
    return [
      {
        type: 'readability',
        severity: 'low',
        description: 'Labels could be more readable',
        solution: 'Rotate labels or adjust font size',
        autoFix: true,
      },
    ];
  }

  private generateExplanation(chart: ChartResult, dataStructure?: ReturnType<typeof DataParser.detectDataStructure>): ExplanationSchema {
    return {
      chartId: chart.id,
      narrative: {
        title: 'Data Visualization Analysis',
        summary: this.generateSummary(chart, dataStructure),
        keyFindings: this.generateKeyFindings(chart, dataStructure),
        context: 'The data represents metrics for the analyzed period',
      },
      insights: [],
      dataStory: {
        whatHappened: 'The metrics show patterns in the data',
        whyItMatters: 'These patterns provide insights into business performance',
        whatToDoNext: [
          'Continue monitoring trends',
          'Investigate contributing factors',
          'Plan data-driven strategies',
        ],
      },
      metadata: {
        dataQuality: 'high',
        confidence: 0.85,
        limitations: ['Limited historical data', 'No external factors considered'],
      },
    };
  }

  private generateSummary(chart: ChartResult, dataStructure?: ReturnType<typeof DataParser.detectDataStructure>): string {
    const { type, category } = chart.config;
    
    if (dataStructure?.hasTimeSeriesData) {
      return `This ${type} chart displays temporal trends in your data`;
    }
    
    if (category === 'comparison') {
      return `This ${type} chart compares values across different categories`;
    }
    
    if (category === 'composition') {
      return `This ${type} chart shows the composition and proportions of your data`;
    }
    
    return `This ${type} chart visualizes your data for ${category} analysis`;
  }

  private generateKeyFindings(chart: ChartResult, dataStructure?: ReturnType<typeof DataParser.detectDataStructure>): string[] {
    const findings: string[] = [];
    
    if (dataStructure) {
      const numericCols = dataStructure.columns.filter(c => c.type === 'number');
      const categoricalCols = dataStructure.columns.filter(c => c.type === 'string');
      
      if (numericCols.length > 0) {
        findings.push(`Dataset contains ${numericCols.length} numeric field(s) for quantitative analysis`);
      }
      
      if (categoricalCols.length > 0) {
        findings.push(`Dataset has ${categoricalCols.length} categorical dimension(s) for segmentation`);
      }
      
      if (dataStructure.hasTimeSeriesData) {
        findings.push('Time-series data detected, enabling trend analysis');
      }
    }
    
    if (findings.length === 0) {
      findings.push('Data successfully visualized');
    }
    
    return findings;
  }

  private getReasonForChartType(type: string, dataStructure: ReturnType<typeof DataParser.detectDataStructure>): string {
    const reasons: Record<string, string> = {
      'line': 'Best for showing trends over time',
      'area': 'Effective for cumulative trends and comparisons',
      'column': 'Ideal for comparing values across categories',
      'bar': 'Clear comparison of categorical data',
      'pie': 'Perfect for showing proportions and composition',
      'donut': 'Similar to pie chart with emphasis on totals',
      'scatter': 'Reveals relationships between two variables',
      'bubble': 'Shows three-dimensional relationships',
      'heatmap': 'Displays patterns in large datasets',
      'table': 'Provides detailed tabular view of data',
    };
    
    let reason = reasons[type] || 'Suitable for your data structure';
    
    if (dataStructure.hasTimeSeriesData && ['line', 'area'].includes(type)) {
      reason += ' with time-series data';
    }
    
    return reason;
  }
}
