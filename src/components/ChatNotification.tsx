 import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profileImg from "@/assets/chat-profile.jpg";

const CONTACT_NAME = "Hamster 🐹";

const ChatNotification = ({ onDismiss }: { onDismiss: () => void }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 500);
    }, 3500);
    return () => clearTimeout(hideTimer);
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed top-2 md:top-4 left-0 right-0 z-[100] flex justify-center px-2 md:px-0"
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
        >
          <div className="glass-card rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-3 cursor-pointer w-full md:w-[340px] max-w-[90vw]">
            <img
              src={profileImg}
              alt="Profile"
              className="w-9 md:w-10 h-9 md:h-10 rounded-full object-cover flex-shrink-0"
              width={40}
              height={40}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
                Messages
              </p>
              <p className="text-xs md:text-sm font-medium text-foreground truncate">
                {CONTACT_NAME}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                Rinachaan??❤️
              </p>
            </div>
            <span className="text-[8px] md:text-[10px] text-muted-foreground/60 self-start mt-1 flex-shrink-0">
              now
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatNotification;
