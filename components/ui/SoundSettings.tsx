/**
 * Sound Settings Component
 * 允许用户控制音效开关和音量
 */

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundFeedback } from '@/lib/sound-feedback';

const SOUND_ENABLED_KEY = 'kid-smart-sound-enabled';
const SOUND_VOLUME_KEY = 'kid-smart-sound-volume';

export function SoundSettings() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);

  // 从 localStorage 加载设置
  useEffect(() => {
    try {
      const savedEnabled = localStorage.getItem(SOUND_ENABLED_KEY);
      if (savedEnabled !== null) {
        const isEnabled = savedEnabled === 'true';
        setEnabled(isEnabled);
        soundFeedback.setEnabled(isEnabled);
      }

      const savedVolume = localStorage.getItem(SOUND_VOLUME_KEY);
      if (savedVolume !== null) {
        const vol = parseFloat(savedVolume);
        setVolume(vol);
        soundFeedback.setVolume(vol);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleEnabled = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    soundFeedback.setEnabled(newEnabled);
    
    try {
      localStorage.setItem(SOUND_ENABLED_KEY, String(newEnabled));
    } catch {
      // ignore
    }

    // 播放测试音效
    if (newEnabled) {
      soundFeedback.play('click');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundFeedback.setVolume(newVolume);

    try {
      localStorage.setItem(SOUND_VOLUME_KEY, String(newVolume));
    } catch {
      // ignore
    }

    // 播放测试音效
    if (enabled) {
      soundFeedback.play('click');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(!showSettings)}
        className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-shadow"
        aria-label="音效设置"
      >
        {enabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-64"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">音效设置</h3>

          {/* Enable/Disable */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">开启音效</span>
            <button
              onClick={handleToggleEnabled}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                enabled ? 'bg-green-400' : 'bg-gray-300'
              }`}
              aria-label={enabled ? '关闭音效' : '开启音效'}
            >
              <motion.div
                animate={{ x: enabled ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Volume Slider */}
          {enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">音量</span>
                <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-400"
                aria-label="调节音量"
              />
            </div>
          )}

          {/* Test Buttons */}
          {enabled && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">测试音效</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => soundFeedback.play('correct')}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  ✅ 正确
                </button>
                <button
                  onClick={() => soundFeedback.play('wrong')}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  ❌ 错误
                </button>
                <button
                  onClick={() => soundFeedback.play('complete')}
                  className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  🏆 完成
                </button>
                <button
                  onClick={() => soundFeedback.play('star')}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  ⭐ 星星
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
