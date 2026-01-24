import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'decision-maker-options';

const defaultOptions = ['Option 1', 'Option 2', 'Option 3'];

// Warm color palette matching site theme
const colors = [
  '#C4A77D', // accent gold
  '#A8895F', // darker gold
  '#8A847C', // muted brown
  '#5C5650', // warm brown
  '#DDD9D2', // warm border
  '#B5A48B', // mid gold
];

export function DecisionMaker() {
  const [options, setOptions] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultOptions;
  });
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Save options to localStorage
  const saveOptions = useCallback((opts: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
    setOptions(opts);
  }, []);

  // Add new option
  const addOption = useCallback(() => {
    if (newOption.trim() && options.length < 12) {
      saveOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  }, [newOption, options, saveOptions]);

  // Remove option
  const removeOption = useCallback((index: number) => {
    if (options.length > 2) {
      saveOptions(options.filter((_, i) => i !== index));
    }
  }, [options, saveOptions]);

  // Spin the wheel
  const spin = useCallback(() => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    // Random winner
    const winnerIndex = Math.floor(Math.random() * options.length);

    // Calculate rotation to land on winner
    const segmentAngle = 360 / options.length;
    const targetAngle = 360 - (winnerIndex * segmentAngle) - (segmentAngle / 2);
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation + (spins * 360) + targetAngle;

    setRotation(finalRotation);

    // Show result after spin
    setTimeout(() => {
      setResult(options[winnerIndex]);
      setIsSpinning(false);
    }, 4000);
  }, [isSpinning, options, rotation]);

  // Generate wheel segments
  const segments = options.map((option, i) => {
    const angle = 360 / options.length;
    const startAngle = i * angle;
    const endAngle = startAngle + angle;

    // Convert to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const radius = 120;
    const cx = 150;
    const cy = 150;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    // Text position (middle of segment)
    const midAngle = (startAngle + angle / 2 - 90) * (Math.PI / 180);
    const textRadius = radius * 0.65;
    const textX = cx + textRadius * Math.cos(midAngle);
    const textY = cy + textRadius * Math.sin(midAngle);
    const textRotation = startAngle + angle / 2;

    return {
      path,
      color: colors[i % colors.length],
      textX,
      textY,
      textRotation,
      option,
    };
  });

  return (
    <div className="w-full">
      {/* Wheel Container - Mobile First */}
      <div className="flex flex-col items-center mb-8">
        {/* Pointer */}
        <div className="relative mb-2">
          <div
            className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px]
                       border-l-transparent border-r-transparent border-t-[var(--accent)]"
          />
        </div>

        {/* Wheel */}
        <div className="relative touch-none">
          <motion.svg
            ref={wheelRef}
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className="max-w-[280px] sm:max-w-[300px]"
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {/* Wheel segments */}
            {segments.map((seg, i) => (
              <g key={i}>
                <path
                  d={seg.path}
                  fill={seg.color}
                  stroke="var(--bg-primary)"
                  strokeWidth="2"
                  className="dark:stroke-[var(--bg-dark)]"
                />
                <text
                  x={seg.textX}
                  y={seg.textY}
                  fill="white"
                  fontSize={options.length > 6 ? "10" : "12"}
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${seg.textRotation}, ${seg.textX}, ${seg.textY})`}
                  className="select-none pointer-events-none"
                >
                  {seg.option.length > 12 ? seg.option.slice(0, 10) + '...' : seg.option}
                </text>
              </g>
            ))}
            {/* Center circle */}
            <circle
              cx="150"
              cy="150"
              r="20"
              fill="var(--bg-card)"
              stroke="var(--accent)"
              strokeWidth="3"
              className="dark:fill-[var(--bg-dark-card)]"
            />
          </motion.svg>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning || options.length < 2}
          className="mt-6 px-8 py-3 text-sm font-medium
                     bg-[var(--accent)] text-white rounded-full
                     hover:bg-[var(--accent-hover)] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-95 transform"
        >
          {isSpinning ? 'Spinning...' : 'Spin!'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center mb-8 p-4 rounded-lg
                       bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                       border border-[var(--accent)]"
          >
            <p className="text-xs opacity-60 mb-1">The decision is:</p>
            <p className="text-lg font-medium text-[var(--accent)]">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options List */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium opacity-70">Options ({options.length}/12)</h3>

        {/* Add new option */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addOption()}
            placeholder="Add option..."
            maxLength={30}
            className="flex-1 px-3 py-2 text-sm rounded-lg
                       bg-[var(--input-bg)] dark:bg-[var(--input-bg-dark)]
                       border border-[var(--border)] dark:border-[var(--border-dark)]
                       focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={addOption}
            disabled={!newOption.trim() || options.length >= 12}
            className="px-4 py-2 text-sm rounded-lg
                       bg-[var(--accent)] text-white
                       hover:bg-[var(--accent-hover)] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        {/* Options grid - mobile friendly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((option, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-1 px-3 py-2 text-sm rounded-lg
                         bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]
                         border border-[var(--border)] dark:border-[var(--border-dark)]"
            >
              <span
                className="truncate flex-1"
                style={{ color: colors[i % colors.length] }}
              >
                {option}
              </span>
              <button
                onClick={() => removeOption(i)}
                disabled={options.length <= 2}
                className="opacity-40 hover:opacity-100 disabled:opacity-20
                           disabled:cursor-not-allowed text-xs ml-1"
                aria-label={`Remove ${option}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {options.length <= 2 && (
          <p className="text-xs opacity-50 text-center">
            Need at least 2 options
          </p>
        )}
      </div>
    </div>
  );
}
