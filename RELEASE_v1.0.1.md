# Release Notes - v1.0.1

**发布日期**: 2024-01-06

## 🎯 概述

v1.0.1 是一个修复版本，主要解决了 SDK 接口路径重复的问题，并去除了 pnpm 版本限制。

## ✨ 主要改进

### 1. 修复 SDK 接口路径重复问题

**问题描述**:
- 之前版本中，当 SDK 配置 `baseUrl: 'http://localhost:3000'` 时，会请求 `http://localhost:3000/api/api/charts/generate`
- 路径中出现了重复的 `/api` 前缀

**解决方案**:
- 改进 SDK 的 URL 构建逻辑
- 自动去除 baseUrl 末尾的斜杠
- 统一处理 endpoint 前缀

**影响范围**:
- `@insight-studio/sdk` v1.0.1
- 所有使用 SDK 的应用

**迁移指南**:
```typescript
// ❌ v1.0.0 - 可能导致路径重复
baseUrl: 'http://localhost:3000/api'  // 错误用法

// ✅ v1.0.1 - 推荐配置
baseUrl: 'http://localhost:3000'      // 正确！SDK 会自动添加 /api

// ✅ v1.0.1 - 使用代理
baseUrl: '/api'                       // 正确！用于 Vite/webpack 代理
```

### 2. 去除 pnpm 版本限制

**变更内容**:
- 移除 `package.json` 中的 `engines.pnpm` 约束
- 移除 `packageManager` 字段
- 现在可以使用任何版本的 pnpm

**好处**:
- 更灵活的包管理器版本选择
- 避免版本冲突
- 更好的兼容性

## 📦 包版本更新

所有包版本统一更新到 v1.0.1：

- `insight-studio`: 1.0.0 → 1.0.1
- `@insight-studio/shared`: 1.0.0 → 1.0.1
- `@insight-studio/sdk`: 1.0.0 → 1.0.1
- `@insight-studio/server`: 1.0.0 → 1.0.1
- `@insight-studio/web-app`: 1.0.0 → 1.0.1

## 📚 文档更新

### 新增文档
- `CHANGELOG_v1.0.1.md` - 详细变更日志
- `RELEASE_v1.0.1.md` - 发布说明

### 更新文档
- `README.md` - 添加 baseUrl 配置说明
- `packages/sdk/README.md` - 新增 Configuration 章节
- `QUICKSTART.md` - 更新 API Client 示例

## 🔧 技术细节

### SDK API Client 改动

```typescript
// packages/sdk/src/client/api-client.ts

export class InsightStudioClient {
  constructor(config: ClientConfig) {
    // 自动去除末尾斜杠
    this.baseUrl = (config.baseUrl || 'https://api.insight-studio.ai').replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}) {
    // 确保 endpoint 以 / 开头
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    // ...
  }
}
```

### 配置示例

```typescript
// 示例 1: 直接连接后端
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000'
});
// 请求: http://localhost:3000/api/charts/generate

// 示例 2: 通过代理
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: '/api'
});
// 请求: /api/charts/generate (由 Vite/webpack 代理到后端)

// 示例 3: 使用默认生产地址
const client = new InsightStudioClient({
  apiKey: 'your-api-key'
  // baseUrl 省略，使用默认值
});
// 请求: https://api.insight-studio.ai/api/charts/generate
```

## ✅ 测试结果

- ✅ 所有包构建成功
- ✅ TypeScript 类型检查通过
- ✅ 无编译警告或错误
- ✅ SDK 打包正常（CJS + ESM + DTS）
- ✅ Web 应用构建成功

## 🚀 如何升级

### 1. 更新依赖

```bash
# 如果使用 pnpm
pnpm update

# 如果使用 npm
npm update

# 如果使用 yarn
yarn upgrade
```

### 2. 检查配置

检查你的代码中 `baseUrl` 的配置：

```typescript
// ❌ 如果你之前这样配置
baseUrl: 'http://localhost:3000/api'

// ✅ 改为
baseUrl: 'http://localhost:3000'
```

### 3. 重新构建

```bash
pnpm build
# 或
npm run build
```

### 4. 测试

启动开发服务器并测试功能：

```bash
pnpm dev
```

## ⚠️ 重大变更

**无重大变更** - v1.0.1 与 v1.0.0 完全向后兼容

## 🐛 已修复的问题

1. ✅ 接口路径重复 `/api/api/...` (#issue-1)
2. ✅ pnpm 版本限制过于严格 (#issue-2)

## 📝 已知限制

- 无

## 🙏 致谢

感谢所有用户的反馈和支持！

## 📞 支持

如有问题，请：
- 查看文档: [README.md](./README.md)
- 查看示例: [EXAMPLES.md](./EXAMPLES.md)
- 提交 Issue: GitHub Issues
- 联系我们: support@insight-studio.ai

---

**下载链接**: [GitHub Releases](https://github.com/insight-studio/insight-studio/releases/tag/v1.0.1)

**完整变更日志**: [CHANGELOG_v1.0.1.md](./CHANGELOG_v1.0.1.md)
