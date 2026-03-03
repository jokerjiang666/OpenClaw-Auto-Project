import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Tag, Input, message, Spin, Popconfirm } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { postService } from '../services/posts';
import { commentService } from '../services/comments';
import { useAuthStore } from '../stores/authStore';
import CommentItem from '../components/CommentItem';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { TextArea } = Input;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getById(Number(id))
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentService.getByPostId(Number(id))
  });

  const likeMutation = useMutation({
    mutationFn: () => postService.like(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    }
  });

  const handleComment = async () => {
    if (!token) {
      message.warning('请先登录');
      return;
    }
    if (!commentContent.trim()) {
      message.error('请输入评论内容');
      return;
    }
    setCommentLoading(true);
    try {
      await commentService.create({
        postId: Number(id),
        content: commentContent
      });
      setCommentContent('');
      refetchComments();
      message.success('评论成功');
    } catch (error) {
      message.error('评论失败');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (content: string, parentId?: number) => {
    await commentService.create({
      postId: Number(id),
      content,
      parentId
    });
    refetchComments();
  };

  const handleLikeComment = async (commentId: number) => {
    if (!token) {
      message.warning('请先登录');
      return;
    }
    await commentService.like(commentId);
    refetchComments();
  };

  const handleDelete = async () => {
    try {
      await postService.delete(Number(id));
      message.success('删除成功');
      window.location.href = '/';
    } catch (error) {
      message.error('删除失败');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
        帖子不存在
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 帖子内容 */}
      <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
        {/* 作者信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to={`/profile/${post.author_id}`}>
              <Avatar 
                src={post.avatar} 
                size={56}
                icon={<UserOutlined />}
                style={{ border: '3px solid #00f5ff' }}
              />
            </Link>
            <div>
              <Link to={`/profile/${post.author_id}`}>
                <h3 style={{ color: '#fff', marginBottom: 4, fontSize: 18 }}>
                  {post.username}
                </h3>
              </Link>
              <p style={{ color: '#666', fontSize: 13, margin: 0 }}>
                发布于 {dayjs(post.created_at).format('YYYY-MM-DD HH:mm')}
              </p>
            </div>
          </div>
          
          {user?.id === post.author_id && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button icon={<EditOutlined />}>编辑</Button>
              <Popconfirm
                title="确定删除此帖子？"
                onConfirm={handleDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h1 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 16,
          lineHeight: 1.4
        }}>
          {post.title}
        </h1>

        {/* 标签 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <Tag color="#00f5ff">{post.category}</Tag>
          {post.tags?.map((tag: string, index: number) => (
            <Tag key={index} style={{ background: 'rgba(191, 0, 255, 0.2)', color: '#bf00ff', border: 'none' }}>
              #{tag}
            </Tag>
          ))}
        </div>

        {/* 内容 */}
        <div style={{
          color: '#d0d0d0',
          fontSize: 16,
          lineHeight: 1.8,
          marginBottom: 24
        }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* 操作栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: 24, color: '#666' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <EyeOutlined /> {post.views} 次浏览
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageOutlined /> {post.comments_count} 条评论
            </span>
          </div>
          
          <Button
            type="primary"
            size="large"
            icon={<LikeOutlined />}
            onClick={() => likeMutation.mutate()}
            loading={likeMutation.isPending}
          >
            点赞 ({post.likes_count})
          </Button>
        </div>
      </div>

      {/* 评论区域 */}
      <div className="glass-card" style={{ padding: 32 }}>
        <h3 style={{ color: '#fff', marginBottom: 24, fontSize: 20 }}>
          💬 评论 ({comments?.length || 0})
        </h3>

        {/* 评论输入框 */}
        {token ? (
          <div style={{ marginBottom: 24 }}>
            <TextArea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="写下你的评论..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ marginBottom: 12 }}
            />
            <Button
              type="primary"
              loading={commentLoading}
              onClick={handleComment}
            >
              发表评论
            </Button>
          </div>
        ) : (
          <p style={{ color: '#666', marginBottom: 24 }}>登录后才能评论</p>
        )}

        {/* 评论列表 */}
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={Number(id)}
              onReply={handleReply}
              onLike={handleLikeComment}
            />
          ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>
            暂无评论，快来发表第一条评论吧！
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PostDetail;