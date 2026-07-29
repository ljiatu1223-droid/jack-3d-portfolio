import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');

  return (
    <p ref={containerRef} className={`relative ${className}`} style={style}>
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + 1 / characters.length;
        return (
          <CharSpan key={i} char={char} scrollYProgress={scrollYProgress} start={start} end={end} />
        );
      })}
    </p>
  );
}

function CharSpan({
  char,
  scrollYProgress,
  start,
  end,
}: {
  char: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    [0.2, 1]
  );

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ visibility: 'hidden' }}>{char}</span>
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}