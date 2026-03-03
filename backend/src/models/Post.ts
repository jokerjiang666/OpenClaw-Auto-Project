import { Table, Column, Model, BelongsTo, HasMany, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Comment } from './Comment';

@Table
export class Post extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  title!: string;

  @Column({ type: 'TEXT' })
  content!: string;

  @Column
  category!: string;

  @Column({ defaultValue: 0 })
  views!: number;

  @Column({ defaultValue: 0 })
  likes!: number;

  @ForeignKey(() => User)
  @Column
  authorId!: number;

  @BelongsTo(() => User)
  author!: User;

  @HasMany(() => Comment)
  comments!: Comment[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
