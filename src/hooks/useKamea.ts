import { useMemo, useState, useCallback, useEffect } from 'react';
import type { KameaConfig, KameaLayer, ShapeType, KameaHistoryItem } from '@/lib/kamea/types';
import {
  hashString,
  createSeededRandom,
  generateRoseCurve,
  generateStarPolygon,
  generateMandala,
  generateEyePattern,
  generateComplexPath,
} from '@/lib/kamea/algorithms';

const GENERATORS = {
  rose: generateRoseCurve,
  star: generateStarPolygon,
  mandala: generateMandala,
  eye: generateEyePattern,
  complex: generateComplexPath,
} as const;

const SHAPE_TYPES: ShapeType[] = ['rose', 'star', 'mandala', 'eye', 'complex'];
const STORAGE_KEY = 'kamea-history';
const MAX_HISTORY = 20;

export function useKameaGenerator(input: string, size = 300): KameaConfig | null {
  return useMemo(() => {
    if (!input.trim()) return null;

    const hash = hashString(input);
    const random = createSeededRandom(hash);
    const baseHue = hash % 360;
    const cx = size / 2;
    const cy = size / 2;
    const baseAmplitude = size * 0.35;

    const layerCount = 3 + Math.floor(random() * 3); // 3-5 layers
    const layers: KameaLayer[] = [];

    for (let i = 0; i < layerCount; i++) {
      const shapeType = SHAPE_TYPES[Math.floor(random() * SHAPE_TYPES.length)];
      const generator = GENERATORS[shapeType];

      const params = {
        centerX: cx,
        centerY: cy,
        amplitude: baseAmplitude * (0.6 + random() * 0.4),
        k1: 2 + Math.floor(random() * 6),
        k2: 2 + Math.floor(random() * 7),
        loops: 6 + Math.floor(random() * 8),
        points: 5 + Math.floor(random() * 8),
      };

      const path = generator(params);

      layers.push({
        id: `layer-${i}-${hash}`,
        path,
        shapeType,
        params,
        hue: (baseHue + i * 35) % 360,
        strokeWidth: 1.5 - i * 0.25,
        rotationSpeed: 15 + i * 5,
      });
    }

    return { input, hash, baseHue, layers, size };
  }, [input, size]);
}

export function useKameaHistory() {
  const [history, setHistory] = useState<KameaHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch {
        // Ignore storage errors
      }
    }
  }, [history]);

  const addToHistory = useCallback((input: string) => {
    setHistory((prev) => {
      // Don't add duplicates
      if (prev.some(item => item.input === input)) {
        return prev;
      }

      const newItem: KameaHistoryItem = {
        id: crypto.randomUUID(),
        input,
        timestamp: Date.now(),
      };

      return [newItem, ...prev].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
}
