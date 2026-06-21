"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Star,
  Clock,
  Compass,
  Gift,
  ChevronLeft,
  ChevronRight,
  Wind
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  getLunarDate, 
  getCanChiYear, 
  getCanChiMonth, 
  getCanChiDay, 
  getSolarTerm,
  getZodiacHours,
  getHolidays,
  getDayStatus
} from "@/lib/lunar-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardProps {
  viewingDate: Date;
  setViewingDate: React.Dispatch<React.SetStateAction<Date>>;
  onDateClick: (date: Date) => void;
}

export function Dashboard({ viewingDate, setViewingDate, onDateClick }: DashboardProps) {
  const lunar = getLunarDate(viewingDate);
  const canChiYear = getCanChiYear(lunar.year);
  const canChiMonth = getCanChiMonth(lunar.month, lunar.year);
  const canChiDay = getCanChiDay(lunar.jd);
  const term = getSolarTerm(viewingDate);
  const zodiacHours = getZodiacHours(lunar.jd);
  const holidays = getHolidays(viewingDate, lunar);
  const dayStatus = getDayStatus(lunar.month, lunar.jd);

  const handlePrevDay = () => setViewingDate(prev => subDays(prev, 1));
  const handleNextDay = () => setViewingDate(prev => addDays(prev, 1));

  return (
    <div className="relative min-h-[90vh] flex flex-col pt-16 pb-24">
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] border-[2px] border-primary rounded-full"
        />
      </div>

      <div className="px-6 space-y-8 mt-4">
        <section className="space-y-4">
          <div className="flex justify-between items-start">
            <motion.div
              key={`header-${viewingDate.toISOString()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-primary font-black"
            >
              <CalendarIcon className="w-6 h-6" />
              <span className="capitalize text-2xl tracking-tight">
                {format(viewingDate, "EEEE, dd/MM/yyyy", { locale: vi })}
              </span>
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between">
            <div 
              className="flex flex-col cursor-pointer"
              onClick={() => onDateClick(viewingDate)}
            >
              <div className="flex items-center gap-4">
                <motion.h1 
                  key={`title-${viewingDate.toISOString()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black tracking-tight text-foreground flex items-center gap-3"
                >
                  Âm Lịch
                  <div className="flex gap-1 ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handlePrevDay(); }}
                      className="h-9 w-9 rounded-full bg-accent hover:bg-primary hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleNextDay(); }}
                      className="h-9 w-9 rounded-full bg-accent hover:bg-primary hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.h1>
              </div>
              
              <motion.div 
                key={`lunar-${viewingDate.toISOString()}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-baseline gap-2 mt-1"
              >
                <span className="text-7xl font-black text-primary">{lunar.day}</span>
                <span className="text-3xl font-bold text-muted-foreground">Tháng {lunar.month}</span>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {holidays.map((h, idx) => (
              <motion.div
                key={`${idx}-${viewingDate.toISOString()}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3 text-primary"
              >
                <Gift className="w-5 h-5" />
                <span className="font-bold">{h}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Năm", value: canChiYear, icon: Star },
            { label: "Tháng", value: canChiMonth, icon: Clock },
            { label: "Ngày", value: canChiDay, icon: MapPin },
          ].map((item, idx) => (
            <motion.div
              key={`${item.label}-${viewingDate.toISOString()}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="glass shadow-ios border-none">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{item.label}</p>
                    <p className="font-bold text-base">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="space-y-4">
          <motion.div
            key={`status-${viewingDate.toISOString()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <h2 className="text-lg font-bold">Thông tin ngày</h2>
            <Badge 
              variant="secondary" 
              className={cn(
                "px-3 py-1 font-bold",
                dayStatus.isGood ? "bg-green-500 text-white" : "bg-zinc-500 text-white"
              )}
            >
              {dayStatus.status}
            </Badge>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-ios bg-accent/30 overflow-hidden relative">
              <CardContent className="p-5">
                <Wind className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-bold">Tiết Khí</h3>
                <p className="text-sm text-muted-foreground">{term}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-ios bg-primary/5 overflow-hidden relative">
              <CardContent className="p-5">
                <Compass className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-bold">Hướng Xuất Hành</h3>
                <p className="text-sm text-muted-foreground">Tây Nam</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">Giờ Hoàng Đạo</h2>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {zodiacHours.map((hour, idx) => (
                <motion.div
                  key={`${hour}-${viewingDate.toISOString()}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Badge variant="outline" className="border-primary/20 bg-white/50 dark:bg-zinc-800/50 backdrop-blur px-4 py-1.5 font-bold">
                    {hour}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
