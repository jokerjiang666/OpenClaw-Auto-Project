import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { Button, Modal, Input, message, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, LoginOutlined } from '@ant-design/icons';
import { authService } from '../services/auth';
import Particles from '@tsparticles/react';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, token } = useAuthStore();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      message.error('请填写用户名和密码');
      return;
    }
    setLoading(true);
    try {
      await authService.login(loginForm);
      message.success('登录成功！');
      setLoginVisible(false);
      setLoginForm({ username: '', password: '' });
    } catch (error: any) {
      message.error(error.response?.data?.error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      message.error('请填写所有必填字段');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      });
      message.success('注册成功！');
      setRegisterVisible(false);
      setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      message.error(error.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to={`/profile/${user?.id}`}>个人主页</Link>
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        authService.logout();
        message.success('已退出登录');
      }
    }
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* 粒子背景 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: { value: 'transparent' }
          },
          fpsLimit: 60,
          particles: {
            color: { value: '#00f5ff' },
            links: {
              color: '#00f5ff',
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1
            },
            move: {
              enable: true,
              speed: 0.5,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'bounce' }
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* 导航栏 */}
      <header className="glass-card" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        margin: '0 auto',
        maxWidth: 1400,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 0,
        borderBottom: '1px solid rgba(0, 245, 255, 0.2)'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            ⚡ OpenClaw Forum
          </h1>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {token ? (
            <>
              <Link to="/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  发布帖子
                </Button>
              </Link>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ border: '2px solid #00f5ff' }} />
                  <span style={{ color: '#fff', fontWeight: 500 }}>{user?.username}</span>
                </div>
              </Dropdown>
            </>
          ) : (
            <>
              <Button 
                type="default" 
                onClick={() => setLoginVisible(true)}
                style={{ borderColor: '#00f5ff', color: '#00f5ff' }}
              >
                登录
              </Button>
              <Button 
                type="primary" 
                onClick={() => setRegisterVisible(true)}
              >
                注册
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* 主内容 */}
      <main style={{ maxWidth: 1400, margin: '24px auto', padding: '0 24px' }}>
        {children}
      </main>

      {/* 登录弹窗 */}
      <Modal
        title={<span style={{ color: '#fff' }}>登录</span>}
        open={loginVisible}
        onCancel={() => setLoginVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ padding: '24px 0' }}>
          <Input
            placeholder="用户名"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            style={{ marginBottom: 16, height: 44 }}
            size="large"
          />
          <Input.Password
            placeholder="密码"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            style={{ marginBottom: 24, height: 44 }}
            size="large"
          />
          <Button 
            type="primary" 
            block 
            size="large"
            loading={loading}
            onClick={handleLogin}
          >
            登录
          </Button>
          <p style={{ textAlign: 'center', marginTop: 16, color: '#a0a0a0' }}>
            还没有账号？
            <a onClick={() => { setLoginVisible(false); setRegisterVisible(true); }}>
              立即注册
            </a>
          </p>
        </div>
      </Modal>

      {/* 注册弹窗 */}
      <Modal
        title={<span style={{ color: '#fff' }}>注册</span>}
        open={registerVisible}
        onCancel={() => setRegisterVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ padding: '24px 0' }}>
          <Input
            placeholder="用户名"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            style={{ marginBottom: 16, height: 44 }}
            size="large"
          />
          <Input
            placeholder="邮箱"
            type="email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            style={{ marginBottom: 16, height: 44 }}
            size="large"
          />
          <Input.Password
            placeholder="密码（至少6位）"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            style={{ marginBottom: 16, height: 44 }}
            size="large"
          />
          <Input.Password
            placeholder="确认密码"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            style={{ marginBottom: 24, height: 44 }}
            size="large"
          />
          <Button 
            type="primary" 
            block 
            size="large"
            loading={loading}
            onClick={handleRegister}
          >
            注册
          </Button>
          <p style={{ textAlign: 'center', marginTop: 16, color: '#a0a0a0' }}>
            已有账号？
            <a onClick={() => { setRegisterVisible(false); setLoginVisible(true); }}>
              立即登录
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;