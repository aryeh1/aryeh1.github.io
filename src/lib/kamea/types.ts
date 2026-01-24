export interface Point {
  x: number;
  y: number;
}

export type PathPoints = Point[];

export type ShapeType = 'rose' | 'star' | 'mandala' | 'eye' | 'complex';

export interface GeneratorParams {
  centerX: number;
  centerY: number;
  amplitude: number;
  k1: number;
  k2: number;
  loops?: number;
  points?: number;
}

export interface KameaLayer {
  id: string;
  path: PathPoints;
  shapeType: ShapeType;
  params: GeneratorParams;
  hue: number;
  strokeWidth: number;
  rotationSpeed: number;
}

export interface KameaConfig {
  input: string;
  hash: number;
  baseHue: number;
  layers: KameaLayer[];
  size: number;
}

export interface KameaHistoryItem {
  id: string;
  input: string;
  timestamp: number;
}
