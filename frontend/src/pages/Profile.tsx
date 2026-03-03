import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Spin, Statistic, Row, Col, Empty } from 'antd';
import { UserOutlined, FileTextOutlined, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { userService } from '../services/users';
import PostCard from '../components/PostCard';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(Number(id))
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: () => userService.getPosts(Number(id), { limit: 20 })
  });

  if (userLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <Empty description="用户不存在" style={{ padding: 60 }} />
    );
  }

  const user = userData.user;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 用户信息卡片 */}
      <div className="glass-card" style={{ padding: 32, marginBottom: 24, textAlign: 'center' }}>
        <Avatar
          src={user.avatar}
          size={120}
          icon={<UserOutlined />}
          style={{
            border: '4px solid #00f5ff',
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)',
            marginBottom: 16
          }}
        />
        
        <h2 style={{ color: '#fff', fontSize: 28, marginBottom: 8 }}>
          {user.username}
        </h2>
        
        {user.bio && (
          <p style={{ color: '#a0a0a0', marginBottom: 16, maxWidth: 500, margin: '0 auto 16px' }}>
            {user.bio}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 24 }}>
          <Statistic
            title={<span style={{ color: '#666' }}>帖子</span>}
            value={user.postCount || 0}
            prefix={<FileTextOutlined style={{ color: '#00f5ff' }} />}
            valueStyle={{ color: '#fff' }}
          />
          <Statistic
            title={<span style={{ color: '#666' }}>声望</span>}
            value={user.reputation || 0}
            prefix={<TrophyOutlined style={{ color: '#bf00ff' }} />}
            valueStyle={{ color: '#fff' }}
          />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: 4 }}>加入时间</p>
            <p style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <CalendarOutlined style={{ color: '#39ff14' }} />
              {dayjs(user.created_at).format('YYYY-MM-DD')}
            </p>
          </div>
        </div>
      </div>

      {/* 用户帖子 */}
      <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>
        📝 发布的帖子
      </h3>

      {postsLoading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      ) : posts?.length > 0 ? (
        posts.map((post: any, index: number) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))
      ) : (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          暂无发布的帖子
        </div>
      )}
    </motion.div>
  );
};

export default Profile;