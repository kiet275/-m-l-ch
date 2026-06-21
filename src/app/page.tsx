"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Settings, 
  Plus,
  Moon,
  Sun,
  CloudRain,
  Cloud,
  MapPin
} from "lucide-react";
import { DynamicIsland } from "@/components/calendar/DynamicIsland";
import { Dashboard } from "@/components/calendar/Dashboard";
import { MonthView } from "@/components/calendar/MonthView";
import { AIAdvisor } from "@/components/calendar/AIAdvisor";
import { AddEventDialog } from "@/components/calendar/AddEventDialog";
import { DayDetail } from "@/components/calendar/DayDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLunarDate, getDayStatus, getAuspiciousActivities } from "@/lib/lunar-utils";
import { Label } from "@/components/ui/label";

type View = "home" | "calendar" | "ai" | "settings";

export default function AnLacCalendar() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [viewingDate, setViewingDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Weather states
  const [userLocation, setUserLocation] = useState("Hà Nội");
  const [isWeatherMode, setIsWeatherMode] = useState(false);
  const [weatherText, setWeatherText] = useState("");
  const [weatherIcon, setWeatherIcon] = useState<React.ReactNode>(null);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const savedLocation = localStorage.getItem("user-location");
    
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  const islandContent = useMemo(() => {
    if (isWeatherMode) return weatherText;
    const lunar = getLunarDate(viewingDate);
    const dayStatus = getDayStatus(lunar.month, lunar.jd);
    const activities = getAuspiciousActivities(dayStatus.isGood);
    return `${dayStatus.status}: ${activities}`;
  }, [viewingDate, isWeatherMode, weatherText]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSaveLocation = (loc: string) => {
    setUserLocation(loc);
    localStorage.setItem("user-location", loc);
  };

  const handleShowWeather = async () => {
    const apiKey = "e6fadcd1a02c170e3df03da811b5bd46";
    setIsIslandExpanded(true);
    setWeatherText(`Đang lấy thời tiết tại ${userLocation}...`);
    setIsWeatherMode(true);
    
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${apiKey}&units=metric&lang=vi`);
      const data = await response.json();
      
      if (data.cod === 200) {
        const cond = data.weather[0].description;
        const temp = Math.round(data.main.temp);
        const main = data.weather[0].main;
        
        setWeatherText(`Thời tiết tại ${data.name}: ${cond}, ${temp}°C.`);
        
        let icon = <Sun className="w-6 h-6 text-yellow-400" />;
        if (['Rain', 'Drizzle', 'Thunderstorm'].includes(main)) {
          icon = <CloudRain className="w-6 h-6 text-blue-400" />;
        } else if (main === 'Clouds') {
          icon = <Cloud className="w-6 h-6 text-zinc-400" />;
        }
        setWeatherIcon(icon);
      } else {
        setWeatherText(`Không tìm thấy "${userLocation}".`);
        setWeatherIcon(<CloudRain className="w-6 h-6 text-muted-foreground" />);
      }
    } catch (error) {
      setWeatherText("Lỗi kết nối thời tiết.");
    }

    setTimeout(() => {
      setIsWeatherMode(false);
      setIsIslandExpanded(false);
    }, 8000);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen max-w-lg mx-auto bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-xs space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded-full w-2/3 mx-auto" />
          <div className="h-40 bg-muted rounded-[32px] w-full" />
          <div className="h-20 bg-muted rounded-2xl w-full" />
          <div className="flex justify-center mt-8">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <Dashboard 
            viewingDate={viewingDate} 
            setViewingDate={setViewingDate} 
            onDateClick={(date) => setSelectedDate(date)} 
          />
        );
      case "calendar":
        return <MonthView onSelectDate={(date) => {
          setViewingDate(date);
          setSelectedDate(date);
        }} />;
      case "ai":
        return <AIAdvisor />;
      case "settings":
        return (
          <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Cài đặt</h1>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Vị trí của bạn</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input 
                    value={userLocation}
                    onChange={(e) => handleSaveLocation(e.target.value)}
                    placeholder="Nhập tỉnh/thành phố..."
                    className="h-14 pl-12 rounded-2xl glass border-none shadow-ios text-base focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tùy chỉnh nhanh</Label>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-14 rounded-2xl px-6 glass border-none shadow-ios"
                  onClick={handleShowWeather}
                >
                  <div className="flex items-center gap-4">
                    <CloudRain className="w-5 h-5 text-blue-500" />
                    <span className="font-bold">Xem Thời tiết</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </Button>

                <Button 
                  variant="outline" 
                  className={`w-full justify-between h-14 rounded-2xl gap-4 px-6 glass border-none shadow-ios ${isDarkMode ? "bg-primary/5" : ""}`}
                  onClick={toggleDarkMode}
                >
                  <div className="flex items-center gap-4">
                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-primary" />}
                    <span className="font-bold">{isDarkMode ? "Giao diện Sáng" : "Giao diện Tối"}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? "bg-primary" : "bg-muted"}`}>
                    <motion.div 
                      animate={{ x: isDarkMode ? 20 : 2 }}
                      className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard viewingDate={viewingDate} setViewingDate={setViewingDate} onDateClick={(date) => setSelectedDate(date)} />;
    }
  };

  return (
    <main className="min-h-screen max-w-lg mx-auto bg-background relative overflow-x-hidden">
      <DynamicIsland 
        content={islandContent} 
        icon={isWeatherMode ? weatherIcon : undefined}
        isExpanded={isIslandExpanded}
      />
      
      <div className="pb-32 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 right-6 z-40"
      >
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 transition-all border border-white/20"
          onClick={() => setIsAddEventOpen(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
        <div className="relative glass rounded-[40px] p-2 flex items-center justify-around overflow-hidden shadow-2xl">
          {[
            { id: "home", icon: Home, label: "Chính" },
            { id: "calendar", icon: CalendarIcon, label: "Lịch" },
            { id: "ai", icon: Sparkles, label: "Cố Vấn" },
            { id: "settings", icon: Settings, label: "Thêm" },
          ].map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsWeatherMode(false);
                }}
                className="relative flex flex-col items-center justify-center py-3 px-5 transition-all outline-none"
              >
                <item.icon className={`w-6 h-6 z-10 transition-all duration-500 ${isActive ? "text-primary scale-110" : "text-muted-foreground/70"}`} />
                
                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-[10px] font-black mt-1 uppercase tracking-wider text-primary z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="nav-pill-active"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-[32px] -z-0 border border-primary/20"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {selectedDate && (
          <DayDetail 
            date={selectedDate} 
            onClose={() => setSelectedDate(null)} 
          />
        )}
        {isAddEventOpen && (
          <AddEventDialog onClose={() => setIsAddEventOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
