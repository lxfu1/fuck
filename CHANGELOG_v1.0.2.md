# Changelog v1.0.2

## 🚀 新功能

### 1. 集成智谱 AI GLM-4 模型

**功能描述**:
- 将 AI 对话服务从简单规则引擎升级为智谱 AI 的 GLM-4 大模型
- 提供更智能、更自然的对话体验
- 支持多轮对话和上下文记忆

**技术实现**:
- API 端点: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 模型: `glm-4`
- 认证方式: Bearer Token

**主要特性**:
- ✅ 智能意图识别
- ✅ 上下文对话记忆
- ✅ 专业的数据分析建议
- ✅ 自动降级策略（无 API Key 时使用规则引擎）
- ✅ 完整的错误处理和日志记录

### 2. 新增配置选项

**环境变量**:
```env
# 智谱 AI API Key（首选）
GLM_API_KEY=your-glm-api-key

# OpenAI API Key（可选，作为备选）
OPENAI_API_KEY=your-openai-api-key
```

**配置优先级**:
1. GLM_API_KEY
2. OPENAI_API_KEY
3. 降级到规则引擎

## 📚 文档更新

### 新增文档

1. **GLM-4 配置指南** (`docs/GLM_SETUP.md`)
   - 详细的配置步骤
   - API Key 获取方法
   - 使用示例和最佳实践
   - 故障排查指南
   - 费用说明和优化建议

### 更新文档

1. **README.md**
   - 新增 AI 服务配置章节
   - 添加配置说明链接

2. **QUICKSTART.md**
   - 添加配置步骤
   - 更新环境设置说明

3. **.env.example**
   - 添加 GLM_API_KEY 配置项
   - 注释说明优先级

## 🔧 技术细节

### AI Service 架构

```typescript
export class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  private model: string = 'glm-4';

  constructor() {
    // 优先使用 GLM_API_KEY，其次使用 OPENAI_API_KEY
    this.apiKey = process.env.GLM_API_KEY || process.env.OPENAI_API_KEY || '';
  }

  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    if (!this.apiKey) {
      // 降级到规则引擎
      return this.getFallbackResponse(request.message);
    }

    try {
      // 调用 GLM-4 API
      const response = await this.callGLMAPI(request);
      return this.parseAIResponse(response, request);
    } catch (error) {
      // 错误时降级
      return this.getFallbackResponse(request.message);
    }
  }
}
```

### 请求格式

```typescript
interface GLMRequest {
  model: "glm-4",
  messages: [
    {
      role: "system",
      content: "系统提示词..."
    },
    {
      role: "user",
      content: "用户消息"
    }
  ],
  temperature: 0.7,
  top_p: 0.9,
  stream: false
}
```

### 响应处理

```typescript
interface GLMResponse {
  choices: [{
    message: {
      role: "assistant",
      content: "AI 回复内容"
    }
  }],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 20,
    total_tokens: 30
  }
}
```

## ✨ 改进点

### 1. 智能对话

**之前**:
- 简单的关键词匹配
- 固定的回复模板
- 无上下文记忆

**现在**:
- 理解用户意图
- 自然语言回复
- 支持多轮对话
- 记忆对话历史

### 2. 系统提示词

设计了专业的系统提示词：

```
你是 Insight Studio 的 AI 助手，专门帮助用户进行数据可视化和分析。
你的能力包括：
1. 帮助用户生成各种类型的数据可视化图表（支持 60+ 种图表类型）
2. 创建和管理数据看板
3. 进行数据分析和洞察
4. 提供数据趋势预测
5. 检测数据异常

请用简洁、专业的语言回答用户问题，并在适当时候建议用户创建图表或看板。
```

### 3. 错误处理

- ✅ API 请求失败自动降级
- ✅ 详细的错误日志
- ✅ 不影响核心功能
- ✅ 友好的错误提示

### 4. 性能优化

- ✅ 异步请求处理
- ✅ 超时控制
- ✅ 错误重试机制（未来）
- ✅ 响应缓存（未来）

## 📦 版本信息

- **版本**: v1.0.2
- **发布日期**: 2024-01-06
- **构建状态**: ✅ 通过
- **兼容性**: 与 v1.0.1 完全兼容

## 🚀 升级指南

### 从 v1.0.1 升级

1. **拉取最新代码**:
   ```bash
   git pull origin main
   ```

2. **安装依赖**:
   ```bash
   pnpm install
   ```

3. **配置 GLM API Key**:
   ```bash
   cp packages/server/.env.example packages/server/.env
   # 编辑 .env 文件，添加 GLM_API_KEY
   ```

4. **重新构建**:
   ```bash
   pnpm build
   ```

5. **启动服务**:
   ```bash
   pnpm dev
   ```

### 获取 GLM API Key

1. 访问 https://open.bigmodel.cn/
2. 注册并登录
3. 进入「API Keys」页面
4. 创建新的 API Key
5. 复制到 `.env` 文件

详细步骤请参考: [GLM-4 配置指南](./docs/GLM_SETUP.md)

## 💡 使用示例

### 基础对话

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "帮我分析这个月的销售数据"
  }'
```

### 多轮对话

```typescript
const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000'
});

// 第一轮
const response1 = await client.chat({
  message: '展示销售趋势'
});

// 第二轮（带上下文）
const response2 = await client.chat({
  message: '这个趋势正常吗？',
  context: {
    history: [
      { role: 'user', content: '展示销售趋势' },
      { role: 'assistant', content: response1.message }
    ]
  }
});
```

## ⚠️ 重要提示

### 1. API Key 安全

- ✅ 不要将 API Key 提交到 Git
- ✅ 使用环境变量管理
- ✅ 定期轮换密钥
- ✅ 设置使用额度限制

### 2. 成本控制

GLM-4 按 Token 计费，建议：

- 精简系统提示词
- 控制对话历史长度
- 缓存常见问题回答
- 监控使用量

### 3. 降级策略

即使不配置 API Key，系统仍可正常运行：

- AI 对话使用规则引擎
- 核心图表生成功能不受影响
- 其他功能完全可用

## ✅ 测试验证

### 1. 测试 AI 对话

```bash
# 基础对话
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'

# 图表建议
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我想创建一个销售图表"}'
```

### 2. 检查日志

启动服务器时，应该看到：

```
🚀 Insight Studio Server running on port 3000
Environment: development
```

如果配置了 API Key，不会有警告信息。

如果未配置，会看到：
```
⚠️  GLM_API_KEY or OPENAI_API_KEY not set. AI features will use fallback responses.
```

### 3. 功能验证

- ✅ AI 对话响应自然流畅
- ✅ 能识别图表、看板、分析等意图
- ✅ 提供合理的建议和操作
- ✅ 支持多轮对话

## 🐛 已知问题

- 无

## 📝 下一步计划

- [ ] 支持流式输出
- [ ] 实现响应缓存
- [ ] 添加对话历史管理
- [ ] 支持更多 AI 模型
- [ ] 优化系统提示词
- [ ] 添加使用统计

## 🙏 致谢

感谢智谱 AI 提供的优秀大模型服务！

## 📞 支持

- 文档: [GLM-4 配置指南](./docs/GLM_SETUP.md)
- 示例: [EXAMPLES.md](./EXAMPLES.md)
- Issues: GitHub Issues
- 智谱 AI 支持: https://open.bigmodel.cn/

---

**完整变更日志**: 查看 [CHANGELOG.md](./CHANGELOG.md)
