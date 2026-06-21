"use client";

import React, { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek,
  isSameDay
} from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLunarDate, getHolidays } from "@/lib/lunar-utils";

export function MonthView({ onSelectDate }: { onSelectDate: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day) => {
          const lunar = getLunarDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);
          const holidays = getHolidays(day, lunar);

          return (
            <motion.button
              key={day.toISOString()}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDate(day);
                onSelectDate(day);
              }}
              className={`
                relative h-16 rounded-xl flex flex-col items-center justify-center transition-all
                ${isSelected ? "bg-primary text-white shadow-lg" : "hover:bg-accent"}
                ${!isCurrentMonth ? "opacity-30" : "opacity-100"}
              `}
            >
              <span className={`text-lg font-bold ${isSelected ? "text-white" : isDayToday ? "text-primary" : "text-foreground"}`}>
                {format(day, "d")}
              </span>
              <span className={`text-[10px] font-medium ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                {lunar.day === 1 ? `${lunar.day}/${lunar.month}` : lunar.day}
              </span>
              
              {/* Chỉ báo ngày lễ bằng dấu chấm xanh */}
              {holidays.length > 0 && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              )}
              
              {isDayToday && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
