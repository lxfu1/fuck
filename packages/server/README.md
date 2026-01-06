# @insight-studio/server

Backend server for Insight Studio

## Features

- ✅ RESTful API for chart generation
- ✅ AI-powered insight generation
- ✅ Dashboard management
- ✅ Template system
- ✅ Monitoring and health checks
- ✅ Error handling and logging

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your-api-key
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Charts

- `POST /api/charts/generate` - Generate a new chart
- `GET /api/charts/:id` - Get chart by ID
- `GET /api/charts` - List all charts
- `DELETE /api/charts/:id` - Delete chart
- `POST /api/charts/:id/optimize` - Optimize chart
- `POST /api/charts/:id/export` - Export chart

### Insights

- `POST /api/insights/predict` - Predict trends
- `POST /api/insights/anomalies` - Detect anomalies
- `POST /api/insights/report` - Generate insight report

### Dashboards

- `POST /api/dashboards` - Create dashboard
- `GET /api/dashboards/:id` - Get dashboard
- `GET /api/dashboards` - List dashboards
- `PUT /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard
- `POST /api/dashboards/:id/share` - Share dashboard
- `POST /api/dashboards/:id/export` - Export dashboard

### Templates

- `GET /api/templates` - List templates
- `GET /api/templates/:id` - Get template
- `POST /api/templates` - Create template

### AI

- `POST /api/ai/chat` - Chat with AI assistant

### Monitoring

- `GET /api/monitoring/metrics` - Get system metrics
- `GET /api/monitoring/health` - Health check

## License

MIT
