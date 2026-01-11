
import { Combination, GameType } from './types';

export const generateCombinations = (count: number, gameType: GameType): Combination[] => {
  const combinations: Combination[] = [];
  const maxNum = gameType === GameType.POWERBALL ? 69 : 70;
  
  for (let i = 0; i < count; i++) {
    const set = new Set<number>();
    while (set.size < 5) {
      set.add(Math.floor(Math.random() * maxNum) + 1);
    }
    combinations.push(Array.from(set).sort((a, b) => a - b));
  }
  return combinations;
};

export const filterBySum = (combos: Combination[], min: number, max: number): Combination[] => {
  return combos.filter(combo => {
    const sum = combo.reduce((a, b) => a + b, 0);
    return sum >= min && sum <= max;
  });
};

export const filterByEvenOdd = (combos: Combination[], mode: 'exclude-skewed' | 'only-balanced'): Combination[] => {
  return combos.filter(combo => {
    const evens = combo.filter(n => n % 2 === 0).length;
    if (mode === 'exclude-skewed') return evens !== 0 && evens !== 5;
    return evens === 2 || evens === 3;
  });
};

export const filterBySize = (combos: Combination[], mode: 'exclude-skewed' | 'only-balanced', gameType: GameType): Combination[] => {
  const split = gameType === GameType.POWERBALL ? 34 : 35;
  return combos.filter(combo => {
    const smalls = combo.filter(n => n <= split).length;
    if (mode === 'exclude-skewed') return smalls !== 0 && smalls !== 5;
    return smalls === 2 || smalls === 3;
  });
};

export const filterByConsecutive = (combos: Combination[], mode: 'allow-one-pair' | 'none'): Combination[] => {
  return combos.filter(combo => {
    let consecutivePairs = 0;
    for (let i = 0; i < combo.length - 1; i++) {
      if (combo[i + 1] - combo[i] === 1) consecutivePairs++;
    }
    if (mode === 'none') return consecutivePairs === 0;
    return consecutivePairs <= 1;
  });
};

export const filterByZones = (combos: Combination[], min: number, max: number): Combination[] => {
  return combos.filter(combo => {
    const zones = new Set(combo.map(n => Math.floor((n - 1) / 10)));
    return zones.size >= min && zones.size <= max;
  });
};

export const filterByTail = (combos: Combination[], mode: 'allow-one-pair' | 'none'): Combination[] => {
  return combos.filter(combo => {
    const tails = combo.map(n => n % 10);
    const counts: Record<number, number> = {};
    tails.forEach(t => counts[t] = (counts[t] || 0) + 1);
    const values = Object.values(counts);
    
    // Check for triples or higher (skewed)
    if (values.some(v => v > 2)) return false;
    
    const pairsCount = values.filter(v => v === 2).length;
    if (mode === 'none') return pairsCount === 0;
    return pairsCount >= 1; // Keep combos that include at least one same-tail pair (and no triples).
  });
};
