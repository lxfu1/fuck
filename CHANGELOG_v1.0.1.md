# Changelog v1.0.1

## 修复与改进

### 🔧 修复

1. **修复接口路径重复问题**
   - 问题：SDK 在请求时会出现 `/api/api/charts/generate` 的路径重复
   - 原因：SDK 内部已添加 `/api` 前缀，但 baseUrl 配置时也包含了 `/api`
   - 解决：
     - SDK 构造函数现在会自动去除 baseUrl 末尾的斜杠
     - 改进了 endpoint 的清理逻辑
     - 现在支持两种配置方式：
       - `baseUrl: "http://localhost:3000"` - SDK 将请求 `http://localhost:3000/api/charts/generate`
       - `baseUrl: "/api"` - SDK 将请求 `/api/charts/generate`（用于代理）

2. **去除 pnpm 版本限制**
   - 移除了 `package.json` 中的 `pnpm` 版本约束
   - 移除了 `packageManager` 字段
   - 现在可以使用任何版本的 pnpm（>= 8.0.0 推荐）

### 📚 文档更新

1. **SDK README**
   - 新增"Configuration"章节
   - 详细说明 baseUrl 的两种使用方式
   - 添加重要提示，避免用户错误配置

2. **QUICKSTART.md**
   - 更新 API Client 示例
   - 添加 baseUrl 配置说明
   - 说明 SDK 自动添加 `/api` 前缀的行为

### 🔍 技术细节

#### SDK API 客户端改动

```typescript
// 之前
constructor(config: ClientConfig) {
  this.baseUrl = config.baseUrl || 'https://api.insight-studio.ai';
}

// 之后
constructor(config: ClientConfig) {
  this.baseUrl = (config.baseUrl || 'https://api.insight-studio.ai').replace(/\/$/, '');
}

// 改进的 request 方法
private async request<T>(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${this.baseUrl}${cleanEndpoint}`;
  // ...
}
```

### ✅ 测试

- ✅ 所有包构建成功
- ✅ TypeScript 类型检查通过
- ✅ SDK 打包正常（CJS + ESM）
- ✅ Web 应用构建成功

### 🎯 使用示例

#### 正确配置示例

```typescript
// ✅ 正确 - 直接指向服务器
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000'
});
// 将请求: http://localhost:3000/api/charts/generate

// ✅ 正确 - 使用代理
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: '/api'
});
// 将请求: /api/charts/generate

// ❌ 错误 - 不要这样做
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000/api'  // 会导致 /api/api/... 重复
});
```

### 📦 版本信息

- **版本**: v1.0.1
- **发布日期**: 2024-01-06
- **构建状态**: ✅ 通过
- **兼容性**: 与 v1.0.0 完全兼容

### 🚀 升级指南

如果你已经在使用 v1.0.0，升级到 v1.0.1 非常简单：

1. 更新依赖：
   ```bash
   pnpm update @insight-studio/sdk
   ```

2. 检查你的 baseUrl 配置：
   - 如果使用 `http://localhost:3000/api`，改为 `http://localhost:3000`
   - 如果使用 `/api`，无需更改

3. 重新构建项目：
   ```bash
   pnpm build
   ```

### 🐛 已知问题

- 无

### 📝 下一步计划

- 添加单元测试和集成测试
- 性能优化
- 更多的示例和文档

---

**感谢使用 Insight Studio！**

如有问题，请在 GitHub Issues 中反馈。
