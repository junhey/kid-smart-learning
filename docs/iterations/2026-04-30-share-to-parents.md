# 迭代 #14 — 游戏结果分享给家长功能

## 概要

| 字段 | 值 |
|------|------|
| 日期 | 2026-04-30 |
| 类型 | 🚀 核心体验 (P0) |
| 耗时 | ~12 分钟 |
| 提交 | `feat(share): 游戏结果分享给家长功能` |

## 变更内容

### 新增文件
- `lib/share-card.ts` — Canvas API 绘制精美分享卡片
- `components/ui/ShareButton.tsx` — 分享按钮组件 + 预览弹窗

### 修改文件 (17个)
- `components/ui/GameResult.tsx` — 集成 ShareButton，新增 `gameName` prop
- 16 个游戏组件 — 各自传入对应的 `gameName` 值

## 功能细节

### 分享卡片生成器 (`share-card.ts`)
- 纯 Canvas API 绘制，零外部依赖
- 卡片尺寸 750×1000px（适合微信/社交分享）
- 设计元素：
  - 渐变背景（满分金色/优秀绿色/普通蓝色）
  - 散落的装饰星星和圆点
  - 白色圆角卡片主体 + 顶部彩虹条带
  - 大号奖杯 emoji + 鼓励语
  - 三栏成绩展示（答对/正确率/总题数）
  - 进度条可视化
  - 日期和水印

### 分享按钮组件 (`ShareButton.tsx`)
- 紫色主题按钮，符合设计系统
- 点击流程：生成预览 → 弹窗确认 → 分享/保存
- 移动端优先：Web Share API（支持直接分享到微信等）
- 桌面端回退：自动下载 PNG 图片
- 防误操作：需要二次确认才会执行分享
- 完整动画：framer-motion 弹窗进出

### 游戏名称映射
| 英语游戏 | gameName | 数学游戏 | gameName |
|----------|----------|----------|----------|
| AlphabetBalloon | 字母气球 | NumberCount | 数数游戏 |
| PhonicsGame | 自然拼读 | AdditionGame | 加法计算 |
| ListenAndChoose | 听力选择 | ShapeMatch | 形状匹配 |
| SentenceBuilder | 造句子 | CompareNumbers | 比大小 |
| WordMatch | 单词配对 | MathShooter | 数学射击 |
| ColorPaint | 颜色涂鸦 | ShapeCount | 数形状 |
| RhymeGame | 押韵游戏 | ClockGame | 认时钟 |
| AntonymsMatch | 反义词配对 | | |
| AlphabetMatch | 字母配对 | | |

## 设计考量

1. **儿童友好**: "分享给爸爸妈妈"比"分享"更亲切直观
2. **防误触**: 不是一键直接分享，而是先预览再确认
3. **零隐私风险**: 卡片纯本地生成，不上传服务器
4. **平台兼容**: Web Share API 检测 + 下载回退
5. **视觉一致**: 按钮风格与设计系统完全一致（3D按钮 + ripple）

## 构建验证

- ✅ `next build` 成功
- ✅ 23/23 单元测试通过
- ⚠️ 1 个 ESLint 警告（预览图使用 `<img>` 而非 `next/image`，合理保留）

## 产品影响

- **家长参与度 ↑**: 孩子主动分享成绩，增强家庭互动
- **正向反馈环 ↑**: 家长看到成绩 → 表扬孩子 → 孩子更有动力
- **留存率 ↑**: 分享行为本身是社交传播入口
