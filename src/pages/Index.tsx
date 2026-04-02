import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import LyricsDisplay from "@/components/LyricsDisplay";
import MiniPlayer from "@/components/MiniPlayer";
import FloatingNote from "@/components/FloatingNote";
import ChatNotification from "@/components/ChatNotification";
import ChatPopup from "@/components/ChatPopup";
import DomeGallery from "@/components/DomeGallery";
import BlurText from "@/components/BlurText";
import { lyrics, songInfo } from "@/data/lyrics";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDomeGallery, setShowDomeGallery] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio("/audio/Khamosh_Ishq.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime),
    );
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // // Show DomeGallery at 1:54 (114 seconds)
  // useEffect(() => {
  //   if (currentTime >= 114 && !showDomeGallery) {
  //     setShowDomeGallery(true);
  //   }
  // }, [currentTime, showDomeGallery]);

  // Show ChatNotification twice - at 80s and 160s (80s apart)
  useEffect(() => {
    if (currentTime >= 80 && currentTime < 81 && notificationCount === 0) {
      setNotificationCount(1);
    } else if (
      currentTime >= 160 &&
      currentTime < 161 &&
      notificationCount === 1
    ) {
      setNotificationCount(2);
    }
  }, [currentTime, notificationCount]);

  // Parallax background
  useEffect(() => {
    if (!bgRef.current) return;
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      gsap.to(bgRef.current, { x, y, duration: 1.2, ease: "power2.out" });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background texture + parallax */}
      <div
        ref={bgRef}
        className="absolute inset-[-20px] bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('/placeholder.svg')`,
          filter: "blur(40px) saturate(0.6)",
        }}
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-vignette pointer-events-none z-[1]" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow spots */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(circle, hsl(15 60% 65%), transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(circle, hsl(340 30% 45%), transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {/* Title */}
          <motion.h1
            className="font-display text-center text-3xl md:text-5xl font-light text-foreground/80 mb-2 tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {songInfo.title}
          </motion.h1>
          <motion.p
            className="text-center text-muted-foreground text-sm mb-8 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {songInfo.artist}
          </motion.p>

          {/* Floating sticky note with lyrics */}
          <FloatingNote>
            <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
          </FloatingNote>

          {/* Click to play prompt */}
          {!isPlaying && currentTime === 0 && (
            <motion.button
              onClick={togglePlay}
              className="mx-auto mt-8 block font-display text-lg text-primary/60 hover:text-primary transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              tap to begin ♪
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Mini Player */}
      <MiniPlayer
        title={songInfo.title}
        artist={songInfo.artist}
        isPlaying={isPlaying}
        onToggle={togglePlay}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* ChatNotification appears twice - at 80s and 160s - when clicked, shows ChatPopup */}
      {notificationCount > 0 && !showChat && (
        <ChatNotification
          onDismiss={() => {
            setShowChat(true);
          }}
        />
      )}
      {showChat && (
        <ChatPopup
          onClickMePressed={() => {
            setShowChat(false);
            setShowDomeGallery(true);
            setNotificationCount(0);
          }}
        />
      )}

      {/* Dome Gallery fullscreen */}
      {showDomeGallery && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-50 bg-black overflow-hidden flex flex-col items-center justify-center">
          <div className="w-full h-full">
            <DomeGallery
              fit={0.9}
              minRadius={800}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </div>

          {/* Centered BlurText */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" >
            <BlurText
              text="I Love You Rinachaan"
              delay={250}
              animateBy="letters"
              direction="bottom"
              className="text-4xl md:text-6xl text-center text-red-700 font-belanosima"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
