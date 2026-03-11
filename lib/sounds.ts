/**
 * Kid Smart 学习应用音效系统
 * 采用类似Duolingo的友好音效设计
 */

export type SoundType = 
  | 'correct'      // 答对时播放
  | 'wrong'        // 答错时播放
  | 'click'        // 按钮点击
  | 'success'      // 任务成功完成
  | 'levelUp'      // 等级提升
  | 'star'         // 获得星星
  | 'hover'        // 鼠标悬停
  | 'transition'   // 页面切换
  | 'gameStart'    // 游戏开始
  | 'gameEnd';     // 游戏结束

interface SoundConfig {
  frequency: number;      // 基础频率 (Hz)
  duration: number;       // 持续时间 (秒)
  type: 'sine' | 'square' | 'triangle' | 'sawtooth';
  volume: number;          // 音量 0-1
  effects?: {
    vibrato?: { depth: number; speed: number };  // 颤音
    fadeOut?: boolean;                           // 淡出
    pitchRamp?: { start: number; end: number };  // 音高变化
  };
}

const SOUNDS: Record<SoundType, SoundConfig> = {
  correct: {
    frequency: 880,  // A5
    duration: 0.3,
    type: 'sine',
    volume: 0.2,
    effects: {
      pitchRamp: { start: 880, end: 1320 }, // 向上滑音，表示积极反馈
      fadeOut: true,
    }
  },
  wrong: {
    frequency: 440,  // A4
    duration: 0.25,
    type: 'square',
    volume: 0.15,
    effects: {
      vibrato: { depth: 20, speed: 8 }, // 轻微的颤音，表示错误但友好
      fadeOut: true,
    }
  },
  click: {
    frequency: 660,  // E5
    duration: 0.05,
    type: 'sine',
    volume: 0.1,
  },
  success: {
    frequency: 523.25,  // C5
    duration: 0.4,
    type: 'triangle',
    volume: 0.25,
    effects: {
      pitchRamp: { start: 523.25, end: 1046.5 }, // 八度滑音
      fadeOut: true,
    }
  },
  levelUp: {
    frequency: 659.25,  // E5
    duration: 0.6,
    type: 'sawtooth',
    volume: 0.3,
    effects: {
      pitchRamp: { start: 659.25, end: 1318.51 }, // E5到E6
      fadeOut: true,
    }
  },
  star: {
    frequency: 784,  // G5
    duration: 0.2,
    type: 'sine',
    volume: 0.2,
    effects: {
      pitchRamp: { start: 784, end: 1568 },
      fadeOut: true,
    }
  },
  hover: {
    frequency: 554.37,  // C#5
    duration: 0.08,
    type: 'sine',
    volume: 0.05,
  },
  transition: {
    frequency: 392,  // G4
    duration: 0.15,
    type: 'sine',
    volume: 0.1,
    effects: {
      pitchRamp: { start: 392, end: 523.25 }, // G4到C5
      fadeOut: true,
    }
  },
  gameStart: {
    frequency: 440,  // A4
    duration: 0.3,
    type: 'triangle',
    volume: 0.25,
    effects: {
      pitchRamp: { start: 440, end: 880 }, // 向上滑音
      fadeOut: true,
    }
  },
  gameEnd: {
    frequency: 523.25,  // C5
    duration: 0.5,
    type: 'sine',
    volume: 0.2,
    effects: {
      pitchRamp: { start: 523.25, end: 261.63 }, // 向下滑音
      fadeOut: true,
    }
  },
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;
  private volume = 0.5; // 全局音量控制

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
  }

  play(type: SoundType) {
    if (!this.isEnabled || !this.audioContext) return;

    const sound = SOUNDS[type];
    if (!sound) return;

    const now = this.audioContext.currentTime;
    
    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = sound.type as OscillatorType;
    oscillator.frequency.setValueAtTime(sound.frequency, now);
    
    // 创建增益节点
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    
    // 应用全局音量
    const finalGain = sound.volume * this.volume;
    gainNode.gain.linearRampToValueAtTime(finalGain, now + 0.01);
    
    // 应用音效
    if (sound.effects?.pitchRamp) {
      const { start, end } = sound.effects.pitchRamp;
      oscillator.frequency.setValueAtTime(start, now);
      oscillator.frequency.linearRampToValueAtTime(end, now + sound.duration);
    }
    
    if (sound.effects?.vibrato) {
      const { depth, speed } = sound.effects.vibrato;
      oscillator.frequency.setValueAtTime(sound.frequency, now);
      oscillator.frequency.setValueAtTime(sound.frequency + depth, now + 0.1);
    }
    
    if (sound.effects?.fadeOut) {
      gainNode.gain.linearRampToValueAtTime(finalGain * 0.1, now + sound.duration);
    } else {
      gainNode.gain.linearRampToValueAtTime(0, now + sound.duration);
    }
    
    // 连接并播放
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + sound.duration);
  }

  playCorrect() {
    this.play('correct');
  }

  playWrong() {
    this.play('wrong');
  }

  playClick() {
    this.play('click');
  }

  playSuccess() {
    this.play('success');
  }
}

// 创建单例实例
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

// 直接使用的辅助函数
export function playCorrect() {
  getSoundManager().playCorrect();
}

export function playWrong() {
  getSoundManager().playWrong();
}

export function playClick() {
  getSoundManager().playClick();
}

export function playSuccess() {
  getSoundManager().playSuccess();
}