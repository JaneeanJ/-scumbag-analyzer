# 假面舞会

通过与四位虚拟女友同时对话，诊断你的「表演度」和「真诚度」。

**线上地址**：https://scumbag-analyzer.vercel.app

---

## 核心玩法

你扮演一个正在同时跟四位女友聊天的男生，每说一句话 AI 都会实时判断它的虚伪程度，并更新两个全局维度的分数：

- **表演度**：虚伪、套路、撒娇、操控程度
- **真诚度**：坦白、直接、言行一致程度

同时，你可以发朋友圈——朋友圈的内容会被 AI 分析，并作为「证据」影响女友的判断。

对话结束后，根据最终分数匹配 8 种诊断画像，并触发对应的女友结局。

---

## 功能详情

### 四位女友

每位女友有独立的对话状态、起疑指数和结局触发阈值：

| 名字 | 类型 | 起疑阈值 | 敏感系数 | 行为特征 |
|------|------|----------|----------|----------|
| 苏念 | 温柔型 | 85% | 1.2x | 顺着你说，语气变冷但不追问 |
| 顾疏影 | 多疑型 | 65% | 2.0x | 高度警觉，连续追问细节 |
| 沈冬辞 | 冷漠型 | 75% | 1.5x | 话极少，起疑指数只升不降 |
| 林听雪 | 线人型 | 70% | 1.7x | 用「我闺蜜说……」旁敲侧击 |

### 起疑机制

- 每条消息计算虚伪分数 → 更新该女友的起疑指数
- **连续虚伪累乘**：连续说套话，起疑指数加速累积（1.0x → 1.4x → 1.8x → 2.2x）
- 沈冬辞特殊规则：起疑只升不降
- 任意女友起疑达到阈值 → 触发该女友专属结局 → 游戏结束

### 朋友圈系统

- 支持发布文字 + 图片（最多 9 张，前端压缩至 1200px/JPEG 0.82）
- Claude 分析朋友圈，返回：
  - **人设管理度**：是否在精心塑造形象（文艺、神秘、完美生活等）
  - **暧昧指数**：是否含有向特定人传递的情感暗示
  - **意图摘要**：一句话总结
- 朋友圈分数影响全局表演度/真诚度
- 高暧昧朋友圈（>50%）会向**所有存活女友**注入起疑值
- 林听雪有 40% 概率把高暧昧朋友圈「自然地带进对话」

### AI 分析逻辑（三层）

1. **撒娇语气检测**（本地）：包含撒娇关键词直接判定表演 80%
2. **Claude 上下文分析**：结合对话历史（最近 6 条）+ 朋友圈记录（最近 3 条），用「人类社会通识规则」判断
3. **降级兜底**：API 失败时返回 50/50

#### 人类社会通识规则（Claude 分析依据）

1. 言行不一：说的与朋友圈/行动对不上 → 大幅加分
2. 答非所问：被问具体问题，回答含糊转移 → 明显掩饰
3. 此地无银：主动过度解释、反复撇清 → 越描越黑
4. 轻描淡写证据：朋友圈暧昧指数高却说「普通朋友」→ 加 40+ 分
5. 情感反转：被质疑时让对方内疚 → 操控加分
6. 一致性奖励：回答与上下文完全吻合 → 大幅减分

### 分数系统

- 全局分数初始 50/50，每条消息按对立逻辑（opposition logic）更新
- 早期消息影响较大（±11/7），后期趋于稳定（±4/3）
- 消息越极端（偏离 50 越远），本次影响越大

### 结局系统

**女友结局**（起疑溢出触发）：

| 结局 | 触发条件 |
|------|----------|
| 苏念 · 温柔型 | 苏念起疑 ≥ 85% |
| 顾疏影 · 多疑型 | 顾疏影起疑 ≥ 65% |
| 沈冬辞 · 冷漠型 | 沈冬辞起疑 ≥ 75% |
| 林听雪 · 线人型 | 林听雪起疑 ≥ 70% |

**全局结局**（15 轮后按分数判断）：

| 结局 | 条件 |
|------|------|
| 好结局 | 真诚度 > 65% 且表演度 ≤ 65% |
| 坏结局 | 表演度 > 80% |

**8 种诊断画像**（手动结束或好/坏结局触发）：

| # | 称号 | 分数区间 |
|---|------|----------|
| 1 | 戏精投胎转世大师 | 表演 ≥ 75，真诚 ≤ 30 |
| 2 | 表演欲爆棚选手 | 表演 ≥ 70，真诚 ≤ 35 |
| 3 | 虚实混淆大师 | 表演 ≥ 60，真诚 ≤ 40 |
| 4 | 虚实兼备平衡家 | 45–55 / 45–55 |
| 5 | 真诚漏风侠 | 表演 ≥ 40，真诚 ≥ 65 |
| 6 | 直肠子大实话家 | 表演 ≤ 35，真诚 ≥ 70 |
| 7 | 真诚到发光的人 | 表演 ≤ 25，真诚 ≥ 80 |
| 8 | 世界上最最最真诚的大好人 | 表演 ≤ 20，真诚 ≥ 85 |

