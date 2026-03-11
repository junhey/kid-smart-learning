"use client";

import { useState } from "react";
import SoundButton from "@/components/ui/SoundButton";
import { 
  playCorrect, 
  playWrong, 
  playClick, 
  playSuccess,
  getSoundManager,
  setVolume,
  getVolume
} from "@/lib/sounds";
import { 
  playPerfectResult, 
  playGoodResult, 
  playFairResult,
  playStarEarned,
  playGameStart,
  playGameEnd,
  getGameSoundSystem
} from "@/lib/game-sounds";

export default function SoundDemoPage() {
  const soundManager = getSoundManager();
  const gameSoundSystem = getGameSoundSystem();
  
  const [volume, setVolume] = useState(() => getVolume());
  const [isEnabled, setIsEnabled] = useState(() => soundManager.isEnabled);
  
  const handleVolumeChange = (level: number) => {
    setVolume(level);
    // soundManager.setVolume已经通过setVolume调用过了
  };
  
  const toggleEnabled = () => {
    if (isEnabled) {
      soundManager.disable();
      gameSoundSystem.disable();
    } else {
      soundManager.enable();
      gameSoundSystem.enable();
    }
    setIsEnabled(!isEnabled);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🎵 kid-smart 音效系统演示
        </h1>
        <p className="text-center text-gray-600 mb-8">
          体验Duolingo风格的音效反馈系统
        </p>
        
        {/* 控制面板 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-4 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">控制面板</h2>
              <p className="text-gray-600">音效状态: {isEnabled ? "✅ 已启用" : "🔇 已禁用"}</p>
            </div>
            <SoundButton onClick={toggleEnabled} variant={isEnabled ? "success" : "neutral"}>
              {isEnabled ? "禁用音效" : "启用音效"}
            </SoundButton>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">音量: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-blue-300 to-green-300 rounded-full appearance-none"
            />
          </div>
        </div>
        
        {/* 反馈音效 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 反馈音效</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>正确音效</span>
                <SoundButton onClick={playCorrect} variant="success">
                  播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>错误音效</span>
                <SoundButton onClick={playWrong} variant="danger">
                  播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>点击音效</span>
                <SoundButton onClick={playClick} variant="primary">
                  播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>成功音效</span>
                <SoundButton onClick={playSuccess} variant="success">
                  播放
                </SoundButton>
              </div>
            </div>
          </div>
          
          {/* 游戏音效 */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎮 游戏音效</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>完美结果</span>
                <SoundButton onClick={playPerfectResult} variant="success">
                  🏆 播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>良好结果</span>
                <SoundButton onClick={playGoodResult} variant="success">
                  🌟 播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>一般结果</span>
                <SoundButton onClick={playFairResult} variant="neutral">
                  👍 播放
                </SoundButton>
              </div>
              <div className="flex items-center justify-between">
                <span>获得星星</span>
                <SoundButton onClick={playStarEarned} variant="primary">
                  ⭐ 播放
                </SoundButton>
              </div>
            </div>
          </div>
        </div>
        
        {/* 场景音效 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6 border-4 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎭 场景音效</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">游戏开始</span>
                <SoundButton onClick={playGameStart} variant="primary">
                  ▶️ 播放
                </SoundButton>
              </div>
              <p className="text-sm text-gray-600 mt-2">Duolingo风格的上滑音</p>
            </div>
            <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">游戏结束</span>
                <SoundButton onClick={playGameEnd} variant="neutral">
                  ⏹️ 播放
                </SoundButton>
              </div>
              <p className="text-sm text-gray-600 mt-2">温和的下滑音</p>
            </div>
          </div>
        </div>
        
        {/* 说明 */}
        <div className="mt-8 text-gray-600 text-sm bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <h4 className="font-bold text-gray-700 mb-2">音效系统特点：</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>🎵 <strong>Duolingo风格音效设计</strong>：友好、积极、鼓励性</li>
            <li>🔊 <strong>Web Audio API实现</strong>：无需加载音频文件</li>
            <li>🎚️ <strong>实时音量控制</strong>：可根据用户偏好调整</li>
            <li>💝 <strong>10种不同音效</strong>：覆盖各种游戏场景</li>
            <li>🔄 <strong>向后兼容</strong>：现有代码无需修改即可使用</li>
          </ul>
        </div>
        
        <div className="text-center mt-8">
          <SoundButton 
            onClick={() => {
              playGameStart();
              setTimeout(playCorrect, 500);
              setTimeout(playWrong, 1000);
              setTimeout(playPerfectResult, 1500);
              setTimeout(playGameEnd, 2000);
            }}
            variant="primary"
            className="px-8 py-4 text-lg"
          >
            🎵 播放完整演示
          </SoundButton>
          <p className="text-gray-500 text-sm mt-2">按顺序播放所有音效</p>
        </div>
      </div>
    </div>
  );
}