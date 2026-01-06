import React, { useState, useCallback } from 'react';
import { InsightStudioClient } from '../client/api-client';
import type { 
  GenerateChartRequest, 
  ChartResult, 
  ExplanationSchema 
} from '@insight-studio/shared';

export interface InsightStudioProps {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark';
  onChartGenerate?: (chart: ChartResult) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InsightStudio: React.FC<InsightStudioProps> = ({
  apiKey,
  baseUrl,
  theme = 'light',
  onChartGenerate,
  onError,
  className,
  style,
}) => {
  const [client] = useState(() => new InsightStudioClient({ apiKey, baseUrl }));
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationSchema | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const request: GenerateChartRequest = {
        query,
        enableWebSearch: true,
      };

      const response = await client.generateChart(request);
      const generatedChart = response.selectedChart;

      if (generatedChart) {
        setChart(generatedChart);
        setExplanation(response.explanation || null);
        onChartGenerate?.(generatedChart);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      console.error('Failed to generate chart:', err);
    } finally {
      setLoading(false);
    }
  }, [query, client, onChartGenerate, onError]);

  return (
    <div 
      className={className} 
      style={{ 
        padding: '24px', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        ...style 
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 16px 0' }}>Insight Studio</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="描述你想要的图表，例如：展示过去6个月的销售趋势"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            border: `1px solid ${theme === 'dark' ? '#444' : '#d9d9d9'}`,
            borderRadius: '4px',
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGenerate();
            }
          }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !query.trim()}
        style={{
          padding: '12px 24px',
          fontSize: '14px',
          backgroundColor: loading ? '#999' : '#1890ff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 500,
        }}
      >
        {loading ? '生成中...' : '生成图表'}
      </button>

      {chart && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>生成的图表</h3>
          <div 
            style={{ 
              padding: '16px', 
              border: `1px solid ${theme === 'dark' ? '#444' : '#d9d9d9'}`,
              borderRadius: '4px',
              backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fafafa',
            }}
          >
            <pre style={{ 
              margin: 0, 
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {JSON.stringify(chart.config, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {explanation && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>洞察解释</h3>
          <div 
            style={{ 
              padding: '16px', 
              border: `1px solid ${theme === 'dark' ? '#444' : '#d9d9d9'}`,
              borderRadius: '4px',
              backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fafafa',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>{explanation.narrative.title}</h4>
            <p style={{ margin: '0 0 12px 0' }}>{explanation.narrative.summary}</p>
            {explanation.narrative.keyFindings.length > 0 && (
              <>
                <strong>关键发现：</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  {explanation.narrative.keyFindings.map((finding, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{finding}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
