import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 获取用户信息
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const result = db.exec(`
      SELECT id, username, avatar, bio, reputation, created_at
      FROM users WHERE id = ${id}
    `);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user: any = {};
    columns.forEach((col, i) => user[col] = values[i]);
    
    const postCountResult = db.exec(`SELECT COUNT(*) as count FROM posts WHERE author_id = ${id}`);
    const postCount = postCountResult.length > 0 ? postCountResult[0].values[0][0] : 0;
    
    res.json({ user: { ...user, postCount } });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户的帖子
router.get('/:id/posts', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const result = db.exec(`
      SELECT p.*, u.username, u.avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ${id}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    const posts = result.length > 0 ? result[0].values.map(row => {
      const post: any = {};
      result[0].columns.forEach((col, i) => post[col] = row[i]);
      return post;
    }) : [];
    
    res.json({ posts });
  } catch (error) {
    console.error('获取用户帖子错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户信息
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { avatar, bio } = req.body;
    
    if (Number(id) !== req.userId) {
      return res.status(403).json({ error: '无权修改此用户信息' });
    }
    
    db.run(`UPDATE users SET avatar = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`, [avatar, bio]);
    saveDb();
    
    const result = db.exec(`SELECT id, username, email, avatar, bio, reputation FROM users WHERE id = ${id}`);
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user: any = {};
    columns.forEach((col, i) => user[col] = values[i]);
    
    res.json({ message: '更新成功', user });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;