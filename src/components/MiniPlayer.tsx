import { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import albumCover from "@/assets/album-cover.jpg";

interface Props {
  title: string;
  artist: string;
  isPlaying: boolean;
  onToggle: () => void;
  progress: number;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const MiniPlayer = ({ title, artist, isPlaying, onToggle, progress, currentTime, duration, onSeek }: Props) => {
  const barRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);

  const seekFromEvent = useCallback(
    (clientX: number) => {
      if (!barRef.current || duration <= 0) return;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setDragging(true);
      seekFromEvent(e.clientX);
    },
    [seekFromEvent]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => seekFromEvent(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, seekFromEvent]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-6 left-6 z-50 glass-card rounded-2xl p-3 pb-5 flex flex-col gap-2 min-w-[260px] md:min-w-[300px] group"
    >
      <div className="flex items-center gap-3">
        {/* Album cover */}
        <motion.div
          className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <img
            src={albumCover}
            alt="Album cover"
            className="w-full h-full object-cover"
            width={44}
            height={44}
          />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
        </div>

        {/* Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/15 hover:bg-primary/25 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary ml-0.5" />
          )}
        </button>
      </div>

      {/* Seek bar */}
      <div className="flex items-center gap-2 px-0.5">
        <span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">
          {formatTime(currentTime)}
        </span>
        <div
          ref={barRef}
          className="relative flex-1 h-4 flex items-center cursor-pointer group/seek select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="w-full h-[3px] rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              className="h-full bg-primary/70 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          {/* Thumb */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-sm transition-opacity ${dragging ? "opacity-100" : "opacity-0 group-hover/seek:opacity-100"}`}
            style={{ left: `calc(${progress}% - 5px)` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums w-7">
          {formatTime(duration)}
        </span>
      </div>
    </motion.div>
  );
};

export default MiniPlayer;
