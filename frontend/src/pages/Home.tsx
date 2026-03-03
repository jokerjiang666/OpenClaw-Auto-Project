import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Spin, Empty, Button } from 'antd';
import { SearchOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';

const { Search } = Input;

const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['posts', page, category, search],
    queryFn: () => postService.getList({ page, limit: 10, category, search })
  });

  const categories = [
    { value: 'general', label: '综合' },
    { value: 'tech', label: '技术' },
    { value: 'question', label: '问答' },
    { value: 'share', label: '分享' },
    { value: 'discussion', label: '讨论' },
    { value: 'news', label: '资讯' }
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2 className="gradient-text" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            发现精彩内容
          </h2>
        </div>
        
        <Search
          placeholder="搜索帖子..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 320 }}
        />
      </motion.div>

      {/* 筛选栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          marginBottom: 24,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <Select
          placeholder="选择分类"
          allowClear
          style={{ width: 140 }}
          options={categories}
          onChange={(value) => { setCategory(value); setPage(1); }}
        />
        
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type={sortBy === 'latest' ? 'primary' : 'default'}
            icon={<ClockCircleOutlined />}
            onClick={() => setSortBy('latest')}
          >
            最新
          </Button>
          <Button
            type={sortBy === 'hot' ? 'primary' : 'default'}
            icon={<FireOutlined />}
            onClick={() => setSortBy('hot')}
          >
            热门
          </Button>
        </div>
      </motion.div>

      {/* 帖子列表 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : data?.posts?.length > 0 ? (
        <div>
          {data.posts.map((post: any, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} onLike={() => refetch()} />
            </motion.div>
          ))}
          
          {/* 分页 */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ marginRight: 8 }}
              >
                上一页
              </Button>
              <span style={{ color: '#a0a0a0', margin: '0 16px' }}>
                {page} / {data.pagination.totalPages}
              </span>
              <Button
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Empty
          description="暂无帖子"
          style={{ padding: 60, color: '#666' }}
        />
      )}
    </div>
  );
};

export default Home;