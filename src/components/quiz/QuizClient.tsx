"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Question, QuizResult, AnswerKey } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./Header";
import { Card } from "@/components/ui/card";
import { Controls } from "./Controls";
import { StatusPanel } from "./StatusPanel";
import { QuestionArea } from "./QuestionArea";
import { Results } from "./Results";
import { FloatingTimer } from "./FloatingTimer";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { getRecommendationsAction } from "@/app/actions";

const DEFAULT_FROM = 1;
const DEFAULT_TO = 5;
const DEFAULT_TIMER = 10;

export default function QuizClient() {
  const [theme, setTheme] = useState("light");
  const [fromQuestion, setFromQuestion] = useState(DEFAULT_FROM);
  const [toQuestion, setToQuestion] = useState(DEFAULT_TO);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerKey, setAnswerKey] = useState<AnswerKey>({});
  const [answerKeyInput, setAnswerKeyInput] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  // Timer state
  const [timerInput, setTimerInput] = useState(DEFAULT_TIMER);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMER * 60);
  const [totalTime, setTotalTime] = useState(DEFAULT_TIMER * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  
  const generateQuestions = useCallback(() => {
    if (fromQuestion > toQuestion) {
      toast({
        variant: "destructive",
        title: "Invalid Range",
        description: "'From' question must be less than or equal to 'To' question.",
      });
      return;
    }
    const newQuestions = Array.from(
      { length: toQuestion - fromQuestion + 1 },
      (_, i) => ({
        id: fromQuestion + i,
        userAnswer: null,
      })
    );
    setQuestions(newQuestions);
    setResults(null);
    setQuizStarted(true);
    toast({
      title: "Questions Generated",
      description: `Ready for questions ${fromQuestion} to ${toQuestion}.`,
    });
  }, [fromQuestion, toQuestion, toast]);
  
  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);


  const handleUserAnswerChange = (questionId: number, answer: string | null) => {
    if (results) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, userAnswer: answer } : q))
    );
  };
  
  const processAnswerKey = () => {
    const parsedKey: AnswerKey = {};
    const pairs = answerKeyInput.split(',').filter(p => p.trim() !== '');
    
    try {
      for (const pair of pairs) {
        const match = pair.trim().match(/(\d+)\s*=\s*([A-D])/i);
        if (match) {
          parsedKey[parseInt(match[1])] = match[2].toUpperCase();
        } else {
          throw new Error(`Invalid format for entry: "${pair}"`);
        }
      }
      setAnswerKey(parsedKey);
      toast({
        title: "Answer Key Processed",
        description: "Correct answers have been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invalid Answer Key Format",
        description: error.message || "Use format like '1=A, 2=B'.",
      });
    }
  };

  const calculateScore = async () => {
    setLoadingResults(true);
    let correctCount = 0;
    let incorrectCount = 0;
    const incorrectlyAnswered: QuizResult["incorrectlyAnswered"] = [];

    questions.forEach((q) => {
      const correctAnswer = answerKey[q.id];
      if (q.userAnswer) {
        if (correctAnswer && q.userAnswer === correctAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
          if (correctAnswer) {
            incorrectlyAnswered.push({
              q: q.id,
              userAnswer: q.userAnswer,
              correctAnswer: correctAnswer,
            });
          }
        }
      }
    });

    const totalAttempted = correctCount + incorrectCount;
    const totalPossibleScore = (toQuestion - fromQuestion + 1);
    
    const { recommendations, error } = await getRecommendationsAction(questions, answerKey);

    if (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: error,
      });
    }

    setResults({
      correctCount,
      incorrectCount,
      unansweredCount: questions.length - totalAttempted,
      score: correctCount,
      totalPossibleScore: totalPossibleScore,
      accuracy: totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0,
      recommendations: recommendations || [],
      incorrectlyAnswered,
    });
    
    setIsTimerRunning(false);
    setLoadingResults(false);
    toast({
        title: "Quiz Finished!",
        description: "Your results are ready.",
    });
  };

  const resetAll = () => {
    setQuizStarted(false);
    setResults(null);
    setQuestions([]);
    setAnswerKey({});
    setAnswerKeyInput("");
    setFromQuestion(DEFAULT_FROM);
    setToQuestion(DEFAULT_TO);
    setTimerInput(DEFAULT_TIMER);
    setTimeLeft(DEFAULT_TIMER * 60);
    setTotalTime(DEFAULT_TIMER * 60);
    setIsTimerRunning(false);
    setIsPaused(false);
    generateQuestions();
    toast({
        title: "Quiz Reset",
        description: "You can start a new quiz now.",
    });
  };

  const startTimer = () => {
    if (timerInput < 1 || timerInput > 200) {
      toast({
        variant: "destructive",
        title: "Invalid Timer",
        description: "Please enter a value between 1 and 200 minutes.",
      });
      return;
    }
    const totalSeconds = timerInput * 60;
    setTimeLeft(totalSeconds);
    setTotalTime(totalSeconds);
    setIsTimerRunning(true);
    setIsPaused(false);
    setIsTimerMinimized(false);
  };

  useEffect(() => {
    if (!isTimerRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          toast({
            variant: "destructive",
            title: "Time's up!",
            description: "The quiz has ended. Check your results.",
          });
          calculateScore();
          return 0;
        }
        if (prev === 11) {
            toast({
                title: "Warning",
                description: "10 seconds remaining!",
                variant: 'destructive'
            });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused]);


  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-background to-secondary dark:from-background dark:to-gray-900/50 ${theme}`}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Header theme={theme} setTheme={handleSetTheme} />

        <FloatingTimer
          timeLeft={timeLeft}
          isPaused={isPaused}
          setPaused={setIsPaused}
          isMinimized={isTimerMinimized}
          setMinimized={setIsTimerMinimized}
          isRunning={isTimerRunning}
        />

        <Card className="p-4 md:p-6 mb-6 shadow-lg">
          <Controls
            fromQuestion={fromQuestion}
            setFromQuestion={setFromQuestion}
            toQuestion={toQuestion}
            setToQuestion={setToQuestion}
            timerInput={timerInput}
            setTimerInput={setTimerInput}
            answerKeyInput={answerKeyInput}
            setAnswerKeyInput={setAnswerKeyInput}
            generateQuestions={generateQuestions}
            processAnswerKey={processAnswerKey}
            resetAll={resetAll}
            startTimer={startTimer}
            isTimerRunning={isTimerRunning}
          />
        </Card>

        {quizStarted && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StatusPanel questions={questions} answerKey={answerKey} results={results} />
            </div>
            <div className="lg:col-span-2">
              {results ? (
                 <Results results={results} resetAll={resetAll} loading={loadingResults} />
              ) : (
                <QuestionArea
                  questions={questions}
                  answerKey={answerKey}
                  handleUserAnswerChange={handleUserAnswerChange}
                  calculateScore={calculateScore}
                  loadingResults={loadingResults}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
}
