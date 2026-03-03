# 🚀 OpenClaw Forum - 项目设计文档

## 一、项目概述
**名称**: OpenClaw Forum  
**定位**: 炫酷开发者社区论坛  
**截止**: 2026-03-04 09:00 (约8小时)

## 二、技术栈决策

### 前端
- **框架**: React 18 + TypeScript + Vite
- **UI**: Ant Design 5 + TailwindCSS
- **动效**: Framer Motion + 粒子背景 (tsparticles)
- **状态**: Zustand
- **请求**: Axios

### 后端
- **框架**: Express + TypeScript
- **数据库**: SQLite (better-sqlite3)
- **认证**: JWT + bcrypt
- **实时**: Socket.io

### 设计原则
- **暗色主题** + 霓虹色点缀
- **玻璃态UI** (Glassmorphism)
- **流畅动效** (60fps)
- **响应式设计**

## 三、核心功能模块

### P0 (必须实现)
1. **用户系统**
   - 注册/登录
   - JWT认证
   - 个人资料

2. **帖子系统**
   - 发布帖子 (Markdown支持)
   - 列表展示 (无限滚动)
   - 详情页面
   - 点赞/收藏

3. **评论系统**
   - 嵌套回复
   - 点赞
   - @提及

### P1 (加分项)
4. **分类标签**
5. **搜索功能**
6. **实时通知**
7. **用户等级**

## 四、数据库设计

### Users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT DEFAULT '/default-avatar.png',
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Posts 表
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  category TEXT,
  tags TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### Comments 表
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  parent_id INTEGER,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);
```

### Likes 表
```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL, -- 'post' or 'comment'
  target_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, target_type, target_id)
);
```

## 五、API设计

### 认证
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### 用户
- GET /api/users/:id
- PUT /api/users/:id
- GET /api/users/:id/posts

### 帖子
- GET /api/posts (列表)
- GET /api/posts/:id (详情)
- POST /api/posts (创建)
- PUT /api/posts/:id (更新)
- DELETE /api/posts/:id (删除)
- POST /api/posts/:id/like (点赞)

### 评论
- GET /api/posts/:id/comments
- POST /api/posts/:id/comments
- PUT /api/comments/:id
- DELETE /api/comments/:id
- POST /api/comments/:id/like

## 六、开发时间线

| 时间 | 任务 | 负责人 |
|------|------|--------|
| 00:45-01:30 | 项目初始化 + 数据库 | Fullstack |
| 01:30-02:30 | 后端API开发 | Fullstack |
| 02:30-03:30 | 前端架构 + 组件 | Fullstack |
| 03:30-05:00 | 核心页面开发 | Fullstack |
| 05:00-06:30 | 炫酷UI + 动效 | Fullstack |
| 06:30-07:30 | 测试 + Bug修复 | Fullstack |
| 07:30-08:30 | 文档 + 部署 | Fullstack |

## 七、炫酷元素清单

### 视觉
- [ ] 粒子背景 (tsparticles)
- [ ] 霓虹发光效果
- [ ] 玻璃态卡片
- [ ] 渐变按钮
- [ ] 动态Logo

### 动效
- [ ] 页面切换过渡
- [ ] 列表项入场动画
- [ ] 点赞爆炸特效
- [ ] 加载骨架屏
- [ ] 悬停微动画

### 交互
- [ ] 无限滚动
- [ ] 实时通知 (WebSocket)
- [ ] 快捷键支持
- [ ] 深色/浅色切换

## 八、Git提交规范

```
feat: 新功能
fix: Bug修复
docs: 文档
style: 样式
refactor: 重构
test: 测试
chore: 构建/工具
```