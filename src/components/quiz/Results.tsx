"use client";

import type { QuizResult } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, Target, BookOpen, Bot, Download } from "lucide-react";

interface ResultsProps {
  results: QuizResult;
  resetAll: () => void;
}

export function Results({ results, resetAll }: ResultsProps) {
  const { score, totalPossibleScore, correctCount, incorrectCount, unansweredCount, accuracy, incorrectlyAnswered, unattemptedQuestions } = results;

  const statCards = [
    {
      label: "Correct",
      value: correctCount,
      icon: <CheckCircle className="text-green-500" />,
      color: "text-green-500",
    },
    {
      label: "Incorrect",
      value: incorrectCount,
      icon: <XCircle className="text-red-500" />,
      color: "text-red-500",
    },
    {
      label: "Unanswered",
      value: unansweredCount,
      icon: <HelpCircle className="text-yellow-500" />,
      color: "text-yellow-500",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: <Target className="text-blue-500" />,
      color: "text-blue-500",
    },
  ];
  
  const handleSaveResults = () => {
    let content = "Quiz Results\n\n";

    if (incorrectlyAnswered.length > 0) {
      content += "--- Incorrectly Answered Questions ---\n";
      incorrectlyAnswered.forEach(item => {
        content += `Question ${item.q}: Your answer was ${item.userAnswer}, the correct answer was ${item.correctAnswer}\n`;
      });
      content += "\n";
    }

    if (unattemptedQuestions.length > 0) {
      content += "--- Unattempted Questions ---\n";
      unattemptedQuestions.forEach(item => {
        content += `Question ${item.q}: The correct answer was ${item.correctAnswer}\n`;
      });
      content += "\n";
    }

    if (incorrectlyAnswered.length === 0 && unattemptedQuestions.length === 0) {
      content += "Great job! No incorrect or unattempted questions.\n";
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl text-center animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="text-3xl">Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-7xl font-extrabold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            {score}/{totalPossibleScore}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="pt-4">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={resetAll} className="w-full">
              Start New Test
            </Button>
            <Button onClick={handleSaveResults} variant="secondary" className="w-full">
              <Download /> Save Results
            </Button>
          </CardFooter>
      </Card>
      
      {incorrectlyAnswered.length > 0 && (
         <Card className="shadow-lg animate-in fade-in-50 duration-500 delay-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen/> Review Incorrect Answers</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {incorrectlyAnswered.map(item => (
                        <li key={item.q} className="text-sm">
                            <strong>Q{item.q}:</strong> Your answer was <span className="font-bold text-destructive">{item.userAnswer}</span>, but the correct answer was <span className="font-bold text-primary">{item.correctAnswer}</span>.
                        </li>
                    ))}
                </ul>
            </CardContent>
         </Card>
      )}

      {unattemptedQuestions.length > 0 && (
         <Card className="shadow-lg animate-in fade-in-50 duration-500 delay-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle/> Review Unattempted Answers</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {unattemptedQuestions.map(item => (
                        <li key={item.q} className="text-sm">
                            <strong>Q{item.q}:</strong> The correct answer was <span className="font-bold text-primary">{item.correctAnswer}</span>.
                        </li>
                    ))}
                </ul>
            </CardContent>
         </Card>
      )}

    </div>
  );
}
