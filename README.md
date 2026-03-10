# Kid Smart Learning 🎓

An interactive, gamified learning website for children ages 5-7, featuring fun English and Math games with a star-based reward system.

**Live Demo:** [kid-smart-learning.vercel.app](https://kid-smart-learning-em5eci9lj-junheys-projects.vercel.app) *(deploy to get your URL)*

---

# 儿童智慧学习 🎓

一款专为 5-7 岁儿童设计的互动游戏化学习网站，包含英语和数学趣味游戏，以及星星奖励系统。

---

## Features / 功能特色

- 🔤 **5 English Games** — Alphabet Balloons, Word Match, Phonics Fun, Listen & Choose, Sentence Builder
- 🔢 **5 Math Games** — Count It, Adding Fun, Shape Match, Big or Small, Math Shooter
- ⭐ **Reward System** — Stars, Levels (1-10), Achievements stored in localStorage
- 🎵 **Audio Support** — Web Speech API for pronunciation
- 📱 **Responsive** — Optimized for iPad/tablet/desktop
- 🎨 **Animations** — Framer Motion throughout

---

## Tech Stack

| Technology | Version |
|---|---|
| Next.js | 14 (App Router) |
| React | 18 |
| TypeScript | 5 |
| TailwindCSS | 3 |
| Framer Motion | 11 |

---

## Quickstart / 快速开始

```bash
# Clone the repository
git clone https://github.com/yourusername/kid-smart-learning.git
cd kid-smart-learning

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for production / 生产构建

```bash
npm run build
npm start
```

---

## Games Overview / 游戏介绍

### 📚 English Games

| Game | Description |
|---|---|
| 🎈 **Alphabet Balloons** | Pop the balloon with the correct letter as balloons float up |
| 🐶 **Word Match** | See an emoji picture, pick the matching word from 4 choices |
| 🔤 **Phonics Fun** | See a letter, find which picture starts with that sound |
| 👂 **Listen & Choose** | Hear a word spoken aloud, pick the matching emoji picture |
| ✍️ **Sentence Builder** | Click word tiles to arrange them into a correct sentence |

### 🔢 Math Games

| Game | Description |
|---|---|
| 🔢 **Count It!** | Count the emoji objects and select the correct number (1-15) |
| ➕ **Adding Fun** | Visual addition and subtraction with emoji groups |
| 🔷 **Shape Match** | Match shape names to CSS/SVG drawn shapes |
| ⚖️ **Big or Small?** | Compare two numbers and choose > or < |
| 🎯 **Math Shooter** | Shoot the floating bubble with the correct answer |

---

## Reward System / 奖励系统

```
Stars ⭐  →  earned per correct answer
Level 🏆  →  1-10 based on stars (every 10 stars = 1 level)
```

### Achievements / 成就

| Achievement | Unlock Condition |
|---|---|
| 🌟 First Star | Get your first correct answer |
| 💯 Perfect Round | Complete a game with all correct |
| 🔥 Streak 10 | Answer 10 in a row correctly |

---

## Project Structure / 项目结构

```
kid-smart-learning/
├── app/
│   ├── layout.tsx          # Root layout, fonts
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles & animations
│   ├── english/page.tsx    # English hub (5 games)
│   └── math/page.tsx       # Math hub (5 games)
├── components/
│   ├── ui/
│   │   ├── StarReward.tsx  # Animated star burst
│   │   ├── ProgressBar.tsx # Colorful progress bar
│   │   └── SoundButton.tsx # Button with audio click
│   ├── games/
│   │   ├── english/        # 5 English game components
│   │   └── math/           # 5 Math game components
│   └── layout/
│       ├── Header.tsx      # Stars + level display
│       ├── Navigation.tsx  # Back/Home nav
│       └── RewardPanel.tsx # Full reward panel
├── data/
│   ├── english/
│   │   ├── alphabet.json   # 26 letters with words
│   │   ├── words.json      # 100+ words (5 categories)
│   │   └── sentences.json  # 30 sentence templates
│   └── math/
│       ├── numbers.json    # 1-20 in English & Chinese
│       └── shapes.json     # 8 shapes with properties
├── hooks/
│   ├── useSound.ts         # Web Speech API hook
│   ├── useReward.ts        # Stars/levels/achievements
│   └── useProgress.ts      # Game progress tracking
└── lib/
    └── gameUtils.ts        # Shuffle, random, scoring utils
```

---

## Deployment / 部署

### Vercel (Recommended)

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Deploy automatically!

### GitHub Actions (CI/CD)

Add these secrets to your GitHub repository:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The workflow in `.github/workflows/deploy.yml` will:
- Type-check on every push
- Build and deploy to Vercel on merge to `main`
- Create preview deployments for PRs

---

## Design System / 设计规范

### Colors / 颜色

| Token | Hex | Usage |
|---|---|---|
| Primary | `#FFB84D` | Buttons, accents |
| Secondary | `#4DD0E1` | Math theme |
| Danger | `#FF6B6B` | Wrong answers |
| Success | `#81C784` | Correct answers |
| Purple | `#A78BFA` | Levels, rewards |

### Typography
- **Nunito** — Primary font (rounded, child-friendly)
- **Fredoka One** — Display letters in games

### Touch Targets
- All interactive elements: minimum 64px height
- Large emoji buttons: 80-100px height

---

## Roadmap / 路线图

- [ ] More English categories (body parts, weather, food)
- [ ] Chinese language support (Mandarin mode)
- [ ] Multiplayer / family mode
- [ ] More math: multiplication intro, skip counting
- [ ] Story mode with narrative
- [ ] Parent dashboard with progress reports
- [ ] Offline PWA support
- [ ] More languages (Spanish, French)

---

## Changelog / 更新日志

### v1.0.0 (2026-03-10)
- Initial release
- 5 English games: AlphabetBalloon, WordMatch, PhonicsGame, ListenAndChoose, SentenceBuilder
- 5 Math games: NumberCount, AdditionGame, ShapeMatch, CompareNumbers, MathShooter
- Reward system: stars, levels 1-10, achievements (firstStar, perfectRound, streak10)
- JSON curriculum: 26 letters, 100+ words, 30 sentences, 8 shapes
- Framer Motion animations throughout all games
- Web Speech API for pronunciation in English games
- Responsive design for iPad/tablet/desktop
- GitHub Actions CI/CD workflow for Vercel

---

## Contributing / 贡献

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-game`
3. Commit your changes
4. Open a Pull Request

---

## License / 许可证

MIT License — free for educational use.

---

Made with ❤️ for curious kids everywhere!
为世界各地好奇的孩子们用爱制作！
