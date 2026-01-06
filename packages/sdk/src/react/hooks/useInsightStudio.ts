import { useState, useCallback, useMemo } from 'react';
import { InsightStudioClient } from '../../client/api-client';
import type { 
  GenerateChartRequest, 
  ChartResult,
  PredictTrendRequest,
  PredictionResult,
  AIChatRequest,
  AIChatResponse,
} from '@insight-studio/shared';

export interface UseInsightStudioOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface UseInsightStudioReturn {
  generateChart: (request: GenerateChartRequest) => Promise<ChartResult | null>;
  predictTrend: (request: PredictTrendRequest) => Promise<PredictionResult | null>;
  chat: (request: AIChatRequest) => Promise<AIChatResponse | null>;
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useInsightStudio(options: UseInsightStudioOptions): UseInsightStudioReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const client = useMemo(
    () => new InsightStudioClient(options),
    [options.apiKey, options.baseUrl]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateChart = useCallback(async (request: GenerateChartRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.generateChart(request);
      return response.selectedChart || null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const predictTrend = useCallback(async (request: PredictTrendRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await client.predictTrend(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const chat = useCallback(async (request: AIChatRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await client.chat(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    generateChart,
    predictTrend,
    chat,
    loading,
    error,
    clearError,
  };
}
