# 开发指南

## 开发环境设置

### 必需工具

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装步骤

```bash
# 1. 克隆仓库
git clone <repo-url>
cd insight-studio

# 2. 安装依赖
pnpm install

# 3. 构建所有包
pnpm build

# 4. 启动开发服务器
pnpm dev
```

## 项目架构

### Monorepo 结构

```
insight-studio/
├── packages/
│   ├── shared/          # 共享类型和工具
│   │   ├── src/
│   │   │   ├── types/   # TypeScript 类型定义
│   │   │   ├── constants.ts
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── sdk/             # React/Vue SDK
│   │   ├── src/
│   │   │   ├── client/  # API 客户端
│   │   │   ├── react/   # React 组件
│   │   │   └── vue/     # Vue 组件
│   │   └── package.json
│   │
│   ├── server/          # 后端 API
│   │   ├── src/
│   │   │   ├── controllers/  # 控制器
│   │   │   ├── services/     # 业务逻辑
│   │   │   ├── routes/       # 路由
│   │   │   ├── middleware/   # 中间件
│   │   │   ├── utils/        # 工具函数
│   │   │   └── data/         # 示例数据
│   │   └── package.json
│   │
│   └── web-app/         # Web 应用
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json
│
├── docs/                # 文档
├── pnpm-workspace.yaml
└── package.json
```

### 依赖关系

```
web-app  ──┐
           ├──> sdk ──┐
server  ───┤          ├──> shared
           └──────────┘
```

## 开发工作流

### 1. 添加新功能

```bash
# 创建功能分支
git checkout -b feat/your-feature

# 进行开发
# ...

# 提交更改
git add .
git commit -m "feat: add your feature"

# 推送并创建 PR
git push origin feat/your-feature
```

### 2. 修复 Bug

```bash
# 创建修复分支
git checkout -b fix/bug-description

# 修复 bug
# ...

# 提交更改
git add .
git commit -m "fix: resolve bug description"

# 推送并创建 PR
git push origin fix/bug-description
```

### 3. 更新文档

```bash
# 创建文档分支
git checkout -b docs/update-readme

# 更新文档
# ...

# 提交更改
git add .
git commit -m "docs: update README"

# 推送并创建 PR
git push origin docs/update-readme
```

## 开发命令

### 全局命令

```bash
# 安装依赖
pnpm install

# 启动所有服务（开发模式）
pnpm dev

# 构建所有包
pnpm build

# 清理构建产物
pnpm clean

# 类型检查
pnpm typecheck

# 运行测试（规划中）
pnpm test

# 代码检查（规划中）
pnpm lint
```

### 包特定命令

```bash
# 启动特定包
pnpm --filter @insight-studio/server dev
pnpm --filter @insight-studio/web-app dev
pnpm --filter @insight-studio/sdk dev

# 构建特定包
pnpm --filter @insight-studio/shared build
pnpm --filter @insight-studio/server build

# 清理特定包
pnpm --filter @insight-studio/server clean
```

## 代码规范

### TypeScript

- 使用严格模式
- 显式类型注解
- 避免 `any` 类型
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### 命名约定

- **变量和函数**: camelCase
- **类和组件**: PascalCase
- **常量**: UPPER_CASE
- **私有属性**: _prefixedCamelCase（可选）
- **类型/接口**: PascalCase

```typescript
// 变量和函数
const userName = 'John';
function getUserData() {}

// 类和组件
class UserService {}
function UserProfile() {}

// 常量
const API_ENDPOINT = 'https://api.example.com';
const MAX_RETRIES = 3;

// 类型
interface UserData {}
type UserId = string;
```

### 文件命名

- **组件**: PascalCase.tsx
- **工具函数**: kebab-case.ts
- **类型定义**: kebab-case.ts
- **测试文件**: *.test.ts 或 *.spec.ts

```
components/
  UserProfile.tsx
  ChartDisplay.tsx

utils/
  data-parser.ts
  date-formatter.ts

types/
  chart.ts
  dashboard.ts
```

### 导入顺序

```typescript
// 1. 外部依赖
import React from 'react';
import { Router } from 'express';

// 2. 类型导入
import type { User, Chart } from '@insight-studio/shared';

// 3. 内部模块
import { DataParser } from '../utils/data-parser';
import { ChartService } from '../services/chart.service';

// 4. 样式
import './styles.css';
```

## 添加新功能

### 1. 添加新的 API 端点

#### Step 1: 定义类型 (shared)

```typescript
// packages/shared/src/types/api.ts
export interface NewFeatureRequest {
  param1: string;
  param2: number;
}

export interface NewFeatureResponse {
  result: string;
}
```

#### Step 2: 创建服务 (server)

