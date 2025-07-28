"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Timer, RotateCcw, Play, CheckCircle } from "lucide-react";

interface ControlsProps {
  fromQuestion: number;
  setFromQuestion: (val: number) => void;
  toQuestion: number;
  setToQuestion: (val: number) => void;
  timerInput: number;
  setTimerInput: (val: number) => void;
  answerKeyInput: string;
  setAnswerKeyInput: (val: string) => void;
  generateQuestions: () => void;
  processAnswerKey: () => void;
  resetAll: () => void;
  startTimer: () => void;
  isTimerRunning: boolean;
}

export function Controls({
  fromQuestion,
  setFromQuestion,
  toQuestion,
  setToQuestion,
  timerInput,
  setTimerInput,
  answerKeyInput,
  setAnswerKeyInput,
  generateQuestions,
  processAnswerKey,
  resetAll,
  startTimer,
  isTimerRunning,
}: ControlsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromQuestion">From Question</Label>
          <Input
            id="fromQuestion"
            type="number"
            value={fromQuestion}
            onChange={(e) => setFromQuestion(Number(e.target.value))}
            min="1"
            max="200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="toQuestion">To Question</Label>
          <Input
            id="toQuestion"
            type="number"
            value={toQuestion}
            onChange={(e) => setToQuestion(Number(e.target.value))}
            min="1"
            max="200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timerInput">Timer (minutes)</Label>
          <Input
            id="timerInput"
            type="number"
            value={timerInput}
            onChange={(e) => setTimerInput(Number(e.target.value))}
            min="1"
            max="200"
          />
        </div>
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Button
                onClick={generateQuestions}
                className="w-full mt-auto"
              >
                Generate Questions
              </Button>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="answerKeyInput">Correct Answers (e.g., ABCD or 1=A, 2=B)</Label>
          <Textarea
            id="answerKeyInput"
            value={answerKeyInput}
            onChange={(e) => setAnswerKeyInput(e.target.value)}
            placeholder="ABCD, 1234, or 1=A, 2=B, 3=C..."
            rows={2}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={processAnswerKey} variant="secondary">
          <CheckCircle /> Auto-Fill Answers
        </Button>
        <Button onClick={startTimer} disabled={isTimerRunning}>
          <Timer /> Start Timer
        </Button>
        <Button onClick={resetAll} variant="destructive">
          <RotateCcw /> Reset All
        </Button>
      </div>
    </div>
  );
}
