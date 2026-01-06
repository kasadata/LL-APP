
import { Combination, FilterSettings } from './types';

export const generateCombinations = (count: number): Combination[] => {
  const combinations: Combination[] = [];
  for (let i = 0; i < count; i++) {
    const set = new Set<number>();
    while (set.size < 5) {
      set.add(Math.floor(Math.random() * 69) + 1);
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
    const odds = 5 - evens;
    if (mode === 'exclude-skewed') {
      // Exclude 5:0 or 0:5
      return evens !== 0 && evens !== 5;
    } else {
      // Only 2:3 or 3:2
      return evens === 2 || evens === 3;
    }
  });
};

export const filterBySize = (combos: Combination[], mode: 'exclude-skewed' | 'only-balanced'): Combination[] => {
  return combos.filter(combo => {
    const smalls = combo.filter(n => n <= 34).length; // 1-34 Small, 35-69 Big
    const bigs = 5 - smalls;
    if (mode === 'exclude-skewed') {
      return smalls !== 0 && smalls !== 5;
    } else {
      return smalls === 2 || smalls === 3;
    }
  });
};

export const filterByConsecutive = (combos: Combination[], mode: 'allow-one-pair' | 'none'): Combination[] => {
  return combos.filter(combo => {
    let consecutivePairs = 0;
    const sorted = [...combo].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) {
        consecutivePairs++;
      }
    }
    if (mode === 'none') return consecutivePairs === 0;
    return consecutivePairs <= 1;
  });
};

export const filterByZones = (combos: Combination[], min: number, max: number): Combination[] => {
  return combos.filter(combo => {
    const zoneIndices = new Set(combo.map(n => Math.floor((n - 1) / 10)));
    const zoneCount = zoneIndices.size;
    return zoneCount >= min && zoneCount <= max;
  });
};

export const filterByTail = (combos: Combination[], mode: 'allow-one-pair' | 'none'): Combination[] => {
  return combos.filter(combo => {
    const tails = combo.map(n => n % 10);
    const counts: Record<number, number> = {};
    tails.forEach(t => counts[t] = (counts[t] || 0) + 1);
    
    const values = Object.values(counts);
    // mode 'none': all tails unique (all values are 1)
    if (mode === 'none') return values.every(v => v === 1);
    
    // mode 'allow-one-pair': At most one pair (one 2, rest 1s)
    // No triples (3+), and no two distinct pairs
    const pairsCount = values.filter(v => v === 2).length;
    const moreThanPair = values.some(v => v > 2);
    
    return !moreThanPair && pairsCount <= 1;
  });
};
