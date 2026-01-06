# @insight-studio/sdk

Official SDK for Insight Studio - Supports React and Vue

## Installation

```bash
npm install @insight-studio/sdk
# or
pnpm add @insight-studio/sdk
# or
yarn add @insight-studio/sdk
```

## Usage

### React

#### Using the Component

```tsx
import { InsightStudio } from '@insight-studio/sdk/react';

function App() {
  return (
    <InsightStudio
      apiKey="your-api-key"
      theme="light"
      onChartGenerate={(chart) => {
        console.log('Chart generated:', chart);
      }}
      onError={(error) => {
        console.error('Error:', error);
      }}
    />
  );
}
```

#### Using the Hook

```tsx
import { useInsightStudio } from '@insight-studio/sdk/react';

function MyComponent() {
  const { generateChart, loading, error } = useInsightStudio({
    apiKey: 'your-api-key',
  });

  const handleGenerate = async () => {
    const chart = await generateChart({
      query: '展示过去6个月的销售趋势',
      enableWebSearch: true,
    });
    
    if (chart) {
      console.log('Generated chart:', chart);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Chart'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Vue

```vue
<template>
  <InsightStudio
    :api-key="apiKey"
    theme="light"
    @chart-generate="onChartGenerate"
    @error="onError"
  />
</template>

<script setup>
import { InsightStudio } from '@insight-studio/sdk/vue';

const apiKey = 'your-api-key';

const onChartGenerate = (chart) => {
  console.log('Chart generated:', chart);
};

const onError = (error) => {
  console.error('Error:', error);
};
</script>
```

### API Client

For more control, you can use the API client directly:

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.insight-studio.ai', // optional
});

// Generate chart
const result = await client.generateChart({
  query: '展示过去6个月的销售趋势',
  enableWebSearch: true,
});

// Predict trend
const prediction = await client.predictTrend({
  chartId: 'chart-id',
  config: {
    period: '3m',
    algorithm: 'arima',
    confidence: 0.95,
  },
});

// AI Chat
const chatResponse = await client.chat({
  message: '帮我分析一下这个数据',
  context: {
    chartId: 'chart-id',
  },
});

// Create dashboard
const dashboard = await client.createDashboard({
  name: 'My Dashboard',
  description: 'Sales analytics dashboard',
});
```

## API Reference

### InsightStudioClient

#### Methods

- `generateChart(request: GenerateChartRequest): Promise<GenerateChartResponse>`
- `getChart(id: string): Promise<ChartResult>`
- `optimizeChart(id: string): Promise<ChartResult>`
- `predictTrend(request: PredictTrendRequest): Promise<PredictionResult>`
- `generateInsight(request: GenerateInsightRequest): Promise<GenerateInsightResponse>`
- `chat(request: AIChatRequest): Promise<AIChatResponse>`
- `createDashboard(request: CreateDashboardRequest): Promise<Dashboard>`
- `getDashboard(id: string): Promise<Dashboard>`
- `updateDashboard(id: string, request: UpdateDashboardRequest): Promise<Dashboard>`
- `listTemplates(): Promise<DashboardTemplate[]>`
- `getMonitoringMetrics(): Promise<MonitoringMetrics>`

### React Component Props

```typescript
interface InsightStudioProps {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark';
  onChartGenerate?: (chart: ChartResult) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### Vue Component Props

```typescript
interface Props {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark';
  className?: string;
  style?: Record<string, string>;
}
```

## License

MIT
