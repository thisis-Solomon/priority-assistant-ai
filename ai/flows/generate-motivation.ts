'use server';

/**
 * @fileOverview An AI agent that generates a motivational message for completing all priorities.
 *
 * - generateMotivation - A function that handles the motivation generation process.
 * - GenerateMotivationInput - The input type for the generateMotivation function.
 * - GenerateMotivationOutput - The return type for the generateMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationInputSchema = z.object({
  userRole: z.string().describe('The user\'s job role or position.'),
  completedPriorities: z.array(z.string()).describe('A list of the user\'s completed priorities for the week.'),
});
export type GenerateMotivationInput = z.infer<typeof GenerateMotivationInputSchema>;

const GenerateMotivationOutputSchema = z.object({
  motivationalMessage: z.string().describe('A short, encouraging, and personalized motivational message for the user.'),
});
export type GenerateMotivationOutput = z.infer<typeof GenerateMotivationOutputSchema>;

export async function generateMotivation(input: GenerateMotivationInput): Promise<GenerateMotivationOutput> {
  return generateMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationPrompt',
  input: {schema: GenerateMotivationInputSchema},
  output: {schema: GenerateMotivationOutputSchema},
  prompt: `You are an AI assistant designed to provide positive reinforcement. The user has just completed all of their weekly priorities.

Generate a short, uplifting, and personalized motivational message for them based on their role and the tasks they've accomplished. Congratulate them on their achievement and encourage them to keep up the great work.

User Role: {{{userRole}}}
Completed Priorities: {{#each completedPriorities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Return a JSON object with a "motivationalMessage" field.`,
});

const generateMotivationFlow = ai.defineFlow(
  {
    name: 'generateMotivationFlow',
    inputSchema: GenerateMotivationInputSchema,
    outputSchema: GenerateMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
