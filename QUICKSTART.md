# Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher

## Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Clone the repository
git clone <your-repo-url>
cd insight-studio

# Install dependencies
pnpm install
```

## Configuration

### AI Service (Optional)

Insight Studio uses Zhipu AI's GLM-4 model for AI chat features.

```bash
# Copy environment template
cp packages/server/.env.example packages/server/.env

# Edit .env and add your GLM API Key
# GLM_API_KEY=your-api-key-here
```

Get your API key from: https://open.bigmodel.cn/

For detailed setup, see: [GLM-4 Setup Guide](./docs/GLM_SETUP.md)

> **Note**: Without API key, AI features will use fallback responses. Core chart generation still works.

## Development

### Start All Services

```bash
pnpm dev
```

This will start:
- Backend server on `http://localhost:3000`
- Web app on `http://localhost:5173`
- SDK packages in watch mode

### Start Individual Services

```bash
# Start backend only
pnpm --filter @insight-studio/server dev

# Start web app only
pnpm --filter @insight-studio/web-app dev

# Watch SDK changes
pnpm --filter @insight-studio/sdk dev
```

## Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @insight-studio/server build
```

## Usage Examples

### 1. Using the Web App

Open http://localhost:5173 in your browser and try:

```
展示过去6个月的销售趋势
```

### 2. Using the React SDK

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

### 3. Using the API Client

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000',  // Optional, defaults to production URL
});

const result = await client.generateChart({
  query: '展示销售趋势',
  enableWebSearch: true,
});

console.log(result);
```

**Note**: The SDK automatically adds `/api` to all endpoints. So `baseUrl: 'http://localhost:3000'` will make requests to `http://localhost:3000/api/charts/generate`.

### 4. Direct API Calls

```bash
# Generate a chart
curl -X POST http://localhost:3000/api/charts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "query": "展示销售趋势",
    "enableWebSearch": true
  }'

# Get monitoring metrics
curl http://localhost:3000/api/monitoring/metrics

# Health check
curl http://localhost:3000/health
```

## Project Structure

```
insight-studio/
├── packages/
│   ├── shared/           # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/    # TypeScript interfaces
│   │   │   ├── constants.ts
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── sdk/              # SDK for React/Vue
│   │   ├── src/
│   │   │   ├── client/   # API client
│   │   │   ├── react/    # React components
│   │   │   └── vue/      # Vue components
│   │   └── package.json
│   │
│   ├── server/           # Backend API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── web-app/          # Frontend web application
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json
│
├── docs/                 # Documentation
│   ├── API.md
│   ├── SDK.md
│   └── ARCHITECTURE.md
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## Key Features

### 1. Chart Generation

Generate charts from natural language:

```typescript
const { selectedChart } = await client.generateChart({
  query: '对比各地区销售额',
  dataSource: {
    type: 'inline',
    content: [
      { region: '北京', sales: 1000 },
      { region: '上海', sales: 1200 },
      { region: '广州', sales: 900 },
    ],
  },
});
```

### 2. Trend Prediction

Predict future trends:

```typescript
const prediction = await client.predictTrend({
  chartId: 'chart_xxx',
  config: {
    period: '3m',
    algorithm: 'arima',
    confidence: 0.95,
  },
});
```

### 3. AI Chat

Chat with AI assistant:

```typescript
const response = await client.chat({
  message: '帮我分析这个销售数据',
  context: {
    chartId: 'chart_xxx',
  },
});
```

### 4. Dashboard Management

Create and manage dashboards:

```typescript
const dashboard = await client.createDashboard({
  name: 'Sales Dashboard',
  description: 'Q1 sales analytics',
});

await client.updateDashboard(dashboard.id, {
  name: 'Updated Dashboard Name',
});
```

## Configuration

### Backend (.env)

Create `packages/server/.env`:

```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend

Update API configuration in `packages/web-app/vite.config.ts` if needed.

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Change backend port
export PORT=3001

# Change frontend port (edit vite.config.ts)
```

### Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### TypeScript Errors

```bash
# Check types
pnpm --filter <package> typecheck
```

## Next Steps

1. Read the [API Documentation](./docs/API.md)
2. Explore [SDK Documentation](./docs/SDK.md)
3. Check [Architecture Overview](./docs/ARCHITECTURE.md)
4. Try the example queries in the web app
5. Integrate the SDK into your own project

## Support

- GitHub Issues: Report bugs and request features
- Documentation: Check the `/docs` folder
- Examples: See `/examples` (coming soon)

## License

MIT License - see LICENSE file for details
