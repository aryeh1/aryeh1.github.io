import { motion } from 'framer-motion';
import type { KameaConfig, KameaLayer } from '@/lib/kamea/types';
import { pointsToPath } from '@/lib/kamea/algorithms';

interface KameaCanvasProps {
  config: KameaConfig;
  animate?: boolean;
  className?: string;
}

interface LayerProps {
  layer: KameaLayer;
  index: number;
  animate: boolean;
}

function KameaLayerComponent({ layer, index, animate }: LayerProps) {
  const gradientId = `gradient-${layer.id}`;
  const pathD = pointsToPath(layer.path);

  // Stagger the animation based on layer index
  const delay = index * 0.3;

  return (
    <motion.g
      initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
      animate={animate ? {
        rotate: [0, 360],
        scale: [1, 1.03, 1],
        opacity: 1,
      } : { opacity: 1, scale: 1 }}
      transition={{
        rotate: {
          duration: layer.rotationSpeed,
          repeat: Infinity,
          ease: 'linear',
        },
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        opacity: {
          duration: 0.8,
          delay,
        },
      }}
      style={{ originX: '50%', originY: '50%' }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <stop
              key={j}
              offset={`${j * 20}%`}
              stopColor={`hsl(${(layer.hue + j * 40) % 360}, 85%, 60%)`}
            />
          ))}
        </linearGradient>
      </defs>

      <motion.path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={layer.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 - index * 0.1 }}
        transition={{
          pathLength: {
            duration: 2.5,
            ease: 'easeInOut',
            delay: delay + 0.2,
          },
          opacity: {
            duration: 1,
            delay,
          },
        }}
      />
    </motion.g>
  );
}

export function KameaCanvas({ config, animate = true, className = '' }: KameaCanvasProps) {
  const padding = 20;
  const viewBox = `${-padding} ${-padding} ${config.size + padding * 2} ${config.size + padding * 2}`;

  return (
    <motion.svg
      viewBox={viewBox}
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label={`Kamea pattern generated from: ${config.input}`}
      role="img"
    >
      {/* Background */}
      <rect
        x={-padding}
        y={-padding}
        width={config.size + padding * 2}
        height={config.size + padding * 2}
        fill="#0a0a0a"
        rx="8"
      />

      {/* Subtle glow effect */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layers with glow */}
      <g filter="url(#glow)">
        {config.layers.map((layer, index) => (
          <KameaLayerComponent
            key={layer.id}
            layer={layer}
            index={index}
            animate={animate}
          />
        ))}
      </g>

      {/* Input text overlay */}
      <motion.text
        x={config.size / 2}
        y={config.size - 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight="500"
        fill="rgba(255,255,255,0.6)"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {config.input}
      </motion.text>
    </motion.svg>
  );
}
