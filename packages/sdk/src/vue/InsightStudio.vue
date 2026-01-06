<template>
  <div 
    :class="className" 
    :style="containerStyle"
  >
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0">Insight Studio</h2>
      <input
        v-model="query"
        type="text"
        placeholder="描述你想要的图表，例如：展示过去6个月的销售趋势"
        :style="inputStyle"
        @keypress.enter="handleGenerate"
      />
    </div>

    <button
      @click="handleGenerate"
      :disabled="loading || !query.trim()"
      :style="buttonStyle"
    >
      {{ loading ? '生成中...' : '生成图表' }}
    </button>

    <div v-if="chart" style="margin-top: 24px">
      <h3 style="margin: 0 0 16px 0">生成的图表</h3>
      <div :style="chartContainerStyle">
        <pre style="margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-word">{{ JSON.stringify(chart.config, null, 2) }}</pre>
      </div>
    </div>

    <div v-if="explanation" style="margin-top: 24px">
      <h3 style="margin: 0 0 16px 0">洞察解释</h3>
      <div :style="chartContainerStyle">
        <h4 style="margin: 0 0 8px 0">{{ explanation.narrative.title }}</h4>
        <p style="margin: 0 0 12px 0">{{ explanation.narrative.summary }}</p>
        <div v-if="explanation.narrative.keyFindings.length > 0">
          <strong>关键发现：</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px">
            <li 
              v-for="(finding, index) in explanation.narrative.keyFindings" 
              :key="index"
              style="margin-bottom: 4px"
            >
              {{ finding }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { InsightStudioClient } from '../client/api-client';
import type { 
  ChartResult, 
  ExplanationSchema,
  GenerateChartRequest,
} from '@insight-studio/shared';

interface Props {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark';
  className?: string;
  style?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const emit = defineEmits<{
  chartGenerate: [chart: ChartResult];
  error: [error: Error];
}>();

const client = new InsightStudioClient({ 
  apiKey: props.apiKey, 
  baseUrl: props.baseUrl 
});

const query = ref('');
const loading = ref(false);
const chart = ref<ChartResult | null>(null);
const explanation = ref<ExplanationSchema | null>(null);

const containerStyle = computed(() => ({
  padding: '24px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  backgroundColor: props.theme === 'dark' ? '#1f1f1f' : '#ffffff',
  color: props.theme === 'dark' ? '#ffffff' : '#000000',
  ...props.style,
}));

const inputStyle = computed(() => ({
  width: '100%',
  padding: '12px',
  fontSize: '14px',
  border: `1px solid ${props.theme === 'dark' ? '#444' : '#d9d9d9'}`,
  borderRadius: '4px',
  backgroundColor: props.theme === 'dark' ? '#2a2a2a' : '#ffffff',
  color: props.theme === 'dark' ? '#ffffff' : '#000000',
}));

const buttonStyle = computed(() => ({
  padding: '12px 24px',
  fontSize: '14px',
  backgroundColor: loading.value ? '#999' : '#1890ff',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: loading.value ? 'not-allowed' : 'pointer',
  fontWeight: '500',
}));

const chartContainerStyle = computed(() => ({
  padding: '16px',
  border: `1px solid ${props.theme === 'dark' ? '#444' : '#d9d9d9'}`,
  borderRadius: '4px',
  backgroundColor: props.theme === 'dark' ? '#2a2a2a' : '#fafafa',
}));

const handleGenerate = async () => {
  if (!query.value.trim()) return;

  loading.value = true;
  try {
    const request: GenerateChartRequest = {
      query: query.value,
      enableWebSearch: true,
    };

    const response = await client.generateChart(request);
    const generatedChart = response.selectedChart;

    if (generatedChart) {
      chart.value = generatedChart;
      explanation.value = response.explanation || null;
      emit('chartGenerate', generatedChart);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    emit('error', err);
    console.error('Failed to generate chart:', err);
  } finally {
    loading.value = false;
  }
};
</script>
