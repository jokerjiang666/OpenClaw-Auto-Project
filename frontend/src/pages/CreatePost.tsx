import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message } from 'antd';
import { motion } from 'framer-motion';
import { postService } from '../services/posts';
import { useAuthStore } from '../stores/authStore';

const { TextArea } = Input;

interface CreatePostForm {
  title: string;
  content: string;
  category: string;
  tags: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const categories = [
    { value: 'general', label: '综合' },
    { value: 'tech', label: '技术' },
    { value: 'question', label: '问答' },
    { value: 'share', label: '分享' },
    { value: 'discussion', label: '讨论' },
    { value: 'news', label: '资讯' }
  ];

  const handleSubmit = async (values: CreatePostForm) => {
    if (!token) {
      message.warning('请先登录');
      return;
    }

    setLoading(true);
    try {
      const tags = values.tags
        ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const post = await postService.create({
        title: values.title,
        content: values.content,
        category: values.category || 'general',
        tags
      });

      message.success('发布成功！');
      navigate(`/post/${post.id}`);
    } catch (error: any) {
      message.error(error.response?.data?.error || '发布失败');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: 16 }}>请先登录</h2>
        <p style={{ color: '#a0a0a0' }}>登录后才能发布帖子</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}
    >
      <h2 style={{ color: '#fff', marginBottom: 32, fontSize: 24 }}>
        ✨ 发布新帖子
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ category: 'general' }}
      >
        <Form.Item
          name="title"
          label={<span style={{ color: '#a0a0a0' }}>标题</span>}
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input
            placeholder="输入一个吸引人的标题..."
            size="large"
            style={{ height: 50 }}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label={<span style={{ color: '#a0a0a0' }}>分类</span>}
        >
          <Select
            options={categories}
            size="large"
            style={{ width: 200 }}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label={<span style={{ color: '#a0a0a0' }}>标签（用逗号分隔）</span>}
        >
          <Input
            placeholder="例如: React, TypeScript, 前端"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={<span style={{ color: '#a0a0a0' }}>内容（支持 Markdown）</span>}
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <TextArea
            placeholder="分享你的想法、代码或问题..."
            autoSize={{ minRows: 10, maxRows: 20 }}
            style={{ fontSize: 15 }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            style={{ minWidth: 120 }}
          >
            发布帖子
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default CreatePost;