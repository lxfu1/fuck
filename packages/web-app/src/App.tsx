import { InsightStudio } from '@insight-studio/sdk/react';
import type { ChartResult } from '@insight-studio/shared';

function App() {
  const handleChartGenerate = (chart: ChartResult) => {
    console.log('Chart generated:', chart);
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{
        backgroundColor: '#1890ff',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            ✨ Insight Studio
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            AI 驱动的可视化 Grammar 决策系统
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <InsightStudio
            apiKey="demo-api-key"
            baseUrl="/api"
            theme="light"
            onChartGenerate={handleChartGenerate}
            onError={handleError}
          />
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>核心功能</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            <FeatureCard
              icon="📊"
              title="图表生成"
              description="自然语言转 AntV 图表，支持 60+ 图表类型"
            />
            <FeatureCard
              icon="🔍"
              title="数据洞察"
              description="AI 趋势预测、异常检测、决策建议"
            />
            <FeatureCard
              icon="📈"
              title="可视化看板"
              description="拖拽式看板编辑，支持分享和导出"
            />
            <FeatureCard
              icon="🎨"
              title="模板中心"
              description="行业模板库，一键复用并自定义"
            />
            <FeatureCard
              icon="🤖"
              title="AI 助手"
              description="对话式交互，智能调整图表和看板"
            />
            <FeatureCard
              icon="📦"
              title="SDK / API"
              description="支持 React/Vue，可集成到自有系统"
            />
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '16px' }}>技术栈</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['React', 'TypeScript', 'Vite', 'AntV', 'Node.js', 'Express', 'AI/LLM'].map(tech => (
              <span
                key={tech}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#999',
        fontSize: '14px',
      }}>
        <p>© 2024 Insight Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{title}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  );
}

export default App;
