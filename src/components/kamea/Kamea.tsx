import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKameaGenerator, useKameaHistory } from '@/hooks/useKamea';
import { KameaCanvas } from './KameaCanvas';

export function Kamea() {
  const [input, setInput] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const config = useKameaGenerator(currentInput, 320);
  const { history, addToHistory, clearHistory } = useKameaHistory();

  const handleGenerate = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) {
      setCurrentInput(trimmed);
      addToHistory(trimmed);
    }
  }, [input, addToHistory]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `kamea-${currentInput.replace(/\s+/g, '-')}-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [currentInput]);

  const handleHistorySelect = useCallback((historyInput: string) => {
    setInput(historyInput);
    setCurrentInput(historyInput);
    setShowHistory(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-light tracking-wide mb-2">
          קמע
        </h1>
        <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
          Personal Amulet Generator
        </p>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm mb-8"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text to generate..."
            className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]
                       bg-[var(--input-bg)] dark:bg-[var(--input-bg-dark)] text-sm focus:outline-none focus:ring-2
                       focus:ring-[var(--accent)] transition-all"
            dir="auto"
          />
          <button
            onClick={handleGenerate}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white text-sm font-medium
                       hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all"
          >
            Generate
          </button>
        </div>

        {/* History toggle */}
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="mt-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] hover:text-[var(--accent)] transition-colors"
          >
            {showHistory ? 'Hide' : 'Show'} history ({history.length})
          </button>
        )}
      </motion.div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-sm mb-6 overflow-hidden"
          >
            <div className="bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">Recent</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistorySelect(item.input)}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                               border border-[var(--border)] dark:border-[var(--border-dark)]
                               hover:border-[var(--accent)] transition-colors"
                    dir="auto"
                  >
                    {item.input}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <AnimatePresence mode="wait">
        {config && (
          <motion.div
            key={config.hash}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative"
            ref={svgRef}
          >
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <KameaCanvas config={config} animate={true} />
            </div>

            {/* Download button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={handleDownload}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2
                         text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] hover:text-[var(--accent)]
                         transition-colors"
            >
              Download SVG
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!config && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-80 h-80 rounded-2xl bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]
                     flex items-center justify-center border border-[var(--border)] dark:border-[var(--border-dark)]"
        >
          <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            Enter text above to generate your amulet
          </p>
        </motion.div>
      )}
    </div>
  );
}
