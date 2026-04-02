import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface Props {
  children: ReactNode;
}

const FloatingNote = ({ children }: Props) => {
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!noteRef.current) return;

    gsap.to(noteRef.current, {
      y: "+=8",
      rotation: "+=0.3",
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(noteRef.current, {
      x: "+=5",
      duration: 5.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.5,
    });
  }, []);

  return (
    <motion.div
      ref={noteRef}
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="bg-note rounded-2xl shadow-note p-6 md:p-10 relative overflow-hidden border border-border/30"
      style={{ transform: "rotate(-1.5deg)" }}
    >
      {/* Subtle tape effect at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-primary/10 rounded-b-md" />
      {children}
    </motion.div>
  );
};

export default FloatingNote;
