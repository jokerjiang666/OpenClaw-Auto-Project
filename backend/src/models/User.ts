import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Post } from './Post';
import { Comment } from './Comment';
import bcrypt from 'bcryptjs';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column
  password!: string;

  @Column
  avatar?: string;

  @Column
  bio?: string;

  @HasMany(() => Post)
  posts!: Post[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