---

## 技术栈

### 前端（`frontend/`）
- React 19 + Vite 8
- 纯 CSS（莫兰迪色系）
- 图片压缩：Canvas API（长边 1200px，JPEG 0.82）
- 部署：Vercel

### 后端（`backend/`）
- Node.js + Express
- 请求体上限 20MB（支持 base64 图片传输）
- 部署：Render（Free tier）

### 数据库
- MongoDB Atlas（Free tier，存储匿名诊断记录）

### AI
- Claude API（claude-opus-4-6）
  - 虚伪程度分析（max_tokens: 10，只返回整数）
  - 朋友圈意图分析（max_tokens: 200，返回 JSON）
  - 女友回复生成（max_tokens: 150，带 system prompt 人设）

---

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/analyze` | 分析单条消息，返回分数 + 女友回复 |
| POST | `/api/moments` | 分析朋友圈（文字+图片），返回人设/暧昧指数 |
| POST | `/api/diagnosis` | 保存完整诊断结果到数据库 |
| GET | `/api/stats` | 查询所有用户诊断分布统计 |
| GET | `/health` | 健康检查 |

### POST `/api/analyze`

```json
// 请求
{
  "message": "我今天一直在公司加班",
  "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }],
  "moments": [{ "text": "...", "summary": "...", "renShe": 70, "ambiguity": 80 }],
  "gfType": "warm"
}

// 响应
{
  "performance": 72,
  "authenticity": 28,
  "source": "claude",
  "girlfriendReply": "感觉你最近很忙呢……"
}
```

### POST `/api/moments`

```json
// 请求
{
  "text": "今天的落日真好看",
  "images": [{ "base64": "...", "mediaType": "image/jpeg" }]
}

// 响应
{
  "renShe": 65,
  "ambiguity": 78,
  "isPerformance": true,
  "summary": "精心构图的落日配文，有明显的情绪传递意图",
  "performanceDelta": 14,
  "authenticityDelta": -8
}
```

---

## 本地开发

### 前置条件
- Node.js >= 18
- MongoDB（本地安装或 Atlas）
- Anthropic API Key

### 后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 ANTHROPIC_API_KEY 和 MONGODB_URI
npm install
npm run dev
# 运行在 http://localhost:3001
```

### 前端

```bash
cd frontend
echo "VITE_API_BASE_URL=http://localhost:3001" > .env
npm install
npm run dev
# 运行在 http://localhost:5173
```

---

## 环境变量

### 后端（`backend/.env`）

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_API_KEY` | Anthropic 控制台获取 |
| `MONGODB_URI` | MongoDB 连接字符串 |
| `PORT` | 服务端口，默认 3001 |
| `NODE_ENV` | `development` 或 `production` |
| `FRONTEND_ORIGINS` | 允许跨域的前端域名，多个用逗号分隔 |

### 前端（`frontend/.env`）

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE_URL` | 后端地址，本地为 `http://localhost:3001` |

---

## 部署架构

```
用户浏览器
    ↓
Vercel（前端静态托管）
    ↓ HTTPS
Render（后端 Node.js 服务）
    ↓
MongoDB Atlas（数据库）
Claude API（AI 分析 × 3 种用途）
```

> Render Free tier 有冷启动问题：15 分钟无请求后休眠，下次访问首条消息分析可能慢 30–50 秒。

---

## 项目结构

```
scumbag-analyzer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # 主组件：四女友列表、对话、朋友圈、结局
│   │   ├── App.css            # 全局样式（莫兰迪色系）
│   │   └── portraits/         # 8 个诊断结果肖像组件
│   └── public/
│       ├── background/        # 背景图（1-9.jpg）
│       └── touxiang/          # 头像（boy/girl 各 1-6.jpg）
│
└── backend/
    └── src/
        ├── index.js                      # 服务器入口
        ├── config/                       # 环境变量、数据库连接
        ├── middleware/                   # CORS、限流、错误处理
        ├── models/                       # MongoDB Schema
        ├── services/
        │   └── claudeService.js          # Claude API：分析/朋友圈/女友回复
        ├── controllers/
        │   ├── analyzeController.js      # 虚伪分析 + 女友回复
        │   └── momentsController.js      # 朋友圈分析
        └── routes/
            ├── analyze.js
            ├── diagnosis.js
            └── moments.js
```
