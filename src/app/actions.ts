"use server";

import { getPersonalizedStudyRecommendations } from "@/ai/flows/personalized-study-recommendations";
import type { AnswerKey, Question } from "@/types/quiz";

export async function getRecommendationsAction(
  questions: Question[],
  correctAnswers: AnswerKey
) {
  try {
    const quizAnswers = questions.reduce((acc, q) => {
      if (q.userAnswer) {
        acc[q.id.toString()] = q.userAnswer;
      }
      return acc;
    }, {} as Record<string, string>);

    const correctAnswersString = Object.entries(correctAnswers).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    const result = await getPersonalizedStudyRecommendations({
      quizAnswers,
      correctAnswers: correctAnswersString,
    });
    
    return { recommendations: result.recommendations };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return { error: "Failed to get study recommendations." };
  }
}
