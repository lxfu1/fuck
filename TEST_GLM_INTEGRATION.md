# GLM-4 集成测试指南

## 测试目的

验证智谱 AI GLM-4 模型集成是否正常工作。

## 前置条件

1. 已安装依赖：`pnpm install`
2. 已构建项目：`pnpm build`
3. 已配置 GLM API Key（如果要测试真实 API）

## 测试场景

### 场景 1: 无 API Key（降级模式）

测试在没有配置 API Key 的情况下，系统能否正常降级到规则引擎。

**步骤**:

1. 启动服务器（不配置 GLM_API_KEY）
   ```bash
   cd packages/server
   pnpm dev
   ```

2. 观察日志，应该看到：
   ```
   ⚠️  GLM_API_KEY or OPENAI_API_KEY not set. AI features will use fallback responses.
   ```

3. 测试 AI 对话：
   ```bash
   curl -X POST http://localhost:3000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "你好"
     }'
   ```

4. **预期结果**:
   ```json
   {
     "success": true,
     "data": {
       "message": "你好！我是 Insight Studio AI 助手...",
       "action": { "type": "none" },
       "suggestions": ["生成图表", "创建看板", "数据分析"]
     }
   }
   ```

### 场景 2: 有 API Key（真实 AI）

测试使用真实的 GLM-4 API 进行对话。

**步骤**:

1. 配置 API Key
   ```bash
   cd packages/server
   cp .env.example .env
   # 编辑 .env，添加 GLM_API_KEY=your-real-api-key
   ```

2. 启动服务器
   ```bash
   pnpm dev
   ```

3. 测试基础对话：
   ```bash
   curl -X POST http://localhost:3000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "介绍一下 Insight Studio"
     }'
   ```

4. **预期结果**:
   - 返回自然语言回复
   - 内容与 Insight Studio 相关
   - 响应时间 < 3 秒

### 场景 3: 图表生成意图识别

测试 AI 能否识别图表生成意图。

**请求**:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "我想创建一个销售趋势图"
  }'
```

**预期结果**:
```json
{
  "success": true,
  "data": {
    "message": "...",
    "action": {
      "type": "create_chart",
      "payload": {
        "suggestedQuery": "我想创建一个销售趋势图"
      }
    },
    "suggestions": ["展示销售趋势", "对比各地区业绩", "查看用户增长情况"]
  }
}
```

### 场景 4: 多轮对话

测试上下文对话功能。

**第一轮**:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "展示销售数据"
  }'
```

**第二轮（带历史）**:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "按照地区分组",
    "context": {
      "history": [
        {
          "role": "user",
          "content": "展示销售数据"
        },
        {
          "role": "assistant",
          "content": "好的，我可以帮你展示销售数据..."
        }
      ]
    }
  }'
```

**预期结果**:
- AI 能够理解上下文
- 回复与之前的对话相关

### 场景 5: 错误处理

测试 API 错误时的降级处理。

**模拟错误**:
使用错误的 API Key：
```bash
GLM_API_KEY=invalid-key pnpm dev
```

**测试请求**:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'
```

**预期结果**:
- 服务器日志显示错误
- 但仍返回降级响应
- 不会导致服务崩溃

## 性能测试

### 响应时间测试

```bash
# 测试 10 次请求的平均响应时间
for i in {1..10}; do
  time curl -X POST http://localhost:3000/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "你好"}' > /dev/null 2>&1
done
```

**预期**:
- 降级模式: < 50ms
- 真实 API: < 3000ms

### 并发测试

```bash
# 使用 Apache Bench 测试
ab -n 100 -c 10 -T 'application/json' \
  -p test-data.json \
  http://localhost:3000/api/ai/chat
```

**预期**:
- 无错误
- 稳定的响应时间

## SDK 测试

### React SDK

