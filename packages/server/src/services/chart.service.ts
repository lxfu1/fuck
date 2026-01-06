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

export class ChartService {
  private charts: Map<string, ChartResult> = new Map();

  async generateChart(request: GenerateChartRequest): Promise<GenerateChartResponse> {
    const chartId = generateId('chart');
    
    const config: ChartConfig = this.analyzeQuery(request.query);
    
    const recommendations: ChartRecommendation[] = [
      {
        id: generateId('rec'),
        config,
        score: 0.95,
        reason: 'Based on your query, this chart type best represents the data trends',
        preview: undefined,
      },
    ];

    const chart: ChartResult = {
      id: chartId,
      config,
      code: this.generateCode(config),
      exports: {},
      optimizations: this.detectOptimizations(config),
      createdAt: new Date(),
    };

    this.charts.set(chartId, chart);

    const explanation: ExplanationSchema = this.generateExplanation(chart);

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

  private analyzeQuery(query: string): ChartConfig {
    const lowerQuery = query.toLowerCase();
    
    let type: ChartConfig['type'] = 'line';
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

  private generateExplanation(chart: ChartResult): ExplanationSchema {
    return {
      chartId: chart.id,
      narrative: {
        title: 'Data Visualization Analysis',
        summary: 'This chart shows the trend over time',
        keyFindings: [
          'Overall upward trend observed',
          'Peak value reached in June',
          'Significant growth between April and May',
        ],
        context: 'The data represents monthly metrics for the analyzed period',
      },
      insights: [],
      dataStory: {
        whatHappened: 'The metrics show consistent growth throughout the period',
        whyItMatters: 'This trend indicates positive business performance',
        whatToDoNext: [
          'Continue monitoring the trend',
          'Investigate factors contributing to growth',
          'Plan resources for sustained growth',
        ],
      },
      metadata: {
        dataQuality: 'high',
        confidence: 0.85,
        limitations: ['Limited historical data', 'No external factors considered'],
      },
    };
  }
}
