"use client";

import React, { useMemo, useState } from "react";
import type { Question, AnswerKey, QuizResult } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface StatusPanelProps {
  questions: Question[];
  answerKey: AnswerKey;
  results: QuizResult | null;
}

export function StatusPanel({ questions, answerKey, results }: StatusPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatus = (q: Question) => {
    if (results) {
      if (!q.userAnswer) return "unanswered";
      const correctAnswer = answerKey[q.id];
      if (correctAnswer && q.userAnswer === correctAnswer) return "correct";
      return "incorrect";
    }
    return q.userAnswer ? "attempted" : "unattempted";
  };
  
  const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
    unattempted: { label: "Unattempted", variant: "outline" },
    attempted: { label: "Attempted", variant: "secondary" },
    correct: { label: "Correct", variant: "default" }, // Default is green-ish
    incorrect: { label: "Incorrect", variant: "destructive" },
    unanswered: { label: "Unanswered", variant: "outline" },
  };

  const filteredQuestions = useMemo(() =>
    questions.filter((q) => q.id.toString().includes(searchTerm)),
    [questions, searchTerm]
  );
  
  const progressStats = useMemo(() => {
    const attempted = questions.filter(q => q.userAnswer).length;
    return {
      attempted,
      accuracy: results ? results.accuracy : 0,
    };
  }, [questions, results]);

  const handleRowClick = (questionId: number) => {
    document.getElementById(`q-${questionId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
  }

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle>Question Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search question number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => {
                const status = getStatus(q);
                return (
                  <TableRow key={q.id} onClick={() => handleRowClick(q.id)} className="cursor-pointer">
                    <TableCell className="font-medium">Q{q.id}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[status].variant}>
                        {statusMap[status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Progress Tracker</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span>Attempted</span>
                    <span className="font-bold">{progressStats.attempted} / {questions.length}</span>
                </div>
                <Progress value={(progressStats.attempted / questions.length) * 100} />

                <div className="flex justify-between items-center">
                    <span>Accuracy</span>
                    <span className="font-bold">{progressStats.accuracy}%</span>
                </div>
                <Progress value={progressStats.accuracy} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
