# 方案B - 完整后端架构设计

## 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                              │
│                  (React + TypeScript)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS 请求
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    前端服务器 (CDN)                           │
│              Vercel / Netlify / 自建 Nginx                   │
│                  提供静态资源 (.jsx, .css)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ API 请求
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    后端 API 服务器                            │
│           Node.js + Express (或 NestJS)                      │
│                                                               │
│  路由：                                                        │
│  - POST /api/analyze      ← 发送用户消息，获取 Claude 分析   │
│  - POST /api/conversation ← 保存对话记录                     │
│  - GET /api/user/:id      ← 获取用户诊断历史                 │
│  - POST /api/auth/login   ← 用户登录                         │
│                                                               │
│  责任：                                                        │
│  ✓ 保护 API Key（不暴露给前端）                              │
│  ✓ 调用 Claude API                                           │
│  ✓ 速率限制（防止滥用）                                      │
│  ✓ 错误处理和日志                                            │
│  ✓ 与数据库交互                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ API 调用
                       ▼
┌──────────────┬──────────────┬──────────────────────────────┐
│              │              │                              │
▼              ▼              ▼                              ▼
MongoDB    Redis Cache   Claude API          文件存储/日志
(用户数据)  (减少API调用) (第三方服务)       (可选)
```

---

## 文件夹结构

```
项目根目录/
├── frontend/                    ← React 前端（现有项目）
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     ← Node.js + Express 后端（新建）
│   ├── src/
│   │   ├── index.js            ← 服务器入口
│   │   ├── routes/
│   │   │   ├── analyze.js      ← /api/analyze 分析消息
│   │   │   ├── conversation.js ← /api/conversation 保存对话
│   │   │   ├── user.js         ← /api/user 用户数据
│   │   │   └── auth.js         ← /api/auth 认证
│   │   │
│   │   ├── controllers/
│   │   │   ├── analyzeController.js   ← 处理分析逻辑
│   │   │   ├── conversationController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── models/             ← 数据库 schema
│   │   │   ├── User.js
│   │   │   ├── Conversation.js
│   │   │   └── Diagnosis.js
│   │   │
│   │   ├── services/
│   │   │   ├── claudeService.js ← 调用 Claude API
│   │   │   ├── dbService.js      ← 数据库操作
│   │   │   └── authService.js    ← 认证逻辑
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js         ← JWT 验证
│   │   │   ├── errorHandler.js ← 错误处理
│   │   │   └── rateLimiter.js  ← 速率限制
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.js       ← 日志记录
│   │   │   ├── validators.js   ← 输入验证
│   │   │   └── constants.js    ← 常量定义
│   │   │
│   │   └── config/
│   │       ├── database.js     ← MongoDB 连接
│   │       ├── env.js          ← 环境变量
│   │       └── claude.js       ← Claude API 配置
│   │
│   ├── .env                    ← 环境变量（本地）
│   ├── .env.example            ← 环境变量模板
│   ├── package.json
│   ├── eslint.config.js        ← 代码规范
│   └── README.md
│
└── docker-compose.yml          ← Docker 配置（可选）
```

---

## 核心技术栈

### 后端框架
```json
{
  "dependencies": {
    "express": "^4.18.2",           // Web 框架
    "mongoose": "^7.0.0",            // MongoDB 驱动
    "dotenv": "^16.0.3",             // 环境变量
    "axios": "^1.4.0",               // HTTP 客户端（调用 Claude）
    "jsonwebtoken": "^9.0.0",        // JWT 认证
    "bcryptjs": "^2.4.3",            // 密码加密
    "express-rate-limit": "^6.7.0",  // 速率限制
    "cors": "^2.8.5",                // 跨域资源共享
    "helmet": "^7.0.0",              // 安全增强
    "joi": "^17.9.2"                 // 数据验证
  },
  "devDependencies": {
    "nodemon": "^3.0.1",             // 热重载
    "eslint": "^8.43.0",             // 代码规范
    "jest": "^29.5.0"                // 测试框架
  }
}
```

---

## 核心 API 路由

### 1. 分析消息（最核心）

**请求**：
```
POST /api/analyze
Content-Type: application/json

