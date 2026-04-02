import { useMemo } from "react";
import { motion } from "framer-motion";
import { LyricLine } from "@/data/lyrics";

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
}

const LINE_HEIGHT = 56;
const VISIBLE_RANGE = 4;
const CONTAINER_HEIGHT = 360;

const LyricsDisplay = ({ lyrics, currentTime }: Props) => {
  const activeIndex = useMemo(() => {
    let idx = 0;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        idx = i;
        break;
      }
    }
    return idx;
  }, [lyrics, currentTime]);

  const wordProgress = useMemo(() => {
    const active = lyrics[activeIndex];
    const next = lyrics[activeIndex + 1];
    if (!active || !next) return 1;
    const lineDuration = next.time - active.time;
    const elapsed = currentTime - active.time;
    return Math.min(Math.max(elapsed / lineDuration, 0), 1);
  }, [lyrics, activeIndex, currentTime]);

  const getLineStyle = (index: number) => {
    const diff = Math.abs(index - activeIndex);
    if (diff === 0) return { blur: 0, opacity: 1, scale: 1.12 };
    if (diff === 1) return { blur: 1.5, opacity: 0.6, scale: 0.97 };
    if (diff === 2) return { blur: 3, opacity: 0.4, scale: 0.93 };
    if (diff === 3) return { blur: 4.5, opacity: 0.25, scale: 0.88 };
    return { blur: 6, opacity: 0.15, scale: 0.85 };
  };

  // Offset so active line sits at vertical center of container
  const centerOffset = (CONTAINER_HEIGHT / 2) - (LINE_HEIGHT / 2) - (activeIndex * LINE_HEIGHT);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: `${CONTAINER_HEIGHT}px`,
        maskImage:
          "linear-gradient(to bottom, transparent 2%, black 18%, black 82%, transparent 98%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 2%, black 18%, black 82%, transparent 98%)",
      }}
    >
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ gap: `${LINE_HEIGHT * 0.12}px` }}
        animate={{ y: centerOffset }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {lyrics.map((line, i) => {
          const style = getLineStyle(i);
          const isEmpty = line.text.trim() === "";
          const absDiff = Math.abs(i - activeIndex);

          if (isEmpty) {
            return <div key={i} style={{ height: LINE_HEIGHT }} />;
          }

          if (absDiff > VISIBLE_RANGE) {
            return (
              <div key={i} style={{ height: LINE_HEIGHT }} className="flex items-center justify-center">
                <span className="opacity-0 text-lg select-none">{line.text}</span>
              </div>
            );
          }

          const isActive = i === activeIndex;

          return (
            <motion.div
              key={i}
              style={{ height: LINE_HEIGHT }}
              animate={{
                opacity: style.opacity,
                scale: style.scale,
                filter: `blur(${style.blur}px)`,
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`flex items-center justify-center text-center leading-relaxed max-w-[560px] px-2 font-display ${
                isActive
                  ? "text-xl md:text-3xl font-medium text-foreground"
                  : "text-base md:text-xl font-light text-foreground/80"
              }`}
            >
              {isActive ? (
                <ActiveLine text={line.text} progress={wordProgress} />
              ) : (
                <span>{line.text}</span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

/** Word-by-word highlight for the active line */
const ActiveLine = ({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) => {
  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <span
      style={{
        textShadow:
          "0 0 30px hsl(30 25% 92% / 0.2), 0 0 60px hsl(30 25% 92% / 0.08)",
      }}
    >
      {words.map((word, wi) => {
        const wordThreshold = (wi + 1) / totalWords;
        const isHighlighted = progress >= wordThreshold - 0.5 / totalWords;

        return (
          <motion.span
            key={wi}
            animate={{
              color: isHighlighted
                ? "hsl(30 25% 95%)"
                : "hsl(30 15% 60%)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
};

export default LyricsDisplay;
