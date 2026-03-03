import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 获取帖子列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '1=1';
    if (category) whereClause += ` AND category = '${category}'`;
    if (search) whereClause += ` AND (title LIKE '%${search}%' OR content LIKE '%${search}%')`;
    
    const postsResult = db.exec(`
      SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE ${whereClause}
      ORDER BY p.is_pinned DESC, p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    const posts = postsResult.length > 0 ? postsResult[0].columns.map((col, i) => {
      const post: any = {};
      postsResult[0].values.forEach(row => {
        post[col] = row[i];
      });
      return post;
    }).map((_, idx) => {
      const post: any = {};
      postsResult[0].columns.forEach((col, j) => {
        post[col] = postsResult[0].values[idx][j];
      });
      return post;
    }) : [];
    
    const countResult = db.exec(`SELECT COUNT(*) as total FROM posts WHERE ${whereClause}`);
    const total = countResult.length > 0 ? countResult[0].values[0][0] : 0;
    
    res.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total as number / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取帖子列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个帖子
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    db.run(`UPDATE posts SET views = views + 1 WHERE id = ${id}`);
    saveDb();
    
    const result = db.exec(`
      SELECT p.*, u.username, u.avatar, u.bio as author_bio
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ${id}
    `);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: '帖子不存在' });
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    const post: any = {};
    columns.forEach((col, i) => post[col] = values[i]);
    post.tags = JSON.parse(post.tags || '[]');
    
    res.json({ post });
  } catch (error) {
    console.error('获取帖子详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建帖子
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { title, content, category = 'general', tags = [] } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }
    
    db.run(`INSERT INTO posts (title, content, author_id, category, tags) VALUES (?, ?, ?, ?, ?)`,
      [title, content, req.userId!, category, JSON.stringify(tags)]);
    saveDb();
    
    const result = db.exec('SELECT last_insert_rowid() as id');
    const postId = result[0].values[0][0];
    
    const postResult = db.exec(`
      SELECT p.*, u.username, u.avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ${postId}
    `);
    
    const columns = postResult[0].columns;
    const values = postResult[0].values[0];
    const post: any = {};
    columns.forEach((col, i) => post[col] = values[i]);
    
    res.status(201).json({ message: '发布成功', post });
  } catch (error) {
    console.error('创建帖子错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 点赞帖子
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const userId = req.userId!;
    
    const existing = db.exec(`SELECT id FROM likes WHERE user_id = ${userId} AND target_type = 'post' AND target_id = ${id}`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      db.run(`DELETE FROM likes WHERE user_id = ${userId} AND target_type = 'post' AND target_id = ${id}`);
      db.run(`UPDATE posts SET likes_count = likes_count - 1 WHERE id = ${id}`);
      saveDb();
      res.json({ message: '取消点赞', liked: false });
    } else {
      db.run(`INSERT INTO likes (user_id, target_type, target_id) VALUES (${userId}, 'post', ${id})`);
      db.run(`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${id}`);
      saveDb();
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除帖子
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const result = db.exec(`SELECT author_id FROM posts WHERE id = ${id}`);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: '帖子不存在' });
    }
    
    const authorId = result[0].values[0][0];
    if (authorId !== req.userId) {
      return res.status(403).json({ error: '无权删除此帖子' });
    }
    
    db.run(`DELETE FROM posts WHERE id = ${id}`);
    saveDb();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除帖子错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;