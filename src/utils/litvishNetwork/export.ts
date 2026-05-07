import { toPng, toSvg } from 'html-to-image';
import type { Person, RelationshipEdge } from '@/data/litvishNetwork';

/**
 * Triggers a browser download of an arbitrary blob/string.
 */
function download(filename: string, dataUrl: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function getViewport(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.react-flow__viewport');
}

const COMMON_OPTS = {
  cacheBust: true,
  pixelRatio: 2,
  style: { transform: 'none' } as Record<string, string>,
};

export async function exportPng(filename = 'litvish-network.png'): Promise<void> {
  const node = getViewport();
  if (!node) throw new Error('viewport not found');
  const dataUrl = await toPng(node, { ...COMMON_OPTS, backgroundColor: getBgColor() });
  download(filename, dataUrl);
}

export async function exportSvg(filename = 'litvish-network.svg'): Promise<void> {
  const node = getViewport();
  if (!node) throw new Error('viewport not found');
  const dataUrl = await toSvg(node, COMMON_OPTS);
  download(filename, dataUrl);
}

export function exportJson(
  people: Person[],
  edges: RelationshipEdge[],
  filename = 'litvish-network.json',
): void {
  const blob = new Blob(
    [JSON.stringify({ people, edges, exportedAt: new Date().toISOString() }, null, 2)],
    { type: 'application/json;charset=utf-8' },
  );
  const url = URL.createObjectURL(blob);
  download(filename, url);
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

function getBgColor(): string {
  const isDark = document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark');
  return isDark ? '#1A1A1A' : '#F7F5F0';
}
