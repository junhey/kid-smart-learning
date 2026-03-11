/**
 * Design Tokens - Duolingo Style
 * 统一的设计系统配置
 */

export const colors = {
  // 主色系 - Duolingo Green
  primary: {
    green: '#58CC02',      // 主绿色
    greenHover: '#46A302', // 悬停绿
    greenLight: '#89E219', // 浅绿
    greenDark: '#3D8A00',  // 深绿 (3D边框)
  },

  // 状态色
  status: {
    correct: '#58CC02',    // 答对：亮绿
    correctBg: '#D7FFB8',  // 答对背景
    wrong: '#FF4B4B',      // 答错：鲜红
    wrongBg: '#FFD1D1',    // 答错背景
    neutral: '#E5E5E5',    // 未答：浅灰
  },

  // 强调色
  accent: {
    blue: '#1CB0F6',       // 信息蓝
    purple: '#CE82FF',     // 等级紫
    orange: '#FF9600',     // 警告橙
    pink: '#FF66C4',       // 成就粉
    yellow: '#FFC800',     // 星星黄
  },

  // 背景色
  background: {
    main: '#FFFFFF',
    subtle: '#F7F7F7',     // 微妙背景
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // 文字色
  text: {
    primary: '#3C3C3C',
    secondary: '#777777',
    white: '#FFFFFF',
    muted: '#AFAFAF',
  },

  // 边框色
  border: {
    light: '#E5E5E5',
    medium: '#D1D1D1',
    dark: '#AFAFAF',
  },
};

export const shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.18)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.24)',
  button: '0 4px 0 0 #3D8A00',        // 3D按钮阴影
  buttonHover: '0 6px 0 0 #3D8A00',   // 3D按钮悬停
  card: '0 4px 12px rgba(0, 0, 0, 0.12)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.18)',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

export const transitions = {
  fast: '150ms ease-out',
  normal: '300ms ease-out',
  slow: '500ms ease-out',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const animations = {
  // 答对动画
  correct: {
    scale: 'scale(1.1)',
    duration: '300ms',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // 答错动画
  wrong: {
    shake: 'translateX',
    values: ['-10px', '10px', '-10px', '0'],
    duration: '400ms',
  },

  // 按钮按压
  buttonPress: {
    translateY: '4px',
    shadow: 'none',
  },
};

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: '"Fredoka", "Comic Sans MS", cursive',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Z-index 层级
export const zIndex = {
  base: 0,
  dropdown: 10,
  modal: 20,
  mascot: 40,
  nav: 50,
  toast: 100,
};
