# Design System: OpenClaw-Forum

> Generated for: forum community modern dark mode tech neon glowing
> Product Type: **forum** | Style: **neon** | Pattern: **content-flow**

---

## 1. 设计概述

### 1.1 风格定位

**科技感 × 现代感 × 炫酷霓虹**

- **视觉风格**: 暗色主题 + 霓虹光效 + 玻璃拟态
- **交互体验**: 流畅动效 + 微交互反馈 + 沉浸式体验
- **品牌调性**: 专业、现代、活力、技术前沿

### 1.2 核心特色

| 特色 | 实现方式 |
|------|----------|
| 霓虹光效 | 发光边框、按钮、卡片 hover 效果 |
| 玻璃拟态 | backdrop-filter: blur(12px) + bg-white/10 |
| 流畅动效 | 所有交互 150-300ms 缓动动画 |
| 深色主题 | #0A0A0F 主背景 + 高对比文字 |

---

## 2. Color Palette

**Neon Cyber Theme**

| Role | Color | Value | Usage |
|------|-------|-------|-------|
| Primary | ![#00FFAA](https://placehold.co/20x20/00FFAA/00FFAA) | `#00FFAA` | 主按钮、链接、高亮、活跃状态 |
| Secondary | ![#7C3AED](https://placehold.co/20x20/7C3AED/7C3AED) | `#7C3AED` | 次按钮、标签、强调元素 |
| Accent | ![#00D9FF](https://placehold.co/20x20/00D9FF/00D9FF) | `#00D9FF` | 通知、提示、特殊高亮 |
| Error | ![#FF4757](https://placehold.co/20x20/FF4757/FF4757) | `#FF4757` | 错误、警告、删除 |
| Warning | ![#FFB930](https://placehold.co/20x20/FFB930/FFB930) | `#FFB930` | 提醒、待处理 |
| Success | ![#00FFAA](https://placehold.co/20x20/00FFAA/00FFAA) | `#00FFAA` | 成功、确认、完成 |
| Background | ![#0A0A0F](https://placehold.co/20x20/0A0A0F/0A0A0F) | `#0A0A0F` | 页面主背景 |
| Surface | ![#13131A](https://placehold.co/20x20/13131A/13131A) | `#13131A` | 卡片、面板背景 |
| Surface Elevated | ![#1A1A24](https://placehold.co/20x20/1A1A24/1A1A24) | `#1A1A24` | 悬浮卡片、弹窗背景 |
| Text Primary | ![#E2E8F0](https://placehold.co/20x20/E2E8F0/E2E8F0) | `#E2E8F0` | 标题、正文 |
| Text Secondary | ![#94A3B8](https://placehold.co/20x20/94A3B8/94A3B8) | `#94A3B8` | 描述、辅助文字 |
| Text Muted | ![#64748B](https://placehold.co/20x20/64748B/64748B) | `#64748B` | 禁用、占位符 |
| Border | ![#2D2D3A](https://placehold.co/20x20/2D2D3A/2D2D3A) | `#2D2D3A` | 边框、分割线 |
| Border Glow | ![#00FFAA40](https://placehold.co/20x20/00FFAA/00FFAA) | `#00FFAA40` | 发光边框 |

---

## 3. Typography

### 3.1 字体家族

| 用途 | 字体 | Fallback |
|------|------|----------|
| **标题** | Space Grotesk | Inter, system-ui, sans-serif |
| **正文** | Inter | -apple-system, BlinkMacSystemFont, sans-serif |
| **代码** | JetBrains Mono | SF Mono, Consolas, monospace |
| **数字** | Space Grotesk | (同标题) |

### 3.2 字号体系

| Level | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| xs | 0.75rem (12px) | 1.5 | 400 | 辅助信息、时间戳 |
| sm | 0.875rem (14px) | 1.5 | 400 | 次级文本、标签 |
| base | 1rem (16px) | 1.6 | 400 | 正文 |
| lg | 1.125rem (18px) | 1.5 | 500 | 强调文本 |
| xl | 1.25rem (20px) | 1.4 | 600 | 小标题 |
| 2xl | 1.5rem (24px) | 1.3 | 600 | 卡片标题 |
| 3xl | 1.875rem (30px) | 1.2 | 700 | 区块标题 |
| 4xl | 2.25rem (36px) | 1.1 | 700 | 页面标题 |
| 5xl | 3rem (48px) | 1.0 | 800 | Hero 标题 |

---

## 4. Spacing System

基于 **4px 网格**

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| spacing-xs | 0.25rem | 4px | 图标与文字间距 |
| spacing-sm | 0.5rem | 8px | 紧凑元素间距 |
| spacing-md | 1rem | 16px | 标准间距 |
| spacing-lg | 1.5rem | 24px | 区块内间距 |
| spacing-xl | 2rem | 32px | 区块间间距 |
| spacing-2xl | 3rem | 48px | 大区块间距 |
| spacing-3xl | 4rem | 64px | 页面级间距 |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 0.375rem (6px) | 小按钮、标签 |
| radius-md | 0.5rem (8px) | 按钮、输入框 |
| radius-lg | 0.75rem (12px) | 卡片、面板 |
| radius-xl | 1rem (16px) | 大卡片、弹窗 |
| radius-2xl | 1.5rem (24px) | 特大卡片 |
| radius-full | 9999px | 圆形头像、徽章 |

---

## 6. Shadows & Effects

### 6.1 阴影

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
```

### 6.2 霓虹光效

```css
/* Primary Glow */
--glow-primary: 0 0 20px rgba(0, 255, 170, 0.4), 0 0 40px rgba(0, 255, 170, 0.2);
--glow-primary-intense: 0 0 30px rgba(0, 255, 170, 0.6), 0 0 60px rgba(0, 255, 170, 0.4);

/* Secondary Glow */
--glow-secondary: 0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2);

/* Accent Glow */
--glow-accent: 0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(0, 217, 255, 0.2);
```

### 6.3 玻璃拟态

```css
.glass-card {
  background: rgba(19, 19, 26, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
}

.glass-card-elevated {
  background: rgba(26, 26, 36, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl);
}
```

---

## 7. Animation System

### 7.1 时长

| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 100ms | 微交互（按钮按下） |
| duration-normal | 200ms | 标准过渡 |
| duration-slow | 300ms | 面板展开/收起 |
| duration-slower | 500ms | 页面切换 |

### 7.2 缓动函数

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* 快出慢停 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* 平滑过渡 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性效果 */
```

### 7.3 核心动画

```css
/* Hover Glow */
.hover-glow {
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);
}
.hover-glow:hover {
  box-shadow: var(--glow-primary);
  transform: translateY(-2px);
}

/* Pulse Glow */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 170, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 170, 0.6); }
}

/* Fade In Up */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer Loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 8. Component States

所有交互组件必须定义 6 态：

### 8.1 按钮状态

| State | Background | Border | Shadow | Transform |
|-------|------------|--------|--------|-----------|
| **Default** | transparent | 1px solid #00FFAA | none | none |
| **Hover** | rgba(0, 255, 170, 0.1) | 1px solid #00FFAA | glow-primary | translateY(-1px) |
| **Active** | rgba(0, 255, 170, 0.2) | 1px solid #00FFAA | glow-primary-intense | translateY(0) |
| **Focus** | rgba(0, 255, 170, 0.1) | 2px solid #00FFAA | glow-primary | none |
| **Disabled** | rgba(255, 255, 255, 0.05) | 1px solid #2D2D3A | none | none |
| **Loading** | rgba(0, 255, 170, 0.1) | 1px solid #00FFAA | glow-primary | none |

### 8.2 卡片状态

| State | Background | Border | Shadow | Transform |
|-------|------------|--------|--------|-----------|
| **Default** | rgba(19, 19, 26, 0.6) | 1px solid #2D2D3A | shadow-md | none |
| **Hover** | rgba(26, 26, 36, 0.8) | 1px solid #00FFAA40 | glow-primary | translateY(-4px) scale(1.01) |
| **Active** | rgba(26, 26, 36, 1) | 1px solid #00FFAA | glow-primary-intense | translateY(-2px) |
| **Focus** | rgba(19, 19, 26, 0.6) | 2px solid #00FFAA | glow-primary | none |
| **Disabled** | rgba(19, 19, 26, 0.3) | 1px solid #2D2D3A | none | none |
| **Loading** | rgba(19, 19, 26, 0.6) | 1px solid #2D2D3A | none | none |

### 8.3 输入框状态

| State | Background | Border | Shadow |
|-------|------------|--------|--------|
| **Default** | rgba(19, 19, 26, 0.8) | 1px solid #2D2D3A | none |
| **Hover** | rgba(26, 26, 36, 0.9) | 1px solid #64748B | none |
| **Focus** | rgba(26, 26, 36, 1) | 1px solid #00FFAA | glow-primary |
| **Error** | rgba(19, 19, 26, 0.8) | 1px solid #FF4757 | 0 0 10px rgba(255, 71, 87, 0.3) |
| **Disabled** | rgba(10, 10, 15, 0.5) | 1px solid #2D2D3A | none |
| **Loading** | rgba(19, 19, 26, 0.8) | 1px solid #2D2D3A | none |

---

## 9. CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #00FFAA;
  --color-primary-rgb: 0, 255, 170;
  --color-secondary: #7C3AED;
  --color-secondary-rgb: 124, 58, 237;
  --color-accent: #00D9FF;
  --color-accent-rgb: 0, 217, 255;
  --color-error: #FF4757;
  --color-warning: #FFB930;
  --color-success: #00FFAA;
  
  --color-background: #0A0A0F;
  --color-surface: #13131A;
  --color-surface-elevated: #1A1A24;
  --color-text: #E2E8F0;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;
  --color-border: #2D2D3A;
  --color-border-glow: rgba(0, 255, 170, 0.25);
  
  /* Typography */
  --font-heading: 'Space Grotesk', Inter, system-ui, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', SF Mono, Consolas, monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  
  /* Glows */
  --glow-primary: 0 0 20px rgba(0, 255, 170, 0.4), 0 0 40px rgba(0, 255, 170, 0.2);
  --glow-primary-intense: 0 0 30px rgba(0, 255, 170, 0.6), 0 0 60px rgba(0, 255, 170, 0.4);
  --glow-secondary: 0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2);
  --glow-accent: 0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(0, 217, 255, 0.2);
  
  /* Animation */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Z-Index Scale */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
}

/* Dark Mode (Default) */
[data-theme="dark"] {
  color-scheme: dark;
}

/* Light Mode */
[data-theme="light"] {
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FFFFFF;
  --color-text: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-border: #E2E8F0;
  --color-border-glow: rgba(0, 255, 170, 0.4);
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
```

---

## 10. Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00FFAA',
          50: '#E6FFF5',
          100: '#CCFFEB',
          200: '#99FFD6',
          300: '#66FFC2',
          400: '#33FFAD',
          500: '#00FFAA',
          600: '#00CC88',
          700: '#009966',
          800: '#006644',
          900: '#003322',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0764',
        },
        accent: {
          DEFAULT: '#00D9FF',
          50: '#E6FBFF',
          100: '#CCF7FF',
          200: '#99EFFF',
          300: '#66E7FF',
          400: '#33DFFF',
          500: '#00D9FF',
          600: '#00AECC',
          700: '#008299',
          800: '#005766',
          900: '#002B33',
        },
        surface: {
          DEFAULT: '#13131A',
          elevated: '#1A1A24',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 255, 170, 0.4), 0 0 40px rgba(0, 255, 170, 0.2)',
        'glow-primary-intense': '0 0 30px rgba(0, 255, 170, 0.6), 0 0 60px rgba(0, 255, 170, 0.4)',
        'glow-secondary': '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
        'glow-accent': '0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(0, 217, 255, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 170, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 170, 0.6)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

---

## 11. Avoid (Anti-patterns)

- ❌ **No emojis as UI icons** → Use SVG icons (Heroicons, Lucide)
- ❌ **No cursor-pointer missing** → Add `cursor-pointer` to all clickable elements
- ❌ **No layout shift on hover** → Use transform/opacity, not width/height
- ❌ **No instant transitions** → Always add `transition` property
- ❌ **No pure white text on dark** → Use #E2E8F0 (slate-200) instead of #FFFFFF
- ❌ **No invisible borders** → Use visible borders in both light/dark modes
- ❌ **No missing focus states** → Add visible focus rings for keyboard navigation
- ❌ **No ignoring reduced motion** → Check `prefers-reduced-motion`

---

## 12. Pre-Delivery Checklist

- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] All interactive components have 6 states defined
- [ ] Glass morphism works in both light/dark modes
- [ ] Glow effects are subtle, not overwhelming
- [ ] Typography scale is consistent across all pages
- [ ] Touch targets are minimum 44×44px on mobile