import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './forum.db',
  models: [User, Post, Comment],
  logging: false
});

export async function initDatabase() {
  await sequelize.sync({ force: true });
  console.log('Database initialized');
}

export default sequelize;
