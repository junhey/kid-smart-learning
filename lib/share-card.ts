/**
 * Share Card Generator
 * 生成精美的学习成绩分享卡片（Canvas 绘制 -> PNG）
 * 
 * 设计理念：生成一张可爱、有趣的成绩卡片，家长看了会开心。
 * 无需外部依赖，纯 Canvas API 绘制。
 */

import { colors } from "./design-tokens";

interface ShareCardData {
  correct: number;
  total: number;
  gameName?: string;
  childName?: string;
  date?: string;
}

/**
 * 绘制圆角矩形
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * 绘制装饰星星
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

/**
 * 生成分享卡片
 */
export function generateShareCard(data: ShareCardData): Promise<string> {
  return new Promise((resolve) => {
    const { correct, total, gameName = "智力游戏", date } = data;
    const accuracy = Math.round((correct / total) * 100);
    const isPerfect = correct === total;
    const isGood = accuracy >= 80;

    // 卡片尺寸 (适合微信分享)
    const W = 750;
    const H = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // === 背景渐变 ===
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (isPerfect) {
      bgGrad.addColorStop(0, "#FFF9E6");
      bgGrad.addColorStop(0.5, "#FFF3CC");
      bgGrad.addColorStop(1, "#FFFDE8");
    } else if (isGood) {
      bgGrad.addColorStop(0, "#E8FFF0");
      bgGrad.addColorStop(0.5, "#D7FFB8");
      bgGrad.addColorStop(1, "#F0FFF4");
    } else {
      bgGrad.addColorStop(0, "#F0F8FF");
      bgGrad.addColorStop(0.5, "#E8F4FD");
      bgGrad.addColorStop(1, "#F5FAFF");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // === 装饰元素：散落的星星/圆点 ===
    const decorColors = [colors.accent.yellow, colors.accent.pink, colors.accent.blue, colors.accent.purple, colors.primary.green];
    for (let i = 0; i < 20; i++) {
      const dx = Math.random() * W;
      const dy = Math.random() * H;
      const size = 4 + Math.random() * 12;
      ctx.globalAlpha = 0.15 + Math.random() * 0.2;
      ctx.fillStyle = decorColors[i % decorColors.length];
      ctx.beginPath();
      if (i % 3 === 0) {
        // 星星
        drawStar(ctx, dx, dy, 5, size, size * 0.4);
        ctx.fill();
      } else {
        // 圆点
        ctx.arc(dx, dy, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // === 主卡片白底 ===
    const cardX = 40;
    const cardY = 60;
    const cardW = W - 80;
    const cardH = H - 120;
    ctx.shadowColor = "rgba(0,0,0,0.08)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, cardX, cardY, cardW, cardH, 32);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.shadowColor = "transparent";

    // === 顶部彩色条带 ===
    ctx.save();
    roundRect(ctx, cardX, cardY, cardW, 12, 32);
    ctx.clip();
    const topGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    topGrad.addColorStop(0, colors.primary.green);
    topGrad.addColorStop(0.33, colors.accent.blue);
    topGrad.addColorStop(0.66, colors.accent.purple);
    topGrad.addColorStop(1, colors.accent.pink);
    ctx.fillStyle = topGrad;
    ctx.fillRect(cardX, cardY, cardW, 12);
    ctx.restore();

    // === 标题区域 ===
    let y = cardY + 80;

    // App 名称
    ctx.font = "bold 28px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.secondary;
    ctx.textAlign = "center";
    ctx.fillText("🎓 Kid Smart Learning", W / 2, y);
    y += 50;

    // 游戏名称
    ctx.font = "bold 36px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.primary;
    ctx.fillText(gameName, W / 2, y);
    y += 70;

    // === 奖杯/等级图标 ===
    const trophy = isPerfect ? "🏆" : accuracy >= 90 ? "🥇" : accuracy >= 80 ? "🥈" : accuracy >= 60 ? "🥉" : "⭐";
    ctx.font = "120px -apple-system, sans-serif";
    ctx.fillText(trophy, W / 2, y + 80);
    y += 140;

    // === 鼓励语 ===
    const message = isPerfect
      ? "太棒了！全部答对！"
      : accuracy >= 90
      ? "非常优秀！继续加油！"
      : accuracy >= 80
      ? "表现很不错！"
      : accuracy >= 60
      ? "有进步！再接再厉！"
      : "加油！下次一定更好！";

    ctx.font = "bold 40px -apple-system, sans-serif";
    const msgColor = isPerfect
      ? colors.accent.yellow
      : isGood
      ? colors.primary.green
      : colors.accent.blue;
    ctx.fillStyle = msgColor;
    ctx.fillText(message, W / 2, y);
    y += 70;

    // === 成绩区域 ===
    const scoreY = y;
    const scoreH = 180;
    const scoreX = cardX + 60;
    const scoreW = cardW - 120;

    // 成绩背景
    roundRect(ctx, scoreX, scoreY, scoreW, scoreH, 20);
    ctx.fillStyle = isGood ? "#F0FFF4" : "#F8F9FA";
    ctx.fill();
    ctx.strokeStyle = isGood ? colors.status.correct : colors.border.light;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 左边：答对数
    const colW = scoreW / 3;
    const colCenterY = scoreY + scoreH / 2;

    ctx.font = "bold 56px -apple-system, sans-serif";
    ctx.fillStyle = colors.status.correct;
    ctx.fillText(`${correct}`, scoreX + colW * 0.5, colCenterY + 10);
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.secondary;
    ctx.fillText("答对", scoreX + colW * 0.5, colCenterY + 45);

    // 中间：分隔 + 正确率
    ctx.font = "bold 56px -apple-system, sans-serif";
    ctx.fillStyle = isPerfect ? colors.accent.yellow : isGood ? colors.primary.green : colors.accent.blue;
    ctx.fillText(`${accuracy}%`, scoreX + colW * 1.5, colCenterY + 10);
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.secondary;
    ctx.fillText("正确率", scoreX + colW * 1.5, colCenterY + 45);

    // 右边：总题数
    ctx.font = "bold 56px -apple-system, sans-serif";
    ctx.fillStyle = colors.accent.blue;
    ctx.fillText(`${total}`, scoreX + colW * 2.5, colCenterY + 10);
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.secondary;
    ctx.fillText("总题数", scoreX + colW * 2.5, colCenterY + 45);

    y = scoreY + scoreH + 50;

    // === 进度条可视化 ===
    const barX = scoreX + 20;
    const barW = scoreW - 40;
    const barH = 24;

    // 背景
    roundRect(ctx, barX, y, barW, barH, 12);
    ctx.fillStyle = colors.border.light;
    ctx.fill();

    // 进度
    const progressW = (barW * accuracy) / 100;
    if (progressW > 0) {
      roundRect(ctx, barX, y, progressW, barH, 12);
      const barGrad = ctx.createLinearGradient(barX, y, barX + progressW, y);
      barGrad.addColorStop(0, colors.primary.green);
      barGrad.addColorStop(1, colors.primary.greenLight);
      ctx.fillStyle = barGrad;
      ctx.fill();
    }

    y += barH + 60;

    // === 底部日期和水印 ===
    const displayDate = date || new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.font = "24px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.muted;
    ctx.fillText(`📅 ${displayDate}`, W / 2, y);

    y += 50;
    ctx.font = "20px -apple-system, sans-serif";
    ctx.fillStyle = colors.text.muted;
    ctx.fillText("— 宝贝学习成绩单 —", W / 2, y);

    // === 底部装饰星星 (给满分额外彩蛋) ===
    if (isPerfect) {
      const starPositions = [
        { x: 120, y: H - 160 },
        { x: W - 120, y: H - 160 },
        { x: 200, y: H - 200 },
        { x: W - 200, y: H - 200 },
      ];
      for (const pos of starPositions) {
        ctx.fillStyle = colors.accent.yellow;
        ctx.globalAlpha = 0.6;
        drawStar(ctx, pos.x, pos.y, 5, 18, 8);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 导出为 data URL
    resolve(canvas.toDataURL("image/png", 0.92));
  });
}

/**
 * 下载分享卡片
 */
export async function downloadShareCard(data: ShareCardData): Promise<void> {
  const dataUrl = await generateShareCard(data);
  const link = document.createElement("a");
  link.download = `学习成绩_${data.gameName || "游戏"}_${new Date().toISOString().split("T")[0]}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * 尝试使用 Web Share API 分享（移动端优先）
 * 如果不支持则回退到下载
 */
export async function shareCard(data: ShareCardData): Promise<boolean> {
  const dataUrl = await generateShareCard(data);

  // 将 data URL 转为 Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File(
    [blob],
    `学习成绩_${data.gameName || "游戏"}.png`,
    { type: "image/png" }
  );

  // 优先尝试 Web Share API (移动端/iPad)
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "宝贝的学习成绩",
        text: `${data.gameName} - 答对 ${data.correct}/${data.total}题 (${Math.round((data.correct / data.total) * 100)}%)`,
        files: [file],
      });
      return true;
    } catch (e) {
      // 用户取消分享，静默处理
      if ((e as Error).name === "AbortError") return false;
    }
  }

  // 回退：下载图片
  await downloadShareCard(data);
  return true;
}
