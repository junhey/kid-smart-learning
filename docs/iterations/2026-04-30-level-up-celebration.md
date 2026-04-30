# 迭代日志 #12 — 升级庆祝全屏动画

**日期**: 2026-04-30
**类型**: 🎨 视觉与情感 (P1) — 游戏化里程碑奖励
**优先级**: P1
**耗时**: ~12 分钟

## 背景

孩子在学习过程中获得星星并升级，但之前没有专门的视觉庆祝来标记这一重要里程碑。升级是游戏化系统中最强的正向反馈时刻，缺少庆祝动画会让升级感觉"悄无声息"，削弱激励效果。

参考 Duolingo 的 level-up celebration 和移动游戏中的通关庆典，为升级时刻添加一个震撼的全屏庆祝动画。

## 实现

### 新增文件
- `components/ui/LevelUpCelebration.tsx` — 全屏庆祝组件
- `contexts/LevelUpContext.tsx` — 升级事件监听 & 状态管理

### 修改文件
- `hooks/useReward.ts` — 增加 level-up CustomEvent 分发
- `app/layout.tsx` — 集成 LevelUpProvider

### 技术细节
1. **40 粒彩纸** — 随机颜色/形状/速度/延迟，营造喜庆氛围
2. **弹性徽章动画** — spring physics 驱动的等级徽章 + 环绕星星
3. **10 级分层鼓励语** — 每级都有独特的趣味文案
4. **多种关闭方式** — 点击/触摸/键盘(Esc/Enter/Space)/4.5秒自动关闭
5. **事件驱动架构** — useReward 通过 CustomEvent 通知 LevelUpContext，解耦组件树
6. **去重机制** — localStorage 记录已庆祝的最高等级，不重复触发
7. **音效集成** — 触发 `soundFeedback.play('complete')`

### 无障碍 (a11y)
- `role="dialog"` + `aria-modal="true"`
- 键盘可关闭 (Escape/Enter/Space)
- `prefers-reduced-motion` 时跳过所有粒子动画
- 语义化 aria-label 描述当前等级

## 构建验证

| 检查项 | 结果 |
|--------|------|
| `npm run build` | ✅ 通过 |
| `npm run test:unit` | ✅ 23/23 |
| 首页体积 | 8.03 kB (增加 0.08 kB) |
| TypeScript | ✅ 无错误 |

## 效果

升级时会看到：
1. 全屏紫色渐变遮罩 + 毛玻璃效果
2. 40 片彩色纸屑从顶部飘落
3. 金色等级徽章从中心弹出，周围环绕 6 颗旋转星星
4. 趣味鼓励文案（如"半路英雄！⚔️"、"超级学霸！🦸"）
5. 4.5 秒后自动消失或点击关闭

## Git

```
a4f3a856 feat(gamification): 升级庆祝全屏动画 — 视觉化里程碑奖励
```