```typescript
// packages/server/src/services/new-feature.service.ts
import type { NewFeatureRequest, NewFeatureResponse } from '@insight-studio/shared';

export class NewFeatureService {
  async execute(request: NewFeatureRequest): Promise<NewFeatureResponse> {
    // 实现逻辑
    return {
      result: 'success',
    };
  }
}
```

#### Step 3: 创建控制器 (server)

```typescript
// packages/server/src/controllers/new-feature.controller.ts
import { Request, Response } from 'express';
import { NewFeatureService } from '../services/new-feature.service';

export class NewFeatureController {
  private service = new NewFeatureService();

  execute = async (req: Request, res: Response) => {
    try {
      const result = await this.service.execute(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FEATURE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
```

#### Step 4: 创建路由 (server)

```typescript
// packages/server/src/routes/new-feature.routes.ts
import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { NewFeatureController } from '../controllers/new-feature.controller';

const router: RouterType = Router();
const controller = new NewFeatureController();

router.post('/', controller.execute);

export { router as newFeatureRoutes };
```

#### Step 5: 注册路由 (server)

```typescript
// packages/server/src/index.ts
import { newFeatureRoutes } from './routes/new-feature.routes';

// ...

app.use('/api/new-feature', newFeatureRoutes);
```

#### Step 6: 更新 SDK 客户端 (sdk)

```typescript
// packages/sdk/src/client/api-client.ts
export class InsightStudioClient {
  // ...

  async executeNewFeature(request: NewFeatureRequest): Promise<NewFeatureResponse> {
    const response = await this.request<NewFeatureResponse>('/api/new-feature', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to execute feature');
    }
    
    return response.data;
  }
}
```

### 2. 添加新的图表类型

#### Step 1: 更新类型定义

```typescript
// packages/shared/src/types/chart.ts
export type ChartType =
  | 'line'
  // ... existing types
  | 'your-new-chart-type';
```

#### Step 2: 更新常量映射

```typescript
// packages/shared/src/constants.ts
export const CHART_TYPE_TO_LIBRARY: Record<ChartType, ChartLibrary> = {
  // ... existing mappings
  'your-new-chart-type': 'g2plot',
};
```

#### Step 3: 更新图表服务

```typescript
// packages/server/src/services/chart.service.ts
private analyzeQuery(query: string, data: unknown, suggestedTypes: string[]): ChartConfig {
  // ... existing code

  if (lowerQuery.includes('your-keyword')) {
    type = 'your-new-chart-type';
    category = 'your-category';
  }

  // ...
}
```

## 调试技巧

### 后端调试

```typescript
// 添加调试日志
import { createLogger } from './utils/logger';

const logger = createLogger();

logger.debug('Debug information', { data });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error });
```

### 前端调试

```typescript
// React DevTools
// Vue DevTools

// 控制台调试
console.log('Debug:', data);
console.error('Error:', error);

// 使用 debugger
debugger;
```

### API 调试

```bash
# 使用 curl
curl -X POST http://localhost:3000/api/charts/generate \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}' \
  -v

# 使用 httpie
http POST localhost:3000/api/charts/generate query="test"
```

## 性能优化

### 后端

- 使用缓存（Redis）
- 数据库查询优化
- 异步处理
- 压缩响应

### 前端

- 代码分割
- 懒加载
- 图片优化
- 缓存策略

### SDK

- 请求去重
- 批量请求
- 本地缓存

## 常见问题

### 构建失败

```bash
# 清理并重新构建
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### TypeScript 错误

```bash
# 检查类型
pnpm typecheck

# 常见问题：
# 1. 缺少类型导入 - 使用 `import type`
# 2. 类型不匹配 - 检查接口定义
# 3. 循环依赖 - 重构模块结构
```

### 端口冲突

```bash
# 更改端口
PORT=3001 pnpm --filter @insight-studio/server dev

# 或修改 .env 文件
PORT=3001
```

## 发布流程

### 1. 更新版本

```bash
# 更新所有包版本
npm version patch  # 或 minor, major

# 更新 CHANGELOG
# 编辑 CHANGELOG.md
```

### 2. 构建和测试

```bash
pnpm build
pnpm test
```

### 3. 发布

```bash
# 发布到 npm（如果是公开包）
pnpm publish -r

# 或创建 GitHub Release
git tag v1.0.0
git push origin v1.0.0
```

## 资源

### 文档

- [API 文档](./docs/API.md)
- [SDK 文档](./docs/SDK.md)
- [架构文档](./docs/ARCHITECTURE.md)

### 工具

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [AntV](https://antv.vision/)

### 社区

- GitHub Issues
- Discussions
- Stack Overflow

## 获取帮助

- 查看文档
- 搜索现有 Issues
- 创建新 Issue
- 联系维护者
