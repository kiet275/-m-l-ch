
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiAuspiciousEventAdvisor, AIAuspiciousEventAdvisorOutput } from "@/ai/flows/ai-auspicious-event-advisor";
import { 
  getLunarDate, 
  getCanChiYear, 
  getCanChiMonth, 
  getCanChiDay, 
  getSolarTerm,
  getZodiacHours
} from "@/lib/lunar-utils";
import { format } from "date-fns";

interface Message {
  role: "user" | "ai";
  text: string;
  data?: AIAuspiciousEventAdvisorOutput;
}

export function AIAdvisor() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Xin chào! Tôi là trợ lý Tài Tài. Bạn muốn xem ngày tốt cho việc gì hôm nay?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const today = new Date();
      const lunar = getLunarDate(today);
      const result = await aiAuspiciousEventAdvisor({
        question: userMsg,
        currentDate: format(today, "yyyy-MM-dd"),
        lunarDate: `${lunar.day}/${lunar.month}/${lunar.year}`,
        canChiDay: getCanChiDay(lunar.jd),
        canChiMonth: getCanChiMonth(lunar.month, lunar.year),
        canChiYear: getCanChiYear(today.getFullYear()),
        fiveElements: "Lộ Bàng Thổ",
        tietKhi: getSolarTerm(today),
        trucNgay: "Trực Thành",
        goodDayStatus: "Ngày Hoàng Đạo",
        auspiciousHours: getZodiacHours(lunar.jd),
        inauspiciousHours: ["Ngọ", "Thân"],
      });

      const newMessage: Message = { role: "ai", text: result.answer, data: result };
      setMessages(prev => [...prev, newMessage]);

    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Xin lỗi, tôi gặp chút trục trặc khi phân tích tinh tú. Hãy thử lại sau nhé!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Cố Vấn Tài Tài</h2>
          <p className="text-xs text-muted-foreground">Sử dụng trí tuệ cổ truyền & AI</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${msg.role === "user" ? "bg-primary text-white" : "glass"} p-4 rounded-2xl shadow-sm relative group`}>
                <div className="flex items-start gap-3">
                  {msg.role === "ai" && <Bot className="w-5 h-5 mt-1 text-primary shrink-0" />}
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    
                    {msg.data && (
                      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 space-y-3">
                        <div className="flex items-center gap-2">
                          {msg.data.isAuspicious ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {msg.data.isAuspicious ? "Rất Đại Cát" : "Cần Cân Nhắc"}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {msg.data.reasons.map((reason, j) => (
                            <div key={j} className="flex gap-2 text-[11px] text-muted-foreground italic">
                              <span>•</span>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>

                        {msg.data.suggestions && msg.data.suggestions.length > 0 && (
                          <div className="bg-secondary/10 p-2 rounded-lg">
                            <p className="text-[10px] font-bold text-secondary-foreground mb-1">Gợi ý khác:</p>
                            <ul className="text-[11px] text-secondary-foreground space-y-0.5">
                              {msg.data.suggestions.map((s, j) => (
                                <li key={j}>- {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass p-4 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative pt-2">
        <Input
          placeholder="Hỏi về ngày cưới, khai trương..."
          className="pr-12 h-12 rounded-2xl glass border-none shadow-ios focus-visible:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          size="icon"
          className="absolute right-1 top-3 h-10 w-10 rounded-xl"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
