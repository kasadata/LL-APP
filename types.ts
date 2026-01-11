
export type Combination = number[];

export enum GameType {
  POWERBALL = 'POWERBALL',
  MEGA_MILLIONS = 'MEGA_MILLIONS'
}

export enum Step {
  HOME = -1,
  COUNT = 0,
  SUM = 1,
  EVEN_ODD = 2,
  SIZE = 3,
  CONSECUTIVE = 4,
  ZONES = 5,
  TAIL = 6,
  RESULT = 7
}

export interface FilterSettings {
  sumRange: [number, number];
  evenOddMode: 'exclude-skewed' | 'only-balanced';
  sizeMode: 'exclude-skewed' | 'only-balanced';
  consecutiveMode: 'allow-one-pair' | 'none';
  zonesMode: { min: number, max: number };
  tailMode: 'allow-one-pair' | 'none';
}
