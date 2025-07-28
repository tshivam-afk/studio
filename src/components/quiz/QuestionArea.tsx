"use client";

import React from "react";
import type { Question, AnswerKey } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface QuestionAreaProps {
  questions: Question[];
  answerKey: AnswerKey;
  handleUserAnswerChange: (questionId: number, answer: string | null) => void;
  handleCorrectAnswerChange: (questionId: number, answer: string) => void;
  calculateScore: () => void;
  loadingResults: boolean;
}

export function QuestionArea({
  questions,
  answerKey,
  handleUserAnswerChange,
  handleCorrectAnswerChange,
  calculateScore,
  loadingResults
}: QuestionAreaProps) {
  const options = ["A", "B", "C", "D"];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Answer Sheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="py-4 border-b last:border-b-0">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-8 items-center">
                <div className="mb-4 md:mb-0">
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

                <div className="flex-shrink-0">
                  <p className="font-semibold mb-3 text-sm">Correct Answer</p>
                  <RadioGroup
                    value={answerKey[q.id] ?? ""}
                    onValueChange={(value) => handleCorrectAnswerChange(q.id, value)}
                    className="flex flex-wrap gap-2"
                  >
                    {options.map((option) => (
                      <div key={option} className="flex items-center">
                        <RadioGroupItem value={option} id={`correct-q-${q.id}-option-${option}`} className="peer sr-only" />
                        <Label
                          htmlFor={`correct-q-${q.id}-option-${option}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted bg-muted text-xs hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
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
