import type { ChartResult, Dashboard } from '@insight-studio/shared';

export class ExportService {
  async exportChart(chart: ChartResult, format: 'png' | 'svg' | 'pdf' | 'html' | 'json'): Promise<{
    data: string;
    mimeType: string;
    filename: string;
  }> {
    switch (format) {
      case 'json':
        return {
          data: JSON.stringify(chart, null, 2),
          mimeType: 'application/json',
          filename: `chart_${chart.id}.json`,
        };

      case 'html':
        return {
          data: this.generateChartHTML(chart),
          mimeType: 'text/html',
          filename: `chart_${chart.id}.html`,
        };

      case 'svg':
        return {
          data: this.generateSVGPlaceholder(chart),
          mimeType: 'image/svg+xml',
          filename: `chart_${chart.id}.svg`,
        };

      case 'png':
      case 'pdf':
        return {
          data: `data:image/png;base64,placeholder`,
          mimeType: format === 'png' ? 'image/png' : 'application/pdf',
          filename: `chart_${chart.id}.${format}`,
        };

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  async exportDashboard(dashboard: Dashboard, format: 'png' | 'pdf' | 'html' | 'json'): Promise<{
    data: string;
    mimeType: string;
    filename: string;
  }> {
    switch (format) {
      case 'json':
        return {
          data: JSON.stringify(dashboard, null, 2),
          mimeType: 'application/json',
          filename: `dashboard_${dashboard.id}.json`,
        };

      case 'html':
        return {
          data: this.generateDashboardHTML(dashboard),
          mimeType: 'text/html',
          filename: `dashboard_${dashboard.id}.html`,
        };

      case 'png':
      case 'pdf':
        return {
          data: `data:${format === 'png' ? 'image/png' : 'application/pdf'};base64,placeholder`,
          mimeType: format === 'png' ? 'image/png' : 'application/pdf',
          filename: `dashboard_${dashboard.id}.${format}`,
        };

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private generateChartHTML(chart: ChartResult): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chart - ${chart.id}</title>
  <script src="https://unpkg.com/@antv/g2plot@latest/dist/g2plot.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    #chart {
      width: 100%;
      height: 500px;
    }
    .meta {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e8e8e8;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Generated Chart</h1>
    <div id="chart"></div>
    <div class="meta">
      <p><strong>Chart ID:</strong> ${chart.id}</p>
      <p><strong>Type:</strong> ${chart.config.type}</p>
      <p><strong>Library:</strong> ${chart.config.library}</p>
      <p><strong>Created:</strong> ${new Date(chart.createdAt).toLocaleString()}</p>
    </div>
  </div>
  <script>
    ${chart.code.javascript}
  </script>
</body>
</html>`;
  }

  private generateDashboardHTML(dashboard: Dashboard): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dashboard.name}</title>
  <script src="https://unpkg.com/@antv/g2plot@latest/dist/g2plot.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #1890ff;
    }
    .header p {
      margin: 0;
      color: #666;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(${dashboard.layout.cols}, 1fr);
      gap: 20px;
    }
    .chart-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-height: ${dashboard.layout.rowHeight}px;
    }
    .chart-title {
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${dashboard.name}</h1>
      ${dashboard.description ? `<p>${dashboard.description}</p>` : ''}
    </div>
    <div class="dashboard-grid">
      ${dashboard.items.map(item => `
        <div class="chart-item" style="grid-column: span ${item.layout.w}; grid-row: span ${item.layout.h};">
          ${item.title ? `<h3 class="chart-title">${item.title}</h3>` : ''}
          <div id="chart-${item.id}"></div>
        </div>
      `).join('')}
    </div>
  </div>
  <script>
    // Dashboard charts would be initialized here
    console.log('Dashboard loaded: ${dashboard.name}');
  </script>
</body>
</html>`;
  }

  private generateSVGPlaceholder(chart: ChartResult): string {
    return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f5f5f5"/>
  <text x="400" y="280" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">
    Chart: ${chart.config.type}
  </text>
  <text x="400" y="320" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">
    ID: ${chart.id}
  </text>
  <text x="400" y="350" text-anchor="middle" font-family="Arial" font-size="14" fill="#999">
    Export to SVG requires chart rendering
  </text>
</svg>`;
  }

  generateCodeSnippet(chart: ChartResult, framework: 'javascript' | 'typescript' | 'react' | 'vue'): string {
    return chart.code[framework];
  }

  async exportToCSV(data: unknown[]): Promise<string> {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    const firstRow = data[0] as Record<string, unknown>;
    const headers = Object.keys(firstRow);
    
    const csvRows = [
      headers.join(','),
      ...data.map(row => {
        const r = row as Record<string, unknown>;
        return headers.map(header => {
          const value = r[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return String(value);
        }).join(',');
      }),
    ];

    return csvRows.join('\n');
  }
}
