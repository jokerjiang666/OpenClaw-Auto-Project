import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Avatar, Tag, Button } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, EyeOutlined, PushpinOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import type { Post } from '../services/posts';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

const categoryColors: Record<string, string> = {
  general: '#00f5ff',
  tech: '#bf00ff',
  question: '#ff006e',
  share: '#39ff14',
  discussion: '#ff6b00',
  news: '#ffff00'
};

const categoryLabels: Record<string, string> = {
  general: '综合',
  tech: '技术',
  question: '问答',
  share: '分享',
  discussion: '讨论',
  news: '资讯'
};

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
        <div className="glass-card" style={{
          padding: 24,
          marginBottom: 16,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 置顶标识 */}
          {post.is_pinned && (
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'linear-gradient(135deg, #ff006e, #bf00ff)',
              padding: '4px 16px',
              borderRadius: '0 16px 0 12px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <PushpinOutlined /> 置顶
            </div>
          )}

          {/* 帖子内容 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <Avatar 
              src={post.avatar} 
              size={48}
              style={{ border: '2px solid #00f5ff', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{post.username}</span>
                <Tag 
                  color={categoryColors[post.category] || '#00f5ff'}
                  style={{ margin: 0, borderRadius: 4 }}
                >
                  {categoryLabels[post.category] || post.category}
                </Tag>
                <span style={{ color: '#666', fontSize: 12 }}>
                  {dayjs(post.created_at).fromNow()}
                </span>
              </div>

              <h3 style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {post.title}
              </h3>

              <p style={{
                color: '#a0a0a0',
                fontSize: 14,
                marginBottom: 12,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {post.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
              </p>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      style={{
                        background: 'rgba(0, 245, 255, 0.1)',
                        color: '#00f5ff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 统计信息 */}
              <div style={{ display: 'flex', gap: 24, color: '#666', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EyeOutlined /> {post.views}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageOutlined /> {post.comments_count}
                </span>
                <span 
                  style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    onLike?.();
                  }}
                >
                  <LikeOutlined /> {post.likes_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;