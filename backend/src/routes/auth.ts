import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../db/database';
import { authMiddleware, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const escapeSql = (str: string): string => str.replace(/'/g, "''");

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const db = getDb();
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const sql = `SELECT id FROM users WHERE username = '${escapeSql(username)}' OR email = '${escapeSql(email)}'`;
    const existing = db.exec(sql);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const insertSql = `INSERT INTO users (username, email, password, avatar) VALUES ('${escapeSql(username)}', '${escapeSql(email)}', '${hashedPassword}', '${avatar}')`;
    db.exec(insertSql);
    saveDb();
    const result = db.exec('SELECT last_insert_rowid() as id');
    const userId = Number(result[0].values[0][0]);
    const token = generateToken(userId, username);
    res.status(201).json({ message: 'Registration successful', token, user: { id: userId, username, email, avatar } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const db = getDb();
    if (!username || !password) {
      return res.status(400).json({ error: 'Please fill username and password' });
    }
    const sql = `SELECT * FROM users WHERE username = '${escapeSql(username)}' OR email = '${escapeSql(username)}'`;
    const result = db.exec(sql);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user: Record<string, any> = {};
    columns.forEach((col, i) => { user[col] = values[i]; });
    const isValid = bcrypt.compareSync(password, user.password as string);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = generateToken(user.id as number, user.username as string);
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, reputation: user.reputation } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const sql = `SELECT id, username, email, avatar, bio, reputation, created_at FROM users WHERE id = ${req.userId}`;
    const result = db.exec(sql);
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user: Record<string, any> = {};
    columns.forEach((col, i) => { user[col] = values[i]; });
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;