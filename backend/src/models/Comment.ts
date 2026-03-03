import { Table, Column, Model, BelongsTo, ForeignKey, CreatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

@Table
export class Comment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: 'TEXT' })
  content!: string;

  @ForeignKey(() => User)
  @Column
  authorId!: number;

  @ForeignKey(() => Post)
  @Column
  postId!: number;

  @ForeignKey(() => Comment)
  @Column({ allowNull: true })
  parentId?: number;

  @BelongsTo(() => User)
  author!: User;

  @BelongsTo(() => Post)
  post!: Post;

  @BelongsTo(() => Comment, 'parentId')
  parent?: Comment;

  @CreatedAt
  createdAt!: Date;
}
