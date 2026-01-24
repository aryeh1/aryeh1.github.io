import type { Point, GeneratorParams } from './types';

/** DJB2-variant hash function for deterministic randomness */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** Mulberry32 seeded PRNG */
export function createSeededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Rose Curve (Rhodonea) - r = a * cos(k1*t) * sin(k2*t) */
export function generateRoseCurve(params: GeneratorParams): Point[] {
  const { centerX, centerY, amplitude, k1, k2, loops = 6 } = params;
  const points: Point[] = [];
  const step = 0.02;
  const maxT = Math.PI * 2 * loops;

  for (let t = 0; t <= maxT; t += step) {
    const r = amplitude * Math.cos(k1 * t) * Math.sin(k2 * t);
    points.push({
      x: centerX + r * Math.cos(t),
      y: centerY + r * Math.sin(t),
    });
  }

  return points;
}

/** Star Polygon - alternating inner/outer radius */
export function generateStarPolygon(params: GeneratorParams): Point[] {
  const { centerX, centerY, amplitude, points: numPoints = 6 } = params;
  const result: Point[] = [];
  const angleStep = Math.PI / numPoints;

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const radius = i % 2 === 0 ? amplitude : amplitude * 0.5;
    result.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // Close the path
  result.push(result[0]);
  return result;
}

/** Mandala Pattern - r = a * cos(k1*t) * cos(k2*t) */
export function generateMandala(params: GeneratorParams): Point[] {
  const { centerX, centerY, amplitude, k1, k2, loops = 12 } = params;
  const points: Point[] = [];
  const step = 0.02;
  const maxT = Math.PI * 2 * loops;

  for (let t = 0; t <= maxT; t += step) {
    const r = amplitude * Math.cos(k1 * t) * Math.cos(k2 * t);
    points.push({
      x: centerX + r * Math.cos(t),
      y: centerY + r * Math.sin(t),
    });
  }

  return points;
}

/** Eye Pattern - swapped sin/cos creates eye-like shapes */
export function generateEyePattern(params: GeneratorParams): Point[] {
  const { centerX, centerY, amplitude, k1, loops = 8 } = params;
  const points: Point[] = [];
  const step = 0.02;
  const maxT = Math.PI * 2 * loops;

  for (let t = 0; t <= maxT; t += step) {
    const r = amplitude * Math.sin(k1 * t) * Math.sin(t);
    points.push({
      x: centerX + r * Math.sin(t),
      y: centerY + r * Math.cos(t),
    });
  }

  return points;
}

/** Complex Multi-Layer Path with interference */
export function generateComplexPath(params: GeneratorParams): Point[] {
  const { centerX, centerY, amplitude, k1, k2, loops = 10 } = params;
  const points: Point[] = [];
  const step = 0.02;
  const maxT = Math.PI * 2 * loops;

  for (let t = 0; t <= maxT; t += step) {
    const phaseOffset = Math.PI / 6;
    const ampMod = 1 + 0.2 * Math.sin(t * 3);

    const r1 = amplitude * Math.cos(k1 * t + phaseOffset);
    const r2 = amplitude * 0.3 * Math.sin(k2 * t);
    const r = r1 + r2 * ampMod;

    points.push({
      x: centerX + r * Math.cos(t),
      y: centerY + r * Math.sin(t),
    });
  }

  return points;
}

/** Convert points array to SVG path d attribute */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';

  return points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`
  ).join(' ');
}
