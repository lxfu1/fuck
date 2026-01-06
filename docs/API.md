# Insight Studio API Documentation

## Base URL

```
https://api.insight-studio.ai
```

## Authentication

All API requests require an API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Charts

#### Generate Chart

```http
POST /api/charts/generate
```

**Request Body:**

```json
{
  "query": "展示过去6个月的销售趋势",
  "dataSource": {
    "type": "inline",
    "content": [
      { "month": "Jan", "sales": 100 },
      { "month": "Feb", "sales": 120 }
    ]
  },
  "preferences": {
    "library": "g2plot",
    "theme": "light"
  },
  "enableWebSearch": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "rec_xxx",
        "config": { ... },
        "score": 0.95,
        "reason": "Best match for trend visualization"
      }
    ],
    "selectedChart": {
      "id": "chart_xxx",
      "config": { ... },
      "code": {
        "javascript": "...",
        "typescript": "...",
        "react": "...",
        "vue": "..."
      },
      "exports": {},
      "optimizations": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "explanation": {
      "chartId": "chart_xxx",
      "narrative": {
        "title": "Sales Trend Analysis",
        "summary": "...",
        "keyFindings": ["..."]
      }
    }
  }
}
```

#### Get Chart

```http
GET /api/charts/:id
```

#### Optimize Chart

```http
POST /api/charts/:id/optimize
```

#### Export Chart

```http
POST /api/charts/:id/export
Content-Type: application/json

{
  "format": "png" // png, svg, pdf, html, json
}
```

### Insights

#### Predict Trend

```http
POST /api/insights/predict
```

**Request Body:**

```json
{
  "chartId": "chart_xxx",
  "config": {
    "period": "3m",
    "algorithm": "arima",
    "confidence": 0.95
  }
}
```

#### Detect Anomalies

```http
POST /api/insights/anomalies
```

**Request Body:**

```json
{
  "chartId": "chart_xxx"
}
```

#### Generate Report

```http
POST /api/insights/report
```

**Request Body:**

```json
{
  "chartIds": ["chart_1", "chart_2"],
  "dataRange": {
    "start": "2024-01-01",
    "end": "2024-06-30"
  },
  "metrics": ["revenue", "growth"]
}
```

### Dashboards

#### Create Dashboard

```http
POST /api/dashboards
```

**Request Body:**

```json
{
  "name": "My Dashboard",
  "description": "Sales analytics dashboard",
  "templateId": "template_xxx" // optional
}
```

#### Update Dashboard

```http
PUT /api/dashboards/:id
```

#### Share Dashboard

```http
POST /api/dashboards/:id/share
```

**Request Body:**

```json
{
  "type": "public", // public, private, password
  "password": "xxx" // required if type is password
}
```

### AI Chat

```http
POST /api/ai/chat
```

**Request Body:**

```json
{
  "message": "帮我生成一个销售趋势图",
  "context": {
    "dashboardId": "dashboard_xxx",
    "history": [
      {
        "role": "user",
        "content": "你好"
      },
      {
        "role": "assistant",
        "content": "你好！我能帮你什么？"
      }
    ]
  }
}
```

### Monitoring

#### Get Metrics

```http
GET /api/monitoring/metrics
```

#### Health Check

```http
GET /api/monitoring/health
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_xxx"
  }
}
```

### Common Error Codes

- `CHART_GENERATION_FAILED` - Chart generation failed
- `CHART_NOT_FOUND` - Chart not found
- `INVALID_REQUEST` - Invalid request parameters
- `UNAUTHORIZED` - Invalid or missing API key
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limits

- **Free tier**: 100 requests per 15 minutes
- **Pro tier**: 1000 requests per 15 minutes
- **Enterprise**: Custom limits

## SDKs

- **JavaScript/TypeScript**: `@insight-studio/sdk`
- **React**: `@insight-studio/sdk/react`
- **Vue**: `@insight-studio/sdk/vue`

See [SDK Documentation](./SDK.md) for more details.