{
  "userId": "user123",
  "message": "宝宝~我一直在想你呢~",
  "conversationId": "conv456"
}
```

**响应**：
```
{
  "success": true,
  "data": {
    "performanceScore": 80,
    "authenticitScore": 20,
    "analysis": "检测到撒娇语气词"宝宝~"和"呢~"，判定为虚伪",
    "girlfriendReply": "是这样啊...（其实我不信）",
    "cumulativeScores": {
      "performance": 65,
      "authenticity": 35
    }
  }
}
```

**后端逻辑**：
```javascript
// backend/src/routes/analyze.js
router.post('/analyze', authenticateJWT, async (req, res) => {
  try {
    const { userId, message, conversationId } = req.body;
    
    // 1. 验证输入
    validateInput(message);
    
    // 2. 撒娇语气检查（前置）
    const hasCoquettish = checkCoquettishTone(message);
    
    let analysisResult;
    if (hasCoquettish) {
      analysisResult = {
        performance: 80,
        authenticity: 20,
        reason: "检测到撒娇语气"
      };
    } else {
      // 3. 调用 Claude API 分析（API Key 在后端，安全！）
      analysisResult = await claudeService.analyzeMessage(message);
    }
    
    // 4. 应用对立关系规则
    const adjustedScore = applyOppositionLogic(analysisResult);
    
    // 5. 更新用户累计分数
    const updatedUser = await updateUserScores(userId, adjustedScore);
    
    // 6. 保存对话到数据库
    await Conversation.create({
      userId,
      conversationId,
      message,
      analysis: analysisResult,
      timestamp: new Date()
    });
    
    // 7. 获取女友回复
    const girlfriendReply = getGirlfriendReply(analysisResult);
    
    // 8. 返回结果
    res.json({
      success: true,
      data: {
        performanceScore: analysisResult.performance,
        authenticitScore: analysisResult.authenticity,
        analysis: analysisResult.reason,
        girlfriendReply,
        cumulativeScores: updatedUser.scores
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});
```

### 2. 保存对话记录

**请求**：
```
POST /api/conversation
{
  "userId": "user123",
  "messages": [...],
  "finalScores": {...}
}
```

**后端逻辑**：
```javascript
// 保存整个对话周期
await Conversation.create({
  userId,
  messages,
  finalScores,
  finalDiagnosis: matchDiagnosis(finalScores),
  createdAt: new Date()
});
```

### 3. 获取用户诊断历史

**请求**：
```
GET /api/user/user123/diagnosis
```

**响应**：
```
{
  "success": true,
  "data": {
    "totalDiagnosis": 5,
    "histories": [
      {
        "date": "2025-04-12",
        "finalPerformance": 75,
        "finalAuthenticity": 25,
        "diagnosis": "虚实混淆大师"
      },
      ...
    ]
  }
}
```

### 4. 用户认证（可选）

**登录**：
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**返回 JWT Token**：
```
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { id, email, nickname }
}
```

---

## 核心服务实现

### Claude API 服务

```javascript
// backend/src/services/claudeService.js

const axios = require('axios');

class ClaudeService {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1';
  }

  async analyzeMessage(message) {
    try {
      const prompt = `你是情感分析专家，分析这句话的虚伪程度(0-100)...
      
      句子：${message}
      
      返回ONLY数字。`;

      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: 'claude-opus-4-6',
          max_tokens: 50,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'content-type': 'application/json'
          }
        }
      );

      const score = parseInt(response.data.content[0].text.trim());
      return {
        performance: score,
        authenticity: 100 - score,
        reason: `Claude 分析得分: ${score}`
      };
    } catch (error) {
      console.error('Claude API 调用失败:', error);
      throw new Error('分析失败，请重试');
    }
  }
}

module.exports = new ClaudeService();
```

### 数据库服务

```javascript
// backend/src/services/dbService.js

const User = require('../models/User');
const Conversation = require('../models/Conversation');

class DatabaseService {
  // 获取或创建用户
  async getOrCreateUser(userId) {
    let user = await User.findById(userId);
    if (!user) {
      user = await User.create({
        _id: userId,
        scores: { performance: 50, authenticity: 50 },
        conversations: [],
        createdAt: new Date()
      });
    }
    return user;
  }

  // 更新用户分数
  async updateUserScores(userId, deltaScores) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          'scores.performance': deltaScores.performance,
          'scores.authenticity': deltaScores.authenticity
        }
      },
      { new: true }
    );
    return user;
  }

  // 保存对话
  async saveConversation(conversationData) {
    const conversation = await Conversation.create(conversationData);
    return conversation;
  }

  // 获取用户诊断历史
  async getUserDiagnosisHistory(userId, limit = 10) {
    const conversations = await Conversation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return conversations;
  }
}

module.exports = new DatabaseService();
```

---

## 数据库 Schema

### User 模型

```javascript
// backend/src/models/User.js

const userSchema = {
  _id: String,                      // 用户 ID
  email: String,                     // 邮箱（如果有认证）
  nickname: String,                  // 昵称
  
  scores: {
    performance: Number,             // 当前表演度
    authenticity: Number             // 当前真诚度
  },
  
  totalDiagnosis: Number,            // 总诊断次数
  favoriteResult: String,            // 最喜欢的诊断结果
  
  conversations: [String],           // 对话 ID 列表
  
  lastDiagnosisDate: Date,          // 最后诊断时间
  createdAt: Date,                   // 创建时间
  updatedAt: Date                    // 更新时间
};
```

### Conversation 模型

```javascript
// backend/src/models/Conversation.js

