"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingTimerProps {
  timeLeft: number;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  isMinimized: boolean;
  setMinimized: (minimized: boolean) => void;
  isRunning: boolean;
}

export function FloatingTimer({
  timeLeft,
  isPaused,
  setPaused,
  isMinimized,
  setMinimized,
  isRunning,
}: FloatingTimerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timerRef.current) {
        isDragging.current = true;
        offset.current = {
            x: e.clientX - timerRef.current.getBoundingClientRect().left,
            y: e.clientY - timerRef.current.getBoundingClientRect().top,
        };
        timerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && timerRef.current) {
        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y
        });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if(timerRef.current) {
        timerRef.current.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  

  if (!isRunning) return null;

  if (isMinimized) {
    return (
      <Button
        className="fixed top-20 right-5 h-16 w-16 rounded-full shadow-lg z-50 flex items-center justify-center text-lg font-bold"
        style={{
            transform: `translate(${position.x}px, ${position.y}px)`
        }}
        onClick={() => setMinimized(false)}
        ref={timerRef}
        onMouseDown={handleMouseDown}
      >
        {formatTime(timeLeft)}
      </Button>
    );
  }

  return (
    <Card
      ref={timerRef}
      className={cn("fixed top-20 right-5 w-64 shadow-2xl z-50 cursor-grab")}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseDown={handleMouseDown}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0 border-b">
        <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="font-semibold">Timer</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMinimized(true)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center gap-4">
        <div className="text-5xl font-bold font-mono text-primary">
          {formatTime(timeLeft)}
        </div>
        <Button onClick={() => setPaused(!isPaused)} variant="outline" className="w-full">
          {isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </CardContent>
    </Card>
  );
}
