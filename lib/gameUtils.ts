export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandom<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

export function pickRandomOne<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

export function generateWrongOptions<T>(
  correct: T,
  pool: T[],
  count: number,
  getId: (item: T) => string
): T[] {
  const others = pool.filter((item) => getId(item) !== getId(correct));
  return pickRandom(others, count);
}

export function buildOptions<T>(
  correct: T,
  pool: T[],
  totalOptions: number,
  getId: (item: T) => string
): T[] {
  const wrong = generateWrongOptions(correct, pool, totalOptions - 1, getId);
  return shuffleArray([correct, ...wrong]);
}

export function getEmojiObjects(emoji: string, count: number): string[] {
  return Array(count).fill(emoji);
}

export function formatScore(correct: number, total: number): string {
  return `${correct}/${total}`;
}

export function getStarRating(correct: number, total: number): number {
  const percent = correct / total;
  if (percent >= 0.9) return 3;
  if (percent >= 0.6) return 2;
  return 1;
}