```tsx
import { useInsightStudio } from '@insight-studio/sdk/react';

function TestComponent() {
  const { chat, loading, error } = useInsightStudio({
    apiKey: 'test',
    baseUrl: 'http://localhost:3000'
  });

  const handleTest = async () => {
    const result = await chat({
      message: '帮我分析数据'
    });
    console.log('Result:', result);
  };

  return (
    <div>
      <button onClick={handleTest} disabled={loading}>
        测试 AI 对话
      </button>
      {error && <p>错误: {error.message}</p>}
    </div>
  );
}
```

**预期**:
- 能正常调用
- loading 状态正确
- 错误处理正常

### API Client

```typescript
import { InsightStudioClient } from '@insight-studio/sdk';

const client = new InsightStudioClient({
  apiKey: 'test',
  baseUrl: 'http://localhost:3000'
});

async function test() {
  const response = await client.chat({
    message: '你好'
  });
  
  console.log('Message:', response.message);
  console.log('Action:', response.action);
  console.log('Suggestions:', response.suggestions);
}

test();
```

**预期**:
- 返回完整的响应对象
- 包含 message、action、suggestions

## 验证清单

### 功能验证

- [ ] 无 API Key 时使用降级模式 ✅
- [ ] 有 API Key 时调用真实 API ✅
- [ ] 识别图表生成意图 ✅
- [ ] 识别看板管理意图 ✅
- [ ] 识别数据分析意图 ✅
- [ ] 支持多轮对话 ✅
- [ ] 错误时自动降级 ✅

### 性能验证

- [ ] 降级模式响应 < 50ms ✅
- [ ] API 调用响应 < 3s ✅
- [ ] 无内存泄漏 ✅
- [ ] 能处理并发请求 ✅

### 安全验证

- [ ] API Key 不在日志中显示 ✅
- [ ] 错误信息不泄露敏感数据 ✅
- [ ] 请求参数正确验证 ✅

## 已知限制

1. **API 配额**
   - GLM-4 按 Token 计费
   - 需要监控使用量

2. **响应时间**
   - 网络延迟可能影响响应
   - 建议设置合理的超时时间

3. **降级策略**
   - 降级模式功能有限
   - 仅提供基础的关键词匹配

## 故障排查

### 问题 1: API 返回 401

**原因**: API Key 无效或未配置

**解决**:
1. 检查 .env 文件中的 GLM_API_KEY
2. 确认 API Key 是否正确
3. 验证账户余额

### 问题 2: 请求超时

**原因**: 网络问题或 API 响应慢

**解决**:
1. 检查网络连接
2. 增加超时时间
3. 使用降级模式

### 问题 3: 响应格式错误

**原因**: API 返回格式不符合预期

**解决**:
1. 检查 API 文档
2. 验证请求参数
3. 查看服务器日志

## 测试报告模板

```markdown
## GLM-4 集成测试报告

**测试日期**: 2024-01-06
**测试人员**: Your Name
**版本**: v1.0.2

### 测试结果

| 场景 | 状态 | 备注 |
|------|------|------|
| 无 API Key 降级 | ✅ 通过 | 正常使用规则引擎 |
| 真实 API 调用 | ✅ 通过 | 响应时间 1.2s |
| 意图识别 | ✅ 通过 | 准确识别图表/看板/分析 |
| 多轮对话 | ✅ 通过 | 上下文正确保持 |
| 错误处理 | ✅ 通过 | 自动降级 |

### 性能指标

- 降级模式平均响应时间: 25ms
- API 调用平均响应时间: 1.5s
- 并发处理: 100 req/s
- 错误率: 0%

### 问题与建议

- 无严重问题
- 建议：添加响应缓存以提高性能

### 结论

✅ GLM-4 集成测试通过，可以发布到生产环境。
```

## 参考资料

- [GLM-4 配置指南](./docs/GLM_SETUP.md)
- [智谱 AI 文档](https://open.bigmodel.cn/dev/api)
- [API 文档](./docs/API.md)

---

**版本**: v1.0.2  
**更新日期**: 2024-01-06
