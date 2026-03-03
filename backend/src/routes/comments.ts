import { Router } from 'express';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/post/:postId', async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: Number(req.params.postId) },
    include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
    order: [['createdAt', 'ASC']]
  });
  res.json(comments);
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { content, postId, parentId } = req.body;
  const comment = await Comment.create({
    content, postId, parentId, authorId: req.userId!
  });
  res.status(201).json(comment);
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment || comment.authorId !== req.userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  await comment.destroy();
  res.json({ message: 'Deleted' });
});

export default router;
