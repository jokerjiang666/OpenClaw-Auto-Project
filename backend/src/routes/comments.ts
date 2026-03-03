import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 获取帖子的评论
router.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { postId } = req.params;
    
    const result = db.exec(`
      SELECT c.*, u.username, u.avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
    `);
    
    const comments = result.length > 0 ? result[0].values.map(row => {
      const comment: any = {};
      result[0].columns.forEach((col, i) => comment[col] = row[i]);
      comment.children = [];
      return comment;
    }) : [];
    
    // 构建树形结构
    const commentMap = new Map();
    const rootComments: any[] = [];
    
    comments.forEach((comment: any) => {
      commentMap.set(comment.id, comment);
    });
    
    comments.forEach((comment: any) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) parent.children.push(comment);
      } else {
        rootComments.push(comment);
      }
    });
    
    res.json({ comments: rootComments });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建评论
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { postId, parentId, content } = req.body;
    
    if (!postId || !content) {
      return res.status(400).json({ error: '帖子 ID 和内容不能为空' });
    }
    
    db.run(`INSERT INTO comments (post_id, author_id, parent_id, content) VALUES (?, ?, ?, ?)`,
      [postId, req.userId!, parentId || null, content]);
    saveDb();
    
    db.run(`UPDATE posts SET comments_count = comments_count + 1 WHERE id = ${postId}`);
    saveDb();
    
    const result = db.exec('SELECT last_insert_rowid() as id');
    const commentId = result[0].values[0][0];
    
    const commentResult = db.exec(`
      SELECT c.*, u.username, u.avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = ${commentId}
    `);
    
    const columns = commentResult[0].columns;
    const values = commentResult[0].values[0];
    const comment: any = {};
    columns.forEach((col, i) => comment[col] = values[i]);
    
    res.status(201).json({ message: '评论成功', comment });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 点赞评论
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const userId = req.userId!;
    
    const existing = db.exec(`SELECT id FROM likes WHERE user_id = ${userId} AND target_type = 'comment' AND target_id = ${id}`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      db.run(`DELETE FROM likes WHERE user_id = ${userId} AND target_type = 'comment' AND target_id = ${id}`);
      db.run(`UPDATE comments SET likes_count = likes_count - 1 WHERE id = ${id}`);
      saveDb();
      res.json({ message: '取消点赞', liked: false });
    } else {
      db.run(`INSERT INTO likes (user_id, target_type, target_id) VALUES (${userId}, 'comment', ${id})`);
      db.run(`UPDATE comments SET likes_count = likes_count + 1 WHERE id = ${id}`);
      saveDb();
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (error) {
    console.error('点赞评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除评论
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const result = db.exec(`SELECT author_id, post_id FROM comments WHERE id = ${id}`);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: '评论不存在' });
    }
    
    const comment = { author_id: result[0].values[0][0], post_id: result[0].values[0][1] };
    
    if (comment.author_id !== req.userId) {
      return res.status(403).json({ error: '无权删除此评论' });
    }
    
    db.run(`DELETE FROM comments WHERE id = ${id}`);
    db.run(`UPDATE posts SET comments_count = comments_count - 1 WHERE id = ${comment.post_id}`);
    saveDb();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;