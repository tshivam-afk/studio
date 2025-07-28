"use client";

import React from "react";
import type { Question, AnswerKey } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionAreaProps {
  questions: Question[];
  answerKey: AnswerKey;
  handleUserAnswerChange: (questionId: number, answer: string | null) => void;
  calculateScore: () => void;
  loadingResults: boolean;
}

export function QuestionArea({
  questions,
  answerKey,
  handleUserAnswerChange,
  calculateScore,
  loadingResults
}: QuestionAreaProps) {
  const options = ["A", "B", "C", "D"];

  const getOptionStyle = (questionId: number, option: string, isCorrectAnswer: boolean) => {
    const correctAnswer = answerKey[questionId];
    if (correctAnswer === option && isCorrectAnswer) {
      return 'border-primary bg-primary/20';
    }
    return 'border-transparent';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Mark Your Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="py-4 border-b last:border-b-0">
              <p className="font-semibold mb-3">
                Question {q.id}
              </p>
              <RadioGroup
                value={q.userAnswer ?? ""}
                onValueChange={(value) => handleUserAnswerChange(q.id, value)}
                className="flex flex-wrap gap-3"
              >
                {options.map((option) => (
                  <div key={option} className="flex items-center">
                    <RadioGroupItem value={option} id={`q-${q.id}-option-${option}`} className="peer sr-only"/>
                    <Label
                      htmlFor={`q-${q.id}-option-${option}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-muted hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 px-6 py-3 text-sm font-medium uppercase transition-colors cursor-pointer"
                      onClick={(e) => {
                          if (q.userAnswer === option) {
                              e.preventDefault();
                              handleUserAnswerChange(q.id, null);
                          }
                      }}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Mark Correct Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="py-4 border-b last:border-b-0">
              <p className="font-semibold mb-3">
                Correct Answer for Q{q.id}
              </p>
              <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                    <div key={option} className={cn("rounded-md border-2 p-1", getOptionStyle(q.id, option, true))}>
                        <div
                            className="flex items-center justify-center rounded-md bg-muted px-6 py-3 text-sm font-medium uppercase"
                        >
                            {option}
                        </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Button onClick={calculateScore} disabled={loadingResults} className="w-full text-lg py-6">
        {loadingResults && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        Calculate Final Score
      </Button>
    </div>
  );
}
