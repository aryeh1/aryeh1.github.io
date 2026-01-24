import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKameaGenerator, useKameaHistory } from './useKamea';

describe('useKameaGenerator', () => {
  it('should return null for empty input', () => {
    const { result } = renderHook(() => useKameaGenerator(''));
    expect(result.current).toBeNull();
  });

  it('should return null for whitespace-only input', () => {
    const { result } = renderHook(() => useKameaGenerator('   '));
    expect(result.current).toBeNull();
  });

  it('should generate config for valid input', () => {
    const { result } = renderHook(() => useKameaGenerator('test'));
    expect(result.current).not.toBeNull();
    expect(result.current!.input).toBe('test');
  });

  it('should generate deterministic output for same input', () => {
    const { result: result1 } = renderHook(() => useKameaGenerator('hello'));
    const { result: result2 } = renderHook(() => useKameaGenerator('hello'));

    expect(result1.current!.hash).toBe(result2.current!.hash);
    expect(result1.current!.baseHue).toBe(result2.current!.baseHue);
    expect(result1.current!.layers.length).toBe(result2.current!.layers.length);
  });

  it('should generate different output for different input', () => {
    const { result: result1 } = renderHook(() => useKameaGenerator('hello'));
    const { result: result2 } = renderHook(() => useKameaGenerator('world'));

    expect(result1.current!.hash).not.toBe(result2.current!.hash);
  });

  it('should generate 3-5 layers', () => {
    const { result } = renderHook(() => useKameaGenerator('test'));
    expect(result.current!.layers.length).toBeGreaterThanOrEqual(3);
    expect(result.current!.layers.length).toBeLessThanOrEqual(5);
  });

  it('should respect custom size parameter', () => {
    const { result } = renderHook(() => useKameaGenerator('test', 500));
    expect(result.current!.size).toBe(500);
  });

  it('should use default size of 300', () => {
    const { result } = renderHook(() => useKameaGenerator('test'));
    expect(result.current!.size).toBe(300);
  });

  it('should generate valid layer properties', () => {
    const { result } = renderHook(() => useKameaGenerator('test'));
    const layer = result.current!.layers[0];

    expect(layer.id).toBeDefined();
    expect(layer.path).toBeDefined();
    expect(layer.path.length).toBeGreaterThan(0);
    expect(layer.shapeType).toBeDefined();
    expect(layer.hue).toBeGreaterThanOrEqual(0);
    expect(layer.hue).toBeLessThan(360);
    expect(layer.strokeWidth).toBeGreaterThan(0);
    expect(layer.rotationSpeed).toBeGreaterThan(0);
  });

  it('should generate valid path points', () => {
    const { result } = renderHook(() => useKameaGenerator('test'));
    const layer = result.current!.layers[0];

    layer.path.forEach(point => {
      expect(point.x).toBeDefined();
      expect(point.y).toBeDefined();
      expect(typeof point.x).toBe('number');
      expect(typeof point.y).toBe('number');
    });
  });
});

describe('useKameaHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock crypto.randomUUID
    vi.stubGlobal('crypto', {
      ...crypto,
      randomUUID: vi.fn().mockReturnValue('test-uuid-123'),
    });
  });

  it('should start with empty history', () => {
    const { result } = renderHook(() => useKameaHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should add item to history', () => {
    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('test input');
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].input).toBe('test input');
  });

  it('should not add duplicate items', () => {
    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('test');
      result.current.addToHistory('test');
    });

    expect(result.current.history.length).toBe(1);
  });

  it('should add different items', () => {
    vi.stubGlobal('crypto', {
      ...crypto,
      randomUUID: vi.fn()
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2'),
    });

    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('first');
      result.current.addToHistory('second');
    });

    expect(result.current.history.length).toBe(2);
  });

  it('should persist history to localStorage', () => {
    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('test');
    });

    const stored = localStorage.getItem('kamea-history');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed[0].input).toBe('test');
  });

  it('should load history from localStorage', () => {
    const existingHistory = [
      { id: '1', input: 'existing', timestamp: Date.now() }
    ];
    localStorage.setItem('kamea-history', JSON.stringify(existingHistory));

    const { result } = renderHook(() => useKameaHistory());
    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].input).toBe('existing');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('test');
    });

    expect(result.current.history.length).toBe(1);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history.length).toBe(0);
    expect(localStorage.getItem('kamea-history')).toBeNull();
  });

  it('should limit history to 20 items', () => {
    vi.stubGlobal('crypto', {
      ...crypto,
      randomUUID: vi.fn().mockImplementation(() => `uuid-${Math.random()}`),
    });

    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      for (let i = 0; i < 25; i++) {
        result.current.addToHistory(`item-${i}`);
      }
    });

    expect(result.current.history.length).toBe(20);
    // Most recent should be first
    expect(result.current.history[0].input).toBe('item-24');
  });

  it('should add timestamp to history items', () => {
    const before = Date.now();

    const { result } = renderHook(() => useKameaHistory());

    act(() => {
      result.current.addToHistory('test');
    });

    const after = Date.now();

    expect(result.current.history[0].timestamp).toBeGreaterThanOrEqual(before);
    expect(result.current.history[0].timestamp).toBeLessThanOrEqual(after);
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('kamea-history', 'invalid-json');

    const { result } = renderHook(() => useKameaHistory());
    expect(result.current.history).toEqual([]);
  });
});
