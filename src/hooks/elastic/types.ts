
export interface GlobalElasticOptions {
  enabled?: boolean;
  maxElasticDistance?: number;
  elasticityMultiplier?: number;
  indicatorEnabled?: boolean;
  resistanceCurve?: 'soft' | 'normal' | 'firm';
}

export interface ElasticState {
  isElasticActive: boolean;
  startX: number;
  startY: number;
  currentStretchX: number;
  currentStretchY: number;
  animationFrame: number | null;
  isScrolling: boolean;
  scrollTimeout: ReturnType<typeof setTimeout> | null;
  lastTransformEl?: HTMLElement | null;
  lastScrollEl?: HTMLElement | null;
  scrollSpeed: number;
  lastScrollTime: number;
  config: Required<GlobalElasticOptions>;
}
