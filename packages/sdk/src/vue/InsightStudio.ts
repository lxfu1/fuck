import { defineComponent, ref, computed, h } from 'vue';
import { InsightStudioClient } from '../client/api-client';
import type { 
  ChartResult, 
  ExplanationSchema,
  GenerateChartRequest,
} from '@insight-studio/shared';

export interface InsightStudioProps {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark';
  className?: string;
  style?: Record<string, string>;
}

export const InsightStudio = defineComponent({
  name: 'InsightStudio',
  props: {
    apiKey: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      default: undefined,
    },
    theme: {
      type: String as () => 'light' | 'dark',
      default: 'light',
    },
    className: {
      type: String,
      default: undefined,
    },
    style: {
      type: Object as () => Record<string, string>,
      default: () => ({}),
    },
  },
  emits: ['chartGenerate', 'error'],
  setup(props, { emit }) {
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

    return () => h('div', {
      class: props.className,
      style: containerStyle.value,
    }, [
      h('div', { style: { marginBottom: '16px' } }, [
        h('h2', { style: { margin: '0 0 16px 0' } }, 'Insight Studio'),
        h('input', {
          type: 'text',
          value: query.value,
          placeholder: '描述你想要的图表，例如：展示过去6个月的销售趋势',
          style: inputStyle.value,
          onInput: (e: Event) => {
            query.value = (e.target as HTMLInputElement).value;
          },
          onKeypress: (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              handleGenerate();
            }
          },
        }),
      ]),

      h('button', {
        onClick: handleGenerate,
        disabled: loading.value || !query.value.trim(),
        style: buttonStyle.value,
      }, loading.value ? '生成中...' : '生成图表'),

      chart.value && h('div', { style: { marginTop: '24px' } }, [
        h('h3', { style: { margin: '0 0 16px 0' } }, '生成的图表'),
        h('div', { style: chartContainerStyle.value }, [
          h('pre', {
            style: {
              margin: 0,
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            },
          }, JSON.stringify(chart.value.config, null, 2)),
        ]),
      ]),

      explanation.value && h('div', { style: { marginTop: '24px' } }, [
        h('h3', { style: { margin: '0 0 16px 0' } }, '洞察解释'),
        h('div', { style: chartContainerStyle.value }, [
          h('h4', { style: { margin: '0 0 8px 0' } }, explanation.value.narrative.title),
          h('p', { style: { margin: '0 0 12px 0' } }, explanation.value.narrative.summary),
          explanation.value.narrative.keyFindings.length > 0 && h('div', [
            h('strong', '关键发现：'),
            h('ul', { style: { margin: '8px 0 0 0', paddingLeft: '20px' } },
              explanation.value.narrative.keyFindings.map(finding =>
                h('li', { style: { marginBottom: '4px' } }, finding)
              )
            ),
          ]),
        ]),
      ]),
    ]);
  },
});

export default InsightStudio;
