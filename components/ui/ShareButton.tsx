"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, borderRadius, shadows } from "@/lib/design-tokens";
import { shareCard, generateShareCard } from "@/lib/share-card";

interface ShareButtonProps {
  correct: number;
  total: number;
  gameName?: string;
}

/**
 * 分享给家长按钮 + 预览弹窗
 * 
 * 交互流程：
 * 1. 点击按钮 → 生成预览卡片
 * 2. 显示预览弹窗 → 确认分享/保存
 * 3. 支持 Web Share API（移动端）或直接下载（桌面端）
 */
export function ShareButton({ correct, total, gameName = "智力游戏" }: ShareButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    setIsGenerating(true);
    try {
      const url = await generateShareCard({ correct, total, gameName });
      setPreviewUrl(url);
      setShowPreview(true);
    } finally {
      setIsGenerating(false);
    }
  }, [correct, total, gameName]);

  const handleConfirmShare = useCallback(async () => {
    const success = await shareCard({ correct, total, gameName });
    if (success) {
      setShared(true);
      setTimeout(() => {
        setShowPreview(false);
        setShared(false);
      }, 1500);
    }
  }, [correct, total, gameName]);

  return (
    <>
      {/* 分享按钮 */}
      <motion.button
        onClick={handleShare}
        disabled={isGenerating}
        className="w-full relative font-bold py-3 px-4 text-base transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: colors.accent.purple,
          color: colors.text.white,
          borderRadius: borderRadius.xl,
          boxShadow: `0 4px 0 0 #A855F7`,
          border: `2px solid #A855F7`,
          minHeight: "48px",
        }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 2, boxShadow: "none" }}
        aria-label="分享成绩给家长"
      >
        <span className="drop-shadow-md flex items-center justify-center gap-2">
          {isGenerating ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block"
            >
              ⏳
            </motion.span>
          ) : (
            "📤"
          )}
          <span>分享给爸爸妈妈</span>
        </span>
      </motion.button>

      {/* 预览弹窗 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 遮罩 */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
            />

            {/* 卡片预览 */}
            <motion.div
              className="relative flex flex-col items-center max-w-sm w-full"
              initial={{ scale: 0.7, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* 预览图片 */}
              <div
                className="w-full overflow-hidden mb-4"
                style={{
                  borderRadius: borderRadius["2xl"],
                  boxShadow: shadows.xl,
                }}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="成绩分享卡片预览"
                    className="w-full h-auto"
                    style={{ display: "block" }}
                  />
                )}
              </div>

              {/* 操作按钮区 */}
              {shared ? (
                <motion.div
                  className="flex items-center gap-2 py-3 px-6 font-bold text-lg"
                  style={{
                    backgroundColor: colors.primary.green,
                    color: colors.text.white,
                    borderRadius: borderRadius.full,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <span>✅</span>
                  <span>已保存！</span>
                </motion.div>
              ) : (
                <div className="flex gap-3 w-full">
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    className="flex-1 py-3 px-4 font-bold text-base"
                    style={{
                      backgroundColor: colors.background.subtle,
                      color: colors.text.secondary,
                      borderRadius: borderRadius.xl,
                      border: `2px solid ${colors.border.light}`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    取消
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmShare}
                    className="flex-[2] py-3 px-4 font-bold text-base"
                    style={{
                      backgroundColor: colors.primary.green,
                      color: colors.text.white,
                      borderRadius: borderRadius.xl,
                      boxShadow: shadows.button,
                      border: `2px solid ${colors.primary.greenDark}`,
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 2 }}
                  >
                    📱 保存 / 分享
                  </motion.button>
                </div>
              )}

              {/* 提示文字 */}
              <p
                className="mt-3 text-sm text-center"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                长按图片也可以保存哦 ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
