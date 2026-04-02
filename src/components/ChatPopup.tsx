import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import profileImg from "@/assets/chat-profile.jpg";
import romanticImg from "@/assets/chutki.jpeg";
import olgMsgImg from "@/assets/oldMsges.png";

interface ChatMessage { 
  type: "text" | "image" | "typing";
  content: string;
  delay: number; // ms after popup opens
}

const CONTACT_NAME = "Hamster 🐹";

// const messages: ChatMessage[] = [
//   { type: "text", content: "Hey… ❤️", delay: 0 },
//   { type: "text", content: "Don't be sad", delay: 2500 },
//   { type: "text", content: "I know you're listening to this song…", delay: 5500 },
//   { type: "image", content: romanticImg, delay: 9000 },
//   { type: "text", content: "This reminded me of you", delay: 12000 },
//   { type: "text", content: "You matter to me a lot ❤️", delay: 15000 },
//   { type: "text", content: "Never forget that… 🌙", delay: 18500 },
//   { type: "text", content: "I Love Always 💕", delay: 19000 },
// ];
const messages: ChatMessage[] = [
  { type: "text", content: "Hey… ❤️", delay: 0 },
  { type: "text", content: "Don't be sad", delay: 2500 },
  { type: "text", content: "I know you're listening to this song…", delay: 5500 },

  { type: "text", content: "I just want to tell you… I am always with you.",delay: 8000 },
  { type: "text", content: "And I love you. ❤️", delay: 10500 },
  { type: "text", content: "More than I know how to say.", delay: 12500 },

  { type: "text", content:  "When I see someone hurt you, it breaks me,", delay: 15000 },
  { type: "text", content: "I feel hurt too, seeing you like that.", delay: 17000 },
  { type: "text", content: "Because seeing you sad hurts my heart.", delay: 19000 },

  { type: "text", content: "You mean so much to me.", delay: 22000 },
  { type: "text", content: "Rinachaan.", delay: 24000 },
  { type: "text", content: "My love is not loud.", delay: 26000 },

  { type: "text", content: "But it is true.", delay: 29000 },
  { type: "image", content: olgMsgImg, delay: 31000 },
  { type: "text", content: "I feel it every day,", delay: 33000 },
  { type: "text", content: "for you. 🤍", delay: 35000 },

  { type: "image", content: romanticImg, delay: 38000 },
  { type: "text", content: "This reminded me of you", delay: 41000 },
  { type: "text", content: "You matter to me a lot ❤️", delay: 44000 },
  { type: "text", content: "Never forget that… 🌙", delay: 47000 },
  { type: "text", content: "I Love you.. Always 💕", delay: 50000 },
];
interface ChatPopupProps {
  onClickMePressed?: () => void;
}

const ChatPopup = ({ onClickMePressed }: ChatPopupProps) => {
  const [open, setOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timers: NodeJS.Timeout[] = [];

    messages.forEach((msg, i) => {
      // Show typing indicator before each message
      timers.push(
        setTimeout(() => setTyping(true), msg.delay)
      );
      timers.push(
        setTimeout(() => {
          setTyping(false);
          setVisibleCount(i + 1);
        }, msg.delay + 1200)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, typing]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="fixed inset-0 z-[90] w-screen h-screen"
    >
      <div className="bg-black/90 flex flex-col h-screen w-screen overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/20 flex-shrink-0">
          <img
            src={profileImg}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
            width={40}
            height={40}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{CONTACT_NAME}</p>
            <p className="text-xs text-muted-foreground">online</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/40 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        >
          {messages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex justify-start"
            >
              {msg.type === "text" ? (
                <div className="bg-muted/50 rounded-2xl rounded-bl-md px-3 py-2 md:px-4 md:py-2.5 max-w-[85%] md:max-w-[85%]">
                  <p className="text-xs md:text-sm text-foreground/90">{msg.content}</p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-2xl rounded-bl-md overflow-hidden max-w-[80%]"
                >
                  <img
                    src={msg.content}
                    alt="Shared moment"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    width={256}
                    height={200}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex justify-start"
              >
                <div className="bg-muted/50 rounded-2xl rounded-bl-md px-3 md:px-4 py-2 md:py-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-muted-foreground/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: d * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click Me button - shown after last message */}
          {visibleCount === messages.length && !typing && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex justify-start mt-4"
            >
              <button
                onClick={() => {
                  setOpen(false);
                  onClickMePressed?.();
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 md:py-2.5 rounded-full font-medium text-sm transition-colors"
              >
                Click Me
              </button>
            </motion.div>
          )}
        </div>

        {/* Input Bar - Fake Chat UI */}
        <div className="border-t border-border/20 px-4 py-3 bg-black/40 backdrop-blur flex-shrink-0">
          <div className="flex items-end gap-3">
            <input
              type="text"
              placeholder="Say something..."
              disabled
              className="flex-1 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 px-4 py-2.5 rounded-full text-sm outline-none disabled:opacity-70"
            />
            <button
              onClick={() => {
                if (visibleCount === messages.length) {
                  setOpen(false);
                  onClickMePressed?.();
                }
              }}
              disabled={visibleCount !== messages.length}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,18.1272231 C0.8376543,18.9127101 0.99,19.5986274 1.77946707,20 C2.40narratives,20.1570974 3.50612381,19.8429026 4.13399899,19.3286908 L17.1272231,14.0151496 C17.6424269,13.8580521 18,13.5741566 18,13.0599447 C18,12.5457328 17.6424269,12.2618374 17.1272231,12.1047399 L4.13399899,6.68127101 C3.34915502,6.16709705 2.40,6.01630527 1.77946707,6.01630527 C0.994623095,6.01630527 0.837654306,6.5305171 1.15159189,7.3160041 L3.03521743,11.5741566 C3.03521743,11.7312541 3.19218622,11.8883515 3.50612381,11.8883515 L16.6915026,12.6738385 C16.6915026,12.6738385 17.1272231,12.6738385 17.1272231,12.0880772 C17.1272231,12.0880772 17.1272231,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPopup;
