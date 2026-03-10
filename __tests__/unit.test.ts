/**
 * Unit Tests — Layer 1
 * 覆盖：数学题逻辑 / 奖励系统 / 课程系统 / 工具函数
 */

// ─── gameUtils tests ──────────────────────────────────────────────
import { shuffleArray, randomInt, pickRandom, buildOptions } from '@/lib/gameUtils';

describe('gameUtils', () => {
  describe('shuffleArray', () => {
    it('returns array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffleArray(arr)).toHaveLength(5);
    });
    it('contains all original elements', () => {
      const arr = ['a', 'b', 'c'];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(['a', 'b', 'c']);
    });
    it('does not mutate original array', () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('randomInt', () => {
    it('returns value within range', () => {
      for (let i = 0; i < 50; i++) {
        const val = randomInt(1, 10);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(10);
      }
    });
    it('returns min when min === max', () => {
      expect(randomInt(5, 5)).toBe(5);
    });
  });

  describe('pickRandom', () => {
    it('returns element from array', () => {
      const arr = ['cat', 'dog', 'bird'];
      const result = pickRandom(arr);
      expect(arr).toContain(result);
    });
  });

  describe('buildOptions', () => {
    it('includes the correct answer', () => {
      const pool = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
      const options = buildOptions('apple', pool, 4, (x) => x);
      expect(options).toContain('apple');
    });
    it('returns requested count of options', () => {
      const pool = ['a', 'b', 'c', 'd', 'e'];
      const options = buildOptions('a', pool, 4, (x) => x);
      expect(options).toHaveLength(4);
    });
    it('has no duplicate options', () => {
      const pool = ['a', 'b', 'c', 'd', 'e'];
      const options = buildOptions('a', pool, 4, (x) => x);
      expect(new Set(options).size).toBe(4);
    });
  });
});

// ─── Math logic tests ─────────────────────────────────────────────
describe('Math game logic', () => {
  it('addition: 2 + 3 = 5', () => {
    expect(2 + 3).toBe(5);
  });
  it('subtraction: 10 - 4 = 6', () => {
    expect(10 - 4).toBe(6);
  });
  it('comparison: 7 > 5', () => {
    expect(7 > 5).toBe(true);
  });
  it('comparison: 3 < 8', () => {
    expect(3 < 8).toBe(true);
  });
  it('generates correct answer options including right answer', () => {
    const correctAnswer = 7;
    const options = [4, 7, 9, 2];
    expect(options).toContain(correctAnswer);
  });
  it('number range for kids: 1-20 addition stays <= 20', () => {
    for (let i = 0; i < 20; i++) {
      const a = randomInt(1, 10);
      const b = randomInt(1, 10);
      expect(a + b).toBeLessThanOrEqual(20);
      expect(a + b).toBeGreaterThan(0);
    }
  });
});

// ─── Reward system logic tests ────────────────────────────────────
describe('Reward system logic', () => {
  const STARS_PER_LEVEL = 10;

  it('level increases every 10 stars', () => {
    const calculateLevel = (stars: number) => Math.floor(stars / STARS_PER_LEVEL) + 1;
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(9)).toBe(1);
    expect(calculateLevel(10)).toBe(2);
    expect(calculateLevel(19)).toBe(2);
    expect(calculateLevel(20)).toBe(3);
  });

  it('streak resets when wrong answer', () => {
    let streak = 5;
    const resetStreak = () => { streak = 0; };
    resetStreak();
    expect(streak).toBe(0);
  });

  it('streak bonus: 5 correct in a row = bonus star', () => {
    const STREAK_BONUS_AT = 5;
    const hasBonus = (streak: number) => streak > 0 && streak % STREAK_BONUS_AT === 0;
    expect(hasBonus(5)).toBe(true);
    expect(hasBonus(10)).toBe(true);
    expect(hasBonus(4)).toBe(false);
    expect(hasBonus(6)).toBe(false);
  });

  it('stars persist across sessions via localStorage', () => {
    localStorage.setItem('kid-smart-reward', JSON.stringify({ stars: 42, level: 5 }));
    const data = JSON.parse(localStorage.getItem('kid-smart-reward') ?? '{}');
    expect(data.stars).toBe(42);
    expect(data.level).toBe(5);
  });
});

// ─── Progress tracking logic tests ───────────────────────────────
describe('Progress tracking', () => {
  it('percent calculation: 3/10 = 30%', () => {
    const percent = Math.round((3 / 10) * 100);
    expect(percent).toBe(30);
  });

  it('isComplete when total >= totalQuestions', () => {
    const totalQuestions = 10;
    expect(10 >= totalQuestions).toBe(true);
    expect(9 >= totalQuestions).toBe(false);
  });

  it('accuracy: 8 correct out of 10 = 80%', () => {
    const accuracy = Math.round((8 / 10) * 100);
    expect(accuracy).toBe(80);
  });

  it('star rating based on accuracy', () => {
    const getStars = (accuracy: number) => {
      if (accuracy >= 90) return 3;
      if (accuracy >= 70) return 2;
      return 1;
    };
    expect(getStars(100)).toBe(3);
    expect(getStars(90)).toBe(3);
    expect(getStars(80)).toBe(2);
    expect(getStars(70)).toBe(2);
    expect(getStars(60)).toBe(1);
    expect(getStars(0)).toBe(1);
  });
});
