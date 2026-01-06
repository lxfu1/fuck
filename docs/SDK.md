# SDK Documentation

## Installation

```bash
npm install @insight-studio/sdk
# or
pnpm add @insight-studio/sdk
# or
yarn add @insight-studio/sdk
```

## React SDK

### Basic Usage

```tsx
import { InsightStudio } from '@insight-studio/sdk/react';

function App() {
  return (
    <InsightStudio
      apiKey="your-api-key"
      onChartGenerate={(chart) => console.log(chart)}
    />
  );
}
```

### Using the Hook

```tsx
import { useInsightStudio } from '@insight-studio/sdk/react';

function MyComponent() {
  const { generateChart, predictTrend, chat, loading, error } = useInsightStudio({
    apiKey: 'your-api-key',
  });

  const handleGenerate = async () => {
    const chart = await generateChart({
      query: '展示销售趋势',
      enableWebSearch: true,
    });
    console.log(chart);
  };

  return (
    <button onClick={handleGenerate} disabled={loading}>
      Generate Chart
    </button>
  );
}
```

### Advanced Usage

```tsx
import { useInsightStudio } from '@insight-studio/sdk/react';
import { useState } from 'react';

function AdvancedComponent() {
  const [chartId, setChartId] = useState<string | null>(null);
  const { generateChart, predictTrend, chat } = useInsightStudio({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.insight-studio.ai',
  });

  const handleGenerateAndPredict = async () => {
    // Step 1: Generate chart
    const chart = await generateChart({
      query: '销售趋势',
      dataSource: {
        type: 'inline',
        content: yourData,
      },
    });

    if (chart) {
      setChartId(chart.id);

      // Step 2: Predict trend
      const prediction = await predictTrend({
        chartId: chart.id,
        config: {
          period: '3m',
          algorithm: 'arima',
          confidence: 0.95,
        },
      });

      console.log('Prediction:', prediction);
    }
  };

  const handleChat = async () => {
    const response = await chat({
      message: '帮我分析这个图表',
      context: {
        chartId: chartId || undefined,
      },
    });

    console.log('AI Response:', response);
  };

  return (
    <div>
      <button onClick={handleGenerateAndPredict}>
        Generate & Predict
      </button>
      <button onClick={handleChat} disabled={!chartId}>
        Chat with AI
      </button>
    </div>
  );
}
```

## Vue SDK

### Basic Usage

```vue
<template>
  <InsightStudio
    :api-key="apiKey"
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

### Composition API

```vue
<template>
  <div>
    <input v-model="query" placeholder="输入图表需求" />
    <button @click="handleGenerate" :disabled="loading">
      {{ loading ? '生成中...' : '生成图表' }}
    </button>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({ apiKey: 'your-api-key' });
const query = ref('');
const loading = ref(false);
const error = ref<Error | null>(null);

const handleGenerate = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await client.generateChart({
      query: query.value,
      enableWebSearch: true,
    });
    console.log('Result:', result);
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
};
</script>
```

## API Client

### Direct API Usage

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.insight-studio.ai',
  timeout: 30000,
  headers: {
    'X-Custom-Header': 'value',
  },
});

// Generate chart
const { selectedChart } = await client.generateChart({
  query: '展示销售趋势',
});

// Get chart
const chart = await client.getChart('chart_id');

// Optimize chart
const optimized = await client.optimizeChart('chart_id');

// Predict trend
const prediction = await client.predictTrend({
  chartId: 'chart_id',
  config: {
    period: '3m',
    algorithm: 'arima',
    confidence: 0.95,
  },
});

// Generate insight
const insight = await client.generateInsight({
  chartIds: ['chart_1', 'chart_2'],
  metrics: ['revenue', 'growth'],
});

// Chat
const chatResponse = await client.chat({
  message: '帮我分析数据',
  context: {
    chartId: 'chart_id',
  },
});

// Dashboard operations
const dashboard = await client.createDashboard({
  name: 'My Dashboard',
  description: 'Analytics dashboard',
});

const updated = await client.updateDashboard('dashboard_id', {
  name: 'Updated Dashboard',
});

// Get templates
const templates = await client.listTemplates();

// Monitoring
const metrics = await client.getMonitoringMetrics();
```

## TypeScript Support

The SDK is fully typed with TypeScript:

```typescript
import type {
  ChartResult,
  ChartConfig,
  ExplanationSchema,
  PredictionResult,
  Dashboard,
  DashboardTemplate,
} from '@insight-studio/shared';

import { useInsightStudio } from '@insight-studio/sdk/react';

function TypedComponent() {
  const { generateChart } = useInsightStudio({ apiKey: 'xxx' });

  const handleGenerate = async (): Promise<ChartResult | null> => {
    const result = await generateChart({
      query: 'sales trend',
      enableWebSearch: true,
    });
    return result;
  };

  return <button onClick={handleGenerate}>Generate</button>;
}
```

## Error Handling

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({ apiKey: 'your-api-key' });

try {
  const result = await client.generateChart({
    query: 'invalid query',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

## Custom Configuration

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://custom-api.example.com',
  timeout: 60000, // 60 seconds
  headers: {
    'X-Custom-Header': 'custom-value',
    'X-Organization-ID': 'org_123',
  },
});
```

## Examples

Check the `/examples` directory for more examples:

- React example
- Vue example
- Next.js example
- Nuxt example
- API client example
