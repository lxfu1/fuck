# 智谱 AI (GLM-4) 配置指南

Insight Studio 使用智谱 AI 的 GLM-4 模型提供 AI 对话和辅助功能。

## 获取 API Key

1. 访问智谱 AI 开放平台：https://open.bigmodel.cn/
2. 注册并登录账号
3. 进入「API Keys」页面
4. 创建新的 API Key
5. 复制 API Key 备用

## 配置方法

### 方法 1：环境变量（推荐）

在项目根目录创建 `.env` 文件：

```bash
# 复制示例文件
cp packages/server/.env.example packages/server/.env

# 编辑 .env 文件
nano packages/server/.env
```

配置你的 API Key：

```env
# 智谱 AI API Key
GLM_API_KEY=your-glm-api-key-here

# 可选：作为备选的 OpenAI API Key
OPENAI_API_KEY=your-openai-api-key
```

### 方法 2：系统环境变量

```bash
# Linux/macOS
export GLM_API_KEY="your-glm-api-key-here"

# Windows (PowerShell)
$env:GLM_API_KEY="your-glm-api-key-here"

# Windows (CMD)
set GLM_API_KEY=your-glm-api-key-here
```

## API 配置详情

### 模型信息

- **模型名称**: `glm-4`
- **API 端点**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **认证方式**: Bearer Token
- **请求格式**: JSON

### 请求参数

```typescript
{
  model: "glm-4",           // 模型名称
  messages: [               // 对话消息列表
    {
      role: "system",       // 系统提示
      content: "..."
    },
    {
      role: "user",         // 用户消息
      content: "..."
    }
  ],
  temperature: 0.7,         // 温度参数 (0-1)
  top_p: 0.9,              // 采样参数
  stream: false            // 是否流式输出
}
```

### 响应格式

```typescript
{
  id: "chatcmpl-xxx",
  created: 1234567890,
  model: "glm-4",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "AI 回复内容"
      },
      finish_reason: "stop"
    }
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 20,
    total_tokens: 30
  }
}
```

## 功能特性

### 1. 智能对话

系统会自动识别用户意图，提供相应的帮助：

- 图表生成建议
- 看板管理指导
- 数据分析洞察
- 趋势预测建议

### 2. 上下文记忆

支持多轮对话，AI 会记住之前的对话内容：

```typescript
const response = await client.chat({
  message: "这个数据有什么特点？",
  context: {
    history: [
      { role: 'user', content: '生成销售趋势图' },
      { role: 'assistant', content: '已为您生成' }
    ]
  }
});
```

### 3. 降级策略

如果未配置 API Key 或请求失败，系统会自动使用内置的规则引擎：

- 关键词匹配
- 预定义响应
- 功能建议

不会影响核心图表生成功能。

## 使用示例

### API 调用

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "帮我分析销售数据"
  }'
```

### SDK 调用

#### React

```tsx
import { useInsightStudio } from '@insight-studio/sdk/react';

function ChatComponent() {
  const { chat, loading, error } = useInsightStudio({
    apiKey: 'your-api-key',
    baseUrl: 'http://localhost:3000'
  });

  const handleChat = async () => {
    const response = await chat({
      message: '帮我分析销售数据',
      context: {
        history: []
      }
    });
    
    console.log(response);
  };

  return <button onClick={handleChat}>咨询 AI</button>;
}
```

#### JavaScript/Node.js

```javascript
const { InsightStudioClient } = require('@insight-studio/sdk');

const client = new InsightStudioClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000'
});

async function chatWithAI() {
  const response = await client.chat({
    message: '帮我分析销售数据'
  });
  
  console.log(response.message);
  console.log('建议操作:', response.action);
  console.log('相关建议:', response.suggestions);
}
```

## 费用说明

### GLM-4 定价

详细定价请访问：https://open.bigmodel.cn/pricing

- 按 Token 计费
- 输入和输出分别计费
- 提供免费额度（新用户）

### 成本优化建议

1. **精简 System Prompt**
   - 系统提示词会在每次请求中发送
   - 保持简洁明确

2. **控制对话历史长度**
   - 只保留必要的上下文
   - 定期清理历史记录

3. **使用合适的温度参数**
   - 降低温度可减少生成的随机性
   - 提高响应的一致性和可预测性

4. **启用缓存（未来功能）**
   - 缓存常见问题的回答
   - 减少重复请求

## 故障排查

### 问题 1: API Key 无效

**错误信息**: `GLM API Error: 401 Unauthorized`

**解决方法**:
1. 检查 API Key 是否正确
2. 确认 API Key 是否已激活
3. 验证账户是否有足够余额

### 问题 2: 请求超时

**错误信息**: `GLM API request failed: timeout`

**解决方法**:
1. 检查网络连接
2. 确认防火墙设置
3. 尝试增加超时时间

### 问题 3: 请求频率限制

**错误信息**: `GLM API Error: 429 Too Many Requests`

**解决方法**:
1. 降低请求频率
2. 实现请求队列
3. 升级 API 套餐

### 问题 4: 使用降级模式

**日志信息**: `⚠️  GLM_API_KEY or OPENAI_API_KEY not set. AI features will use fallback responses.`

**说明**: 这是正常的降级行为，不影响核心功能。如需 AI 增强功能，请配置 API Key。

## 测试验证

### 1. 测试 API 连接

```bash
# 测试健康检查
curl http://localhost:3000/health

# 测试 AI 聊天（需要先配置 API Key）
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'
```

### 2. 检查日志

启动服务器并观察日志：

```bash
cd packages/server
pnpm dev
```

看到以下信息表示配置成功：
```
🚀 Insight Studio Server running on port 3000
Environment: development
```

如果看到警告信息，请检查 API Key 配置。

## 安全建议

1. **不要提交 API Key 到版本控制**
   - `.env` 文件已在 `.gitignore` 中
   - 使用环境变量或密钥管理服务

2. **定期轮换 API Key**
   - 建议每 3-6 个月更换一次
   - 怀疑泄露时立即更换

3. **限制 API Key 权限**
   - 仅授予必要的权限
   - 设置使用额度限制

4. **监控使用情况**
   - 定期检查 API 使用量
   - 设置异常告警

## 相关链接

- [智谱 AI 开放平台](https://open.bigmodel.cn/)
- [GLM-4 模型文档](https://open.bigmodel.cn/dev/api)
- [API 参考](https://open.bigmodel.cn/dev/api#chatcompletions)
- [定价说明](https://open.bigmodel.cn/pricing)
- [控制台](https://open.bigmodel.cn/usercenter/apikeys)

## 更新日志

### v1.0.1 (2024-01-06)
- ✅ 集成智谱 AI GLM-4 模型
- ✅ 支持多轮对话
- ✅ 实现降级策略
- ✅ 添加详细的系统提示

---

如有问题，请查看 [故障排查](#故障排查) 或提交 Issue。
