"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { X, Compass, Users, Activity, ShieldCheck, AlertTriangle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getLunarDate, 
  getCanChiDay, 
  getHolidays 
} from "@/lib/lunar-utils";

export function DayDetail({ date, onClose }: { date: Date; onClose: () => void }) {
  const lunar = getLunarDate(date);
  const holidays = getHolidays(date, lunar);

  const containerVariants = {
    hidden: { y: "100%" },
    visible: { 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        damping: 25, 
        stiffness: 200 
      } 
    },
    exit: { y: "100%" }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 p-6 overflow-y-auto"
    >
      <div className="max-w-md mx-auto space-y-8 pb-12">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-accent">
            <X className="w-6 h-6" />
          </Button>
          <Badge className="bg-primary text-white">Chi tiết ngày</Badge>
        </div>

        <header className="space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {format(date, "EEEE", { locale: vi })}
          </p>
          <h1 className="text-4xl font-black">
            {format(date, "dd / MM / yyyy")}
          </h1>

          <div className="flex flex-col gap-2">
            {holidays.map((h, idx) => (
              <div key={idx} className="flex items-center justify-center gap-2 text-primary font-bold">
                <Gift className="w-5 h-5" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 py-2 border-y">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Âm Lịch</p>
              <p className="text-xl font-bold">{lunar.day}/{lunar.month}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Can Chi</p>
              <p className="text-xl font-bold">{getCanChiDay(lunar.jd)}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4">
          <div className="p-4 glass rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4" /> Sao Tốt
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Thiên Hỷ: Tốt mọi việc</li>
              <li>• Tam Hợp: Tốt cho cầu tài</li>
              <li>• Thiên Quý: Tốt cho khởi tạo</li>
            </ul>
          </div>
          <div className="p-4 glass rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase">
              <AlertTriangle className="w-4 h-4" /> Sao Xấu
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Thụ Tử: Kỵ khởi công</li>
              <li>• Nguyệt Yếm: Kỵ xuất hành</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Nhịp Sinh Học
          </h2>
          <div className="space-y-3">
            {[
              { label: "Trí Tuệ", val: 85, color: "bg-blue-500" },
              { label: "Thể Chất", val: 40, color: "bg-red-500" },
              { label: "Cảm Xúc", val: 65, color: "bg-pink-500" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" /> Hướng Xuất Hành
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Hỷ Thần</p>
              <p className="font-bold text-lg">Tây Bắc</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Tài Thần</p>
              <p className="font-bold text-lg">Đông Nam</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Tuổi Xung Khắc
          </h2>
          <div className="p-4 border border-dashed rounded-2xl">
            <p className="text-sm text-center font-medium">
              Nhâm Tý, Giáp Tý, Nhâm Ngọ
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
