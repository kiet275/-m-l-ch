"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Bell, Tag, Check, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getLunarDate } from "@/lib/lunar-utils";

interface AddEventDialogProps {
  onClose: () => void;
}

export function AddEventDialog({ onClose }: AddEventDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState("");

  const lunarInfo = useMemo(() => {
    const selectedDate = new Date(date);
    const lunar = getLunarDate(selectedDate);
    return `${lunar.day}/${lunar.month} Âm lịch`;
  }, [date]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên sự kiện.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đã lưu",
      description: `Sự kiện "${title}" đã được thêm vào lịch (${lunarInfo}).`,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-background rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
              <PlusCircle className="w-5 h-5" />
              Sự Kiện Âm Lịch
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tên sự kiện</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="title"
                  placeholder="Ví dụ: Giỗ chạp, Lễ chùa..." 
                  className="pl-10 h-12 rounded-2xl glass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ngày diễn ra (Dương lịch)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="date"
                  type="date"
                  className="pl-10 h-12 rounded-2xl glass"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 px-1 text-primary text-xs font-bold">
                <Moon className="w-3 h-3" /> Tương đương: {lunarInfo}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ghi chú sự kiện</Label>
              <Textarea 
                id="desc"
                placeholder="Những lưu ý về sắm lễ hoặc giờ tốt..." 
                className="rounded-2xl glass min-h-[100px] resize-none"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-2xl border border-primary/10">
              <Bell className="w-4 h-4 text-primary" />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Hệ thống sẽ đối soát lịch âm để nhắc bạn trước khi đến ngày lễ/rằm.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              onClick={handleSave}
            >
              <Check className="w-5 h-5 mr-2" /> Lưu Nhắc Hẹn
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlusCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
    </svg>
  );
}