const conversationSchema = {
  _id: ObjectId,
  userId: String,                    // 用户 ID
  conversationId: String,            // 对话组 ID
  
  messages: [{
    role: 'user' | 'girlfriend',
    text: String,
    timestamp: Date
  }],
  
  scores: [{
    performance: Number,
    authenticity: Number,
    timestamp: Date
  }],
  
  finalScores: {
    performance: Number,
    authenticity: Number
  },
  
  finalDiagnosis: {
    title: String,                   // 诊断标签
    description: String              // 描述
  },
  
  createdAt: Date,
  updatedAt: Date
};
```

---

## 环境变量配置

```bash
# backend/.env

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxx

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# 服务器
PORT=3001
NODE_ENV=production

# 速率限制
RATE_LIMIT_WINDOW_MS=900000      # 15分钟
RATE_LIMIT_MAX_REQUESTS=100      # 最多100次请求

# CORS
FRONTEND_URL=https://your-frontend.com

# 日志
LOG_LEVEL=info
```

---

## 安全特性

### 1. API Key 保护
✓ Claude API Key 存储在后端环境变量  
✓ 前端永远看不到真实 Key  
✓ 所有 Claude 调用都经过后端中转

### 2. 速率限制
```javascript
// 防止 API 被滥用
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100,                  // 最多100次请求
  message: '请求过于频繁，请稍后再试'
});

app.use('/api/', limiter);
```

### 3. JWT 认证
```javascript
// 保护敏感路由
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未授权' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: '无效token' });
  }
};
```

### 4. 输入验证
```javascript
// 防止注入攻击
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('无效的消息格式');
  }
  if (message.length > 1000) {
    throw new Error('消息过长');
  }
  return message.trim();
};
```

### 5. CORS 配置
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 部署方案

### 自建服务器（推荐用于学习）

**服务器选择**：
- 腾讯云 CVM：￥50-100/月
- 阿里云 ECS：￥50-100/月
- DigitalOcean：$5-10/月
- Linode：$5-10/月

**部署步骤**：
1. SSH 连接到服务器
2. 安装 Node.js + MongoDB
3. Git clone 项目
4. `npm install && npm start`
5. 配置 Nginx 反向代理
6. 使用 PM2 管理进程

### Docker 容器化部署

```dockerfile
# backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 3001

CMD ["node", "src/index.js"]
```

```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/tea-diagnosis
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 前端改动（调用后端）

### 从直调 Claude → 通过后端

**改前**（现在）：
```javascript
// 前端直接调用 Claude API
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY }
});
```

**改后**（方案B）：
```javascript
// 前端调用后端 API
const response = await fetch('https://your-backend.com/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: currentUser.id,
    message: userInput,
    conversationId: sessionId
  })
});

const result = await response.json();
// result 包含分析结果、女友回复等
```

---

## 开发流程（预计 3-5 天）

**Day 1**：
- [ ] 初始化 Express 项目
- [ ] 连接 MongoDB
- [ ] 写 User 和 Conversation schema

**Day 2**：
- [ ] 写 /api/analyze 路由
- [ ] 集成 Claude API 调用
- [ ] 测试分析逻辑

**Day 3**：
- [ ] 写其他 API 路由
- [ ] 添加 JWT 认证
- [ ] 添加速率限制和错误处理

**Day 4**：
- [ ] 改造前端，调用后端 API
- [ ] 联调测试
- [ ] 写单元测试

**Day 5**：
- [ ] 部署到服务器或容器
- [ ] 监控和日志
- [ ] 性能优化

---

## 面试时的卖点

✅ "我建立了一个完整的微服务架构，分离了前后端"  
✅ "API Key 在后端，保证了安全性"  
✅ "集成了 MongoDB，可以持久化用户数据"  
✅ "实现了 JWT 认证和速率限制"  
✅ "使用 Docker 容器化，方便部署"  
✅ "写了单元测试，确保代码质量"

---

## 成本估算

| 项目 | 成本 | 备注 |
|------|------|------|
| 服务器 | ￥50-100/月 | 最低配置足够 |
| MongoDB | 免费-100/月 | Atlas 免费层 1GB |
| 域名 | ￥30/年 | 阿里云便宜 |
| CDN | 免费-50/月 | 前端 + 静态资源 |
| **总计** | **￥80-200/月** | 很便宜！ |

---

**需要我帮你写具体的代码吗？我可以快速生成核心文件！** 🚀
