import { Router } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const where: any = {};
    
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { content: { [Op.like]: '%' + search + '%' } }
      ];
    }
    
    const posts = await Post.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });
    
    res.json({
      posts: posts.rows,
      total: posts.count,
      page: Number(page),
      totalPages: Math.ceil(posts.count / Number(limit))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { 
          model: Comment,
          include: [{ model: User, attributes: ['id', 'username', 'avatar'] }]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await post.increment('views');
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, content, category } = req.body;
    
    const post = await Post.create({
      title,
      content,
      category: category || 'general',
      authorId: req.userId
    });
    
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await post.update(req.body);
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await post.increment('likes');
    res.json({ likes: post.likes + 1 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import { Op } from 'sequelize';
