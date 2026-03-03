import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, Button, Input, message } from 'antd';
import { LikeOutlined, LikeFilled, UserOutlined, ReplyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { useAuthStore } from '../stores/authStore';
import type { Comment } from '../services/comments';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReply: (content: string, parentId: number) => Promise<void>;
  onLike: (commentId: number) => Promise<void>;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  onReply, 
  onLike,
  depth = 0 
}) => {
  const { token } = useAuthStore();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      message.error('请输入回复内容');
      return;
    }
    setLoading(true);
    try {
      await onReply(replyContent, comment.id);
      setReplyContent('');
      setShowReply(false);
      message.success('回复成功');
    } catch (error) {
      message.error('回复失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        marginBottom: 16,
        paddingLeft: depth * 24,
        borderLeft: depth > 0 ? '2px solid rgba(0, 245, 255, 0.2)' : 'none'
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <Avatar 
          src={comment.avatar} 
          size={36}
          icon={<UserOutlined />}
          style={{ border: '2px solid rgba(0, 245, 255, 0.5)', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>{comment.username}</span>
            <span style={{ color: '#666', fontSize: 12 }}>
              {dayjs(comment.created_at).fromNow()}
            </span>
          </div>
          
          <p style={{ color: '#d0d0d0', fontSize: 14, marginBottom: 8 }}>
            {comment.content}
          </p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                cursor: 'pointer',
                color: '#666',
                fontSize: 13,
                transition: 'color 0.3s'
              }}
              onClick={() => onLike(comment.id)}
            >
              <LikeOutlined /> {comment.likes_count || 0}
            </span>
            
            {token && (
              <span 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4, 
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: 13,
                  transition: 'color 0.3s'
                }}
                onClick={() => setShowReply(!showReply)}
              >
                <ReplyOutlined /> 回复
              </span>
            )}
          </div>

          {/* 回复框 */}
          {showReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: 12 }}
            >
              <Input.TextArea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`回复 ${comment.username}...`}
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ marginBottom: 8 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <Button 
                  size="small"
                  onClick={() => setShowReply(false)}
                >
                  取消
                </Button>
                <Button 
                  type="primary" 
                  size="small"
                  loading={loading}
                  onClick={handleReply}
                >
                  发送
                </Button>
              </div>
            </motion.div>
          )}

          {/* 子评论 */}
          {comment.children && comment.children.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  postId={postId}
                  onReply={onReply}
                  onLike={onLike}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;