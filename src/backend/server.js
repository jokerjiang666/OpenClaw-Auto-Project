const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'openclaw-forum-secret-2026';

app.use(cors());
app.use(express.json());

const db = new Database('forum.db');

// 创建表
db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, avatar TEXT DEFAULT "", created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
db.exec('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT, description TEXT, icon TEXT DEFAULT "")');
db.exec('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, content TEXT, user_id INTEGER, category_id INTEGER, views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
db.exec('CREATE TABLE IF NOT EXISTS replies (id INTEGER PRIMARY KEY, content TEXT, user_id INTEGER, post_id INTEGER, likes INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');

// 插入默认分类
try { db.exec("INSERT INTO categories (name, description, icon) VALUES ('公告', '官方公告和更新', '📢'), ('技术讨论', '技术交流和问答', '💻'), ('分享', '资源分享和展示', '🎁'), ('灌水区', '轻松闲聊', '💬')"); } catch(e) {}

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({error:'需要登录'});
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch { res.status(403).json({error:'Token 无效'}); }
};

app.post('/api/auth/register', (req, res) => {
  const {username, email, password} = req.body;
  try {
    const hashed = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (username,email,password) VALUES (?,?,?)').run(username, email, hashed);
    const token = jwt.sign({id:info.lastInsertRowid, username}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:info.lastInsertRowid, username, email}});
  } catch { res.status(400).json({error:'用户名或邮箱已存在'}); }
});

app.post('/api/auth/login', (req, res) => {
  const {username, password} = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({error:'用户名或密码错误'});
  const token = jwt.sign({id:user.id, username:user.username}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id, username:user.username, email:user.email}});
});

app.get('/api/categories', (req, res) => res.json(db.prepare('SELECT * FROM categories').all()));

app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id=u.id ORDER BY p.created_at DESC LIMIT 50').all();
  res.json({posts});
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id=u.id WHERE p.id=?').get(req.params.id);
  if (!post) return res.status(404).json({error:'帖子不存在'});
  const replies = db.prepare('SELECT r.*, u.username FROM replies r JOIN users u ON r.user_id=u.id WHERE r.post_id=?').all(req.params.id);
  res.json({...post, replies});
});

app.post('/api/posts', auth, (req, res) => {
  const {title, content, category_id} = req.body;
  const info = db.prepare('INSERT INTO posts (title, content, user_id, category_id) VALUES (?,?,?,?)').run(title, content, req.user.id, category_id || null);
  res.json(db.prepare('SELECT * FROM posts WHERE id=?').get(info.lastInsertRowid));
});

app.post('/api/posts/:id/replies', auth, (req, res) => {
  const {content} = req.body;
  const info = db.prepare('INSERT INTO replies (content, user_id, post_id) VALUES (?,?,?)').run(content, req.user.id, req.params.id);
  res.json(db.prepare('SELECT * FROM replies WHERE id=?').get(info.lastInsertRowid));
});

app.listen(PORT, () => console.log('🦞 OpenClaw-Forum 服务器运行在 http://localhost:' + PORT));
