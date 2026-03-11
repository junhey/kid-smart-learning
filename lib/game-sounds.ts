/**
 * 游戏音效系统 - 高级音效控制
 * 这个模块提供了更多游戏相关的音效功能
 */

import { getSoundManager, SoundType } from './sounds';

export class GameSoundSystem {
  private soundManager = getSoundManager();
  private isEnabled = true;
  private isMuted = false;
  
  // 游戏场景音效
  playGameStart() {
    if (!this.isEnabled || this.isMuted) return;
    this.soundManager.play('gameStart');
  }
  
  playGameEnd() {
    if (!this.isEnabled || this.isMuted) return;
    this.soundManager.play('gameEnd');
  }
  
  // 游戏结果音效
  playPerfectResult() {
    if (!this.isEnabled || this.isMuted) return;
    // 播放成功音效和华丽音效
    this.soundManager.play('success');
    // 延迟播放额外的庆祝音效
    setTimeout(() => {
      if (!this.isEnabled || this.isMuted) return;
      this.soundManager.play('levelUp');
    }, 300);
  }
  
  playGoodResult() {
    if (!this.isEnabled || this.isMuted) return;
    this.soundManager.play('success');
  }
  
  playFairResult() {
    if (!this.isEnabled || this.isMuted) return;
    // 温和的正面音效
    this.soundManager.play('transition');
  }
  
  // 等级提升音效
  playLevelUp() {
    if (!this.isEnabled || this.isMuted) return;
    this.soundManager.play('levelUp');
  }
  
  // 星星获得音效
  playStarEarned() {
    if (!this.isEnabled || this.isMuted) return;
    this.soundManager.play('star');
  }
  
  // 控制方法
  enable() {
    this.isEnabled = true;
    this.soundManager.enable();
  }
  
  disable() {
    this.isEnabled = false;
    this.soundManager.disable();
  }
  
  mute() {
    this.isMuted = true;
  }
  
  unmute() {
    this.isMuted = false;
  }
  
  setVolume(level: number) {
    this.soundManager.setVolume(level);
  }
}

// 单例实例
let gameSoundSystemInstance: GameSoundSystem | null = null;

export function getGameSoundSystem(): GameSoundSystem {
  if (!gameSoundSystemInstance) {
    gameSoundSystemInstance = new GameSoundSystem();
  }
  return gameSoundSystemInstance;
}

// 快速访问函数
export function playPerfectResult() {
  getGameSoundSystem().playPerfectResult();
}

export function playGoodResult() {
  getGameSoundSystem().playGoodResult();
}

export function playFairResult() {
  getGameSoundSystem().playFairResult();
}

export function playStarEarned() {
  getGameSoundSystem().playStarEarned();
}

export function playGameStart() {
  getGameSoundSystem().playGameStart();
}

export function playGameEnd() {
  getGameSoundSystem().playGameEnd();
}