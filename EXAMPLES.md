# Insight Studio 使用示例

## 目录

1. [基础图表生成](#基础图表生成)
2. [使用示例数据集](#使用示例数据集)
3. [自定义数据源](#自定义数据源)
4. [趋势预测](#趋势预测)
5. [AI 对话](#ai-对话)
6. [看板创建](#看板创建)
7. [SDK 集成示例](#sdk-集成示例)

## 基础图表生成

### 示例 1: 创建销售趋势图

```bash
curl -X POST http://localhost:3000/api/charts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "query": "展示过去6个月的销售趋势",
    "enableWebSearch": true
  }'
```

### 示例 2: 创建区域对比图

```bash
curl -X POST http://localhost:3000/api/charts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "query": "对比各地区销售业绩",
    "dataSource": {
      "type": "inline",
      "content": [
        {"region": "华北", "sales": 185000},
        {"region": "华东", "sales": 234000},
        {"region": "华南", "sales": 198000}
      ]
    }
  }'
```

## 使用示例数据集

### 获取所有示例数据集

```bash
curl http://localhost:3000/api/data/samples
```

### 使用特定示例数据集

```bash
# 获取销售趋势数据
curl http://localhost:3000/api/data/samples/salesTrend

# 使用示例数据生成图表
curl -X POST http://localhost:3000/api/charts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "query": "显示销售趋势",
    "dataSource": {
      "type": "inline",
      "content": [
        {"month": "2024-01", "sales": 12500},
        {"month": "2024-02", "sales": 13200},
        {"month": "2024-03", "sales": 15800}
      ]
    }
  }'
```

## 自定义数据源

### CSV 数据

```javascript
const csvData = `month,sales,orders
2024-01,12500,245
2024-02,13200,268
2024-03,15800,312`;

// 在客户端解析 CSV
const lines = csvData.split('\n');
const headers = lines[0].split(',');
const data = lines.slice(1).map(line => {
  const values = line.split(',');
  return headers.reduce((obj, header, index) => {
    obj[header] = isNaN(values[index]) ? values[index] : Number(values[index]);
    return obj;
  }, {});
});

// 生成图表
fetch('http://localhost:3000/api/charts/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '展示销售趋势',
    dataSource: {
      type: 'inline',
      content: data
    }
  })
});
```

### JSON 数据

```javascript
const jsonData = [
  { product: 'iPhone', sales: 285000, growth: 15.2 },
  { product: 'MacBook', sales: 198000, growth: 12.8 },
  { product: 'iPad', sales: 145000, growth: 8.5 }
];

fetch('http://localhost:3000/api/charts/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '对比产品销售额',
    dataSource: {
      type: 'inline',
      content: jsonData
    }
  })
});
```

## 趋势预测

```bash
# 首先生成一个图表
CHART_ID="chart_xxx"

# 进行趋势预测
curl -X POST http://localhost:3000/api/insights/predict \
  -H "Content-Type: application/json" \
  -d "{
    \"chartId\": \"$CHART_ID\",
    \"config\": {
      \"period\": \"3m\",
      \"algorithm\": \"arima\",
      \"confidence\": 0.95
    }
  }"
```

## AI 对话

```bash
# 基础对话
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "帮我分析销售数据"
  }'

# 带上下文的对话
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "这个数据有什么特点？",
    "context": {
      "chartId": "chart_xxx",
      "history": [
        {
          "role": "user",
          "content": "生成销售趋势图"
        },
        {
          "role": "assistant",
          "content": "已为您生成销售趋势图"
        }
      ]
    }
  }'
```

## 看板创建

```bash
# 创建看板
curl -X POST http://localhost:3000/api/dashboards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "销售分析看板",
    "description": "Q4销售数据分析"
  }'

# 更新看板
curl -X PUT http://localhost:3000/api/dashboards/dashboard_xxx \
  -H "Content-Type: application/json" \
  -d '{
    "name": "销售分析看板 - Q4",
    "items": []
  }'

# 分享看板
curl -X POST http://localhost:3000/api/dashboards/dashboard_xxx/share \
  -H "Content-Type: application/json" \
  -d '{
    "type": "public"
  }'
```

## SDK 集成示例

### React 完整示例

```tsx
import React, { useState } from 'react';
import { InsightStudio, useInsightStudio } from '@insight-studio/sdk/react';
import type { ChartResult } from '@insight-studio/shared';

// 方式 1: 使用组件
function App1() {
  const handleChartGenerate = (chart: ChartResult) => {
    console.log('Chart generated:', chart);
    alert('图表生成成功！');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Insight Studio - React 示例</h1>
      <InsightStudio
        apiKey="demo-api-key"
        baseUrl="http://localhost:3000"
        theme="light"
        onChartGenerate={handleChartGenerate}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}

// 方式 2: 使用 Hook
function App2() {
  const [query, setQuery] = useState('');
  const { generateChart, loading, error } = useInsightStudio({
    apiKey: 'demo-api-key',
    baseUrl: 'http://localhost:3000',
  });

  const handleSubmit = async () => {
    const chart = await generateChart({
      query,
      enableWebSearch: true,
    });
    
    if (chart) {
      console.log('Chart:', chart);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Insight Studio - React Hook 示例</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入图表需求"
        style={{ width: '300px', padding: '8px' }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginLeft: '10px', padding: '8px 16px' }}
      >
        {loading ? '生成中...' : '生成图表'}
      </button>
      {error && <p style={{ color: 'red' }}>错误: {error.message}</p>}
    </div>
  );
}

export default App1;
```

### Vue 完整示例

```vue
<template>
  <div class="app">
    <h1>Insight Studio - Vue 示例</h1>
    
    <!-- 方式 1: 使用组件 -->
    <InsightStudio
      :api-key="apiKey"
      :base-url="baseUrl"
      theme="light"
      @chart-generate="onChartGenerate"
      @error="onError"
    />
    
    <!-- 方式 2: 自定义实现 -->
    <div class="custom-interface">
      <h2>自定义界面</h2>
      <input
        v-model="query"
        placeholder="输入图表需求"
        @keypress.enter="handleGenerate"
      />
      <button @click="handleGenerate" :disabled="loading">
        {{ loading ? '生成中...' : '生成图表' }}
      </button>
      
      <div v-if="chart" class="result">
        <h3>生成结果:</h3>
        <pre>{{ JSON.stringify(chart, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { InsightStudio } from '@insight-studio/sdk/vue';
import { InsightStudioClient } from '@insight-studio/sdk';
import type { ChartResult } from '@insight-studio/shared';

const apiKey = 'demo-api-key';
const baseUrl = 'http://localhost:3000';

const onChartGenerate = (chart: ChartResult) => {
  console.log('Chart generated:', chart);
  alert('图表生成成功！');
};

const onError = (error: Error) => {
  console.error('Error:', error);
  alert(`错误: ${error.message}`);
};

// 自定义实现
const client = new InsightStudioClient({ apiKey, baseUrl });
const query = ref('');
const loading = ref(false);
const chart = ref<ChartResult | null>(null);

const handleGenerate = async () => {
  if (!query.value.trim()) return;
  
  loading.value = true;
  try {
    const result = await client.generateChart({
      query: query.value,
      enableWebSearch: true,
    });
    
    chart.value = result.selectedChart || null;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.custom-interface {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input {
  width: 300px;
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px 16px;
}

.result {
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

pre {
  overflow-x: auto;
  font-size: 12px;
}
</style>
```

### Node.js/服务端示例

```javascript
const { InsightStudioClient } = require('@insight-studio/sdk');

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000',
});

async function generateReport() {
  // 1. 生成多个图表
  const salesChart = await client.generateChart({
    query: '展示销售趋势',
    dataSource: {
      type: 'inline',
      content: [
        { month: '2024-01', sales: 12500 },
        { month: '2024-02', sales: 13200 },
        { month: '2024-03', sales: 15800 },
      ]
    }
  });

  const regionChart = await client.generateChart({
    query: '对比区域销售',
    dataSource: {
      type: 'inline',
      content: [
        { region: '华北', sales: 185000 },
        { region: '华东', sales: 234000 },
      ]
    }
  });

  // 2. 创建看板
  const dashboard = await client.createDashboard({
    name: '销售分析报告',
    description: '月度销售数据分析',
  });

  // 3. 生成洞察报告
  const insight = await client.generateInsight({
    chartIds: [
      salesChart.selectedChart.id,
      regionChart.selectedChart.id,
    ],
    metrics: ['sales', 'growth'],
  });

  console.log('Report generated:', {
    dashboard,
    insight: insight.report,
  });

  return {
    dashboard,
    charts: [salesChart, regionChart],
    insight: insight.report,
  };
}

generateReport().catch(console.error);
```

## 高级用法

### 批量图表生成

```javascript
const queries = [
  '展示销售趋势',
  '对比区域业绩',
  '分析产品占比',
];

const charts = await Promise.all(
  queries.map(query => 
    client.generateChart({ query, enableWebSearch: true })
  )
);

console.log(`Generated ${charts.length} charts`);
```

### 自动化报告生成

```javascript
async function dailyReport() {
  const client = new InsightStudioClient({
    apiKey: process.env.INSIGHT_STUDIO_API_KEY,
  });

  // 获取今日数据
  const todayData = await fetchTodayData();

  // 生成图表
  const chart = await client.generateChart({
    query: '展示今日销售情况',
    dataSource: {
      type: 'inline',
      content: todayData,
    },
  });

  // 发送报告
  await sendEmailReport(chart);
}

// 定时执行
setInterval(dailyReport, 24 * 60 * 60 * 1000);
```

## 常见问题

### 1. 如何处理大数据集？

```javascript
// 对于大数据集，建议先进行数据聚合
const largeData = [...]; // 10000+ 条记录

// 聚合数据
const aggregatedData = aggregateByMonth(largeData);

// 然后生成图表
const chart = await client.generateChart({
  query: '展示月度趋势',
  dataSource: {
    type: 'inline',
    content: aggregatedData,
  },
});
```

### 2. 如何自定义图表样式？

```javascript
const chart = await client.generateChart({
  query: '销售趋势',
  preferences: {
    theme: 'dark',
    colorScheme: ['#1890ff', '#52c41a', '#faad14'],
  },
});
```

### 3. 如何导出图表？

```bash
# 导出为 PNG
curl -X POST http://localhost:3000/api/charts/chart_xxx/export \
  -H "Content-Type: application/json" \
  -d '{"format": "png"}'

# 导出为 SVG
curl -X POST http://localhost:3000/api/charts/chart_xxx/export \
  -H "Content-Type: application/json" \
  -d '{"format": "svg"}'
```

## 更多资源

- [API 文档](./docs/API.md)
- [SDK 文档](./docs/SDK.md)
- [架构文档](./docs/ARCHITECTURE.md)
- [快速开始](./QUICKSTART.md)
