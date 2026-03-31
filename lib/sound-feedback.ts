/**
 * Sound Feedback System
 * 为儿童学习应用提供愉悦的音效反馈
 * 使用 Web Audio API 合成音效，避免外部资源加载
 */

type SoundType = 'correct' | 'wrong' | 'complete' | 'click' | 'star';

class SoundFeedback {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.3; // 默认音量 30%

  constructor() {
    // 仅在浏览器环境初始化
    if (typeof window !== 'undefined') {
      // 延迟初始化 AudioContext，避免自动播放策略阻止
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      // 检查浏览器支持
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.enabled = false;
    }
  }

  /**
   * 恢复 AudioContext（需要用户交互触发）
   */
  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
      }
    }
  }

  /**
   * 播放音效
   */
  async play(type: SoundType) {
    if (!this.enabled || !this.audioContext) return;

    await this.resumeAudioContext();

    const now = this.audioContext.currentTime;

    switch (type) {
      case 'correct':
        this.playCorrectSound(now);
        break;
      case 'wrong':
        this.playWrongSound(now);
        break;
      case 'complete':
        this.playCompleteSound(now);
        break;
      case 'click':
        this.playClickSound(now);
        break;
      case 'star':
        this.playStarSound(now);
        break;
    }
  }

  /**
   * 正确答案音效 - 明亮上升的和弦 (C-E-G)
   */
  private playCorrectSound(startTime: number) {
    if (!this.audioContext) return;

    const notes = [261.63, 329.63, 392.00]; // C4, E4, G4
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      // 音量包络：快速攻击，平滑释放
      gain.gain.setValueAtTime(0, startTime + i * 0.05);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.4, startTime + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.05 + duration);

      osc.start(startTime + i * 0.05);
      osc.stop(startTime + i * 0.05 + duration);
    });
  }

  /**
   * 错误答案音效 - 低沉下降的两音符
   */
  private playWrongSound(startTime: number) {
    if (!this.audioContext) return;

    const notes = [293.66, 246.94]; // D4 -> B3 (下降小三度)
    const duration = 0.2;

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.type = 'triangle'; // 柔和的波形
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, startTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, startTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.12 + duration);

      osc.start(startTime + i * 0.12);
      osc.stop(startTime + i * 0.12 + duration);
    });
  }

  /**
   * 完成任务音效 - 胜利的上升音阶 (C-E-G-C)
   */
  private playCompleteSound(startTime: number) {
    if (!this.audioContext) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4-E4-G4-C5
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, startTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, startTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.08 + duration);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + duration);
    });
  }

  /**
   * 点击音效 - 短促的单音
   */
  private playClickSound(startTime: number) {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sine';
    osc.frequency.value = 800; // 高频短促音

    gain.gain.setValueAtTime(this.masterVolume * 0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  /**
   * 获得星星音效 - 闪烁的高频音
   */
  private playStarSound(startTime: number) {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, startTime);
    osc.frequency.exponentialRampToValueAtTime(2000, startTime + 0.1); // 频率上升

    gain.gain.setValueAtTime(this.masterVolume * 0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  /**
   * 设置音量 (0-1)
   */
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 启用/禁用音效
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * 获取当前启用状态
   */
  isEnabled(): boolean {
    return this.enabled && this.audioContext !== null;
  }
}

// 导出单例实例
export const soundFeedback = new SoundFeedback();

/**
 * React Hook: 在组件中使用音效
 */
export function useSoundFeedback() {
  return {
    play: (type: SoundType) => soundFeedback.play(type),
    setVolume: (volume: number) => soundFeedback.setVolume(volume),
    setEnabled: (enabled: boolean) => soundFeedback.setEnabled(enabled),
    isEnabled: () => soundFeedback.isEnabled(),
  };
}
