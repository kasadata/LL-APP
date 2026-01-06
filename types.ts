
export type Combination = number[];

export enum Mode {
  STEP_BY_STEP = 'step-by-step',
  ONE_CLICK = 'one-click'
}

export enum Step {
  INITIAL = 0,
  COUNT = 1,
  SUM = 2,
  EVEN_ODD = 3,
  SIZE = 4,
  CONSECUTIVE = 5,
  ZONES = 6,
  TAIL = 7,
  RESULT = 8
}

export interface FilterSettings {
  sumRange: [number, number];
  evenOddMode: 'exclude-skewed' | 'only-balanced'; // 5:0/0:5 vs 2:3/3:2
  sizeMode: 'exclude-skewed' | 'only-balanced';
  consecutiveMode: 'allow-one-pair' | 'none';
  zonesMode: { min: number, max: number };
  tailMode: 'allow-one-pair' | 'none';
}
