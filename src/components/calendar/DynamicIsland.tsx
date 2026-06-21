
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Sun, Info } from "lucide-react";

interface DynamicIslandProps {
  content?: string;
  icon?: React.ReactNode;
  isExpanded?: boolean;
}

export function DynamicIsland({ content = "Giờ Hoàng Đạo: Tý (23h-1h)", icon, isExpanded: propIsExpanded }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (propIsExpanded !== undefined) setIsExpanded(propIsExpanded);
  }, [propIsExpanded]);

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          pointer-events-auto cursor-pointer
          flex items-center justify-center
          text-white bg-black/95 dark:bg-zinc-900/95 
          backdrop-blur-md border border-white/20
          rounded-[30px] shadow-2xl overflow-hidden
          transition-all duration-300
          ${isExpanded ? "w-[320px] h-[110px] px-6" : "w-[180px] h-[36px] px-3"}
        `}
      >
        <div className="flex items-center gap-2 w-full">
          <motion.div layout className="shrink-0">
            {icon || <Sun className={`transition-all ${isExpanded ? "w-6 h-6" : "w-4 h-4"} text-secondary fill-secondary`} />}
          </motion.div>
          
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-1"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">Thông tin An Lạc</span>
                  <span className="text-sm font-bold leading-tight text-white drop-shadow-md">
                    {content}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate whitespace-nowrap text-[11px] font-black tracking-wide text-white text-center w-full"
                >
                  {content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {!isExpanded && (
            <div className="flex gap-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
