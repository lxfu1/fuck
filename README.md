# Insight Studio

> Insight Studio 不是一个 AI 画图工具，而是一个以可视化 Grammar 为核心的 AI 决策系统。

## 核心能力

1. **自然语言 → 高质量 AntV 图表** - 通过自然语言描述，自动生成专业的可视化图表
2. **自动生成"洞察叙事"（Explanation Schema）** - AI 自动分析数据并生成洞察报告
3. **可嵌入、可二次开发（开发者友好）** - 提供完整的 SDK 和 API

## 项目结构

```
insight-studio/
├── packages/
│   ├── web-app/          # 主 Web 应用
│   ├── server/           # 后端服务
│   ├── sdk/              # SDK (React/Vue)
│   └── shared/           # 共享代码
├── pnpm-workspace.yaml   # Monorepo 配置
└── package.json
```

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI 框架**: Ant Design
- **图表库**: AntV (G2Plot, G6, X6, L7, S2)
- **后端**: Node.js + Express + TypeScript
- **Monorepo**: pnpm workspace

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 配置 AI 服务（可选）

Insight Studio 使用智谱 AI 的 GLM-4 模型提供 AI 对话功能。

```bash
# 复制环境变量模板
cp packages/server/.env.example packages/server/.env

# 编辑 .env 文件，添加你的 GLM API Key
# GLM_API_KEY=your-glm-api-key-here
```

详细配置请参考：[GLM-4 配置指南](./docs/GLM_SETUP.md)

> **注意**: 如果不配置 API Key，AI 功能会使用内置的规则引擎，不影响核心图表生成功能。

### 开发模式

```bash
# 启动所有服务
pnpm dev

# 启动特定服务
pnpm --filter @insight-studio/web-app dev
pnpm --filter @insight-studio/server dev
```

### 构建

```bash
pnpm build
```

## 核心功能

### 1. 图表生成 (P0)

- ✅ 支持自然语言输入可视化需求
- ✅ 覆盖 60+ 图表类型
- ✅ 支持多种数据源（图片、CSV、Excel）
- ✅ AI 自动解析需求并匹配最佳 AntV 方案
- ✅ 实时渲染与样式调整
- ✅ 自动检测并优化图表可读性

### 2. 数据洞察（BI）(P0)

- ✅ AI 趋势预测
- ✅ 异常预警
- ✅ 决策建议报告

### 3. 可视化看板 (P0)

- ✅ 模板中心
- ✅ AI 对话调整看板
- ✅ 分享与导出

### 4. 模板、数据沉淀 (P0)

- ✅ 示例广场
- ✅ 用户动线记录

### 5. 埋点与监控 (P0)

- ✅ 运维监控仪表盘
- ✅ 性能指标追踪

### 6. SDK / API (P1)

- ✅ React SDK
- ✅ Vue SDK
- ✅ 自定义模型支持
- ✅ API 集成

## SDK 使用示例

### React

```tsx
import { InsightStudio } from '@insight-studio/sdk/react';

function App() {
  return (
    <InsightStudio
      apiKey="your-api-key"
      baseUrl="http://localhost:3000"
      onChartGenerate={(chart) => console.log(chart)}
    />
  );
}
```

> **注意**: SDK 会自动在所有端点前添加 `/api` 前缀。所以 `baseUrl: 'http://localhost:3000'` 会请求 `http://localhost:3000/api/charts/generate`。

### Vue

```vue
<template>
  <InsightStudio
    :api-key="apiKey"
    base-url="http://localhost:3000"
    @chart-generate="onChartGenerate"
  />
</template>

<script setup>
import { InsightStudio } from '@insight-studio/sdk/vue';

const apiKey = 'your-api-key';
const onChartGenerate = (chart) => console.log(chart);
</script>
```

## API 文档

详见 [API Documentation](./packages/server/README.md)

## 许可证

MIT License
