'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized study recommendations based on quiz answers.
 *
 * - `getPersonalizedStudyRecommendations` - A function that takes quiz answers as input and returns study recommendations.
 * - `PersonalizedStudyRecommendationsInput` - The input type for the `getPersonalizedStudyRecommendations` function.
 * - `PersonalizedStudyRecommendationsOutput` - The output type for the `getPersonalizedStudyRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStudyRecommendationsInputSchema = z.object({
  quizAnswers: z.record(z.string(), z.string()).describe('A record of question numbers to the answers provided by the user.'),
  correctAnswers: z.record(z.string(), z.string()).describe('A record of question numbers to the correct answer.'),
});
export type PersonalizedStudyRecommendationsInput = z.infer<typeof PersonalizedStudyRecommendationsInputSchema>;

const PersonalizedStudyRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of study recommendations based on the user answers.'),
});
export type PersonalizedStudyRecommendationsOutput = z.infer<typeof PersonalizedStudyRecommendationsOutputSchema>;

export async function getPersonalizedStudyRecommendations(
  input: PersonalizedStudyRecommendationsInput
): Promise<PersonalizedStudyRecommendationsOutput> {
  return personalizedStudyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStudyRecommendationsPrompt',
  input: {schema: PersonalizedStudyRecommendationsInputSchema},
  output: {schema: PersonalizedStudyRecommendationsOutputSchema},
  prompt: `You are an expert tutor. Based on the student's quiz answers, provide a list of study recommendations to help them improve their understanding of the material.

Quiz Answers: {{JSON.stringify quizAnswers}}
Correct Answers: {{JSON.stringify correctAnswers}}

Consider only the questions that the student answered incorrectly, and provide study recommendations for those topics.
Return a list of resources where the user can study to learn more about the tool.`,
});

const personalizedStudyRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedStudyRecommendationsFlow',
    inputSchema: PersonalizedStudyRecommendationsInputSchema,
    outputSchema: PersonalizedStudyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
