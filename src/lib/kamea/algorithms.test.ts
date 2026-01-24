import { describe, it, expect } from 'vitest';
import {
  hashString,
  createSeededRandom,
  generateRoseCurve,
  generateStarPolygon,
  generateMandala,
  generateEyePattern,
  generateComplexPath,
  pointsToPath,
} from './algorithms';

describe('hashString', () => {
  it('should return consistent hash for same input', () => {
    const hash1 = hashString('test');
    const hash2 = hashString('test');
    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different inputs', () => {
    const hash1 = hashString('hello');
    const hash2 = hashString('world');
    expect(hash1).not.toBe(hash2);
  });

  it('should return positive number', () => {
    const hash = hashString('negative test');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty string', () => {
    const hash = hashString('');
    expect(hash).toBe(0);
  });

  it('should handle Hebrew text', () => {
    const hash = hashString('שלום');
    expect(hash).toBeGreaterThan(0);
  });
});

describe('createSeededRandom', () => {
  it('should return deterministic sequence', () => {
    const random1 = createSeededRandom(12345);
    const random2 = createSeededRandom(12345);

    const seq1 = [random1(), random1(), random1()];
    const seq2 = [random2(), random2(), random2()];

    expect(seq1).toEqual(seq2);
  });

  it('should return values between 0 and 1', () => {
    const random = createSeededRandom(42);
    for (let i = 0; i < 100; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should produce different sequences for different seeds', () => {
    const random1 = createSeededRandom(1);
    const random2 = createSeededRandom(2);

    expect(random1()).not.toBe(random2());
  });
});

describe('generateRoseCurve', () => {
  const params = {
    centerX: 150,
    centerY: 150,
    amplitude: 100,
    k1: 3,
    k2: 2,
    loops: 2,
  };

  it('should generate array of points', () => {
    const points = generateRoseCurve(params);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(0);
  });

  it('should generate points with x and y coordinates', () => {
    const points = generateRoseCurve(params);
    points.forEach(point => {
      expect(typeof point.x).toBe('number');
      expect(typeof point.y).toBe('number');
    });
  });

  it('should generate points centered around centerX, centerY', () => {
    const points = generateRoseCurve(params);
    const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Average should be close to center (within amplitude)
    expect(Math.abs(avgX - params.centerX)).toBeLessThan(params.amplitude);
    expect(Math.abs(avgY - params.centerY)).toBeLessThan(params.amplitude);
  });
});

describe('generateStarPolygon', () => {
  const params = {
    centerX: 150,
    centerY: 150,
    amplitude: 100,
    k1: 0,
    k2: 0,
    points: 6,
  };

  it('should generate correct number of points for star', () => {
    const points = generateStarPolygon(params);
    // Star has 2 * numPoints vertices + 1 to close the path
    expect(points.length).toBe(params.points! * 2 + 1);
  });

  it('should close the path', () => {
    const points = generateStarPolygon(params);
    expect(points[0]).toEqual(points[points.length - 1]);
  });
});

describe('generateMandala', () => {
  const params = {
    centerX: 150,
    centerY: 150,
    amplitude: 100,
    k1: 4,
    k2: 3,
    loops: 6,
  };

  it('should generate array of points', () => {
    const points = generateMandala(params);
    expect(points.length).toBeGreaterThan(0);
  });
});

describe('generateEyePattern', () => {
  const params = {
    centerX: 150,
    centerY: 150,
    amplitude: 100,
    k1: 3,
    k2: 2,
    loops: 4,
  };

  it('should generate array of points', () => {
    const points = generateEyePattern(params);
    expect(points.length).toBeGreaterThan(0);
  });
});

describe('generateComplexPath', () => {
  const params = {
    centerX: 150,
    centerY: 150,
    amplitude: 100,
    k1: 3,
    k2: 5,
    loops: 5,
  };

  it('should generate array of points', () => {
    const points = generateComplexPath(params);
    expect(points.length).toBeGreaterThan(0);
  });
});

describe('pointsToPath', () => {
  it('should return empty string for empty array', () => {
    expect(pointsToPath([])).toBe('');
  });

  it('should start with M for first point', () => {
    const path = pointsToPath([{ x: 10, y: 20 }]);
    expect(path).toMatch(/^M/);
  });

  it('should use L for subsequent points', () => {
    const path = pointsToPath([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]);
    expect(path).toContain('L');
  });

  it('should format coordinates correctly', () => {
    const path = pointsToPath([
      { x: 10.123, y: 20.456 },
    ]);
    expect(path).toBe('M 10.12,20.46');
  });
});
