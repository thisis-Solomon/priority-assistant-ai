'use server';

/**
 * @fileOverview An AI agent that breaks down a user priority into actionable steps based on their role.
 *
 * - breakdownPriorities - A function that handles the priority breakdown process.
 * - BreakdownPrioritiesInput - The input type for the breakdownPriorities function.
 * - BreakdownPrioritiesOutput - The return type for the breakdownPriorities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BreakdownPrioritiesInputSchema = z.object({
  priority: z
    .string()
    .describe('A single user-defined priority for the week.'),
  userRole: z.string().describe('The user role in the company.'),
});
export type BreakdownPrioritiesInput = z.infer<typeof BreakdownPrioritiesInputSchema>;

const BreakdownPrioritiesOutputSchema = z.object({
  actionableSteps: z
    .array(z.string())
    .describe(
      'A list of actionable steps on how to approach the given priority based on the user role.'
    ),
});
export type BreakdownPrioritiesOutput = z.infer<typeof BreakdownPrioritiesOutputSchema>;

export async function breakdownPriorities(input: BreakdownPrioritiesInput): Promise<BreakdownPrioritiesOutput> {
  return breakdownPrioritiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'breakdownPrioritiesPrompt',
  input: {schema: BreakdownPrioritiesInputSchema},
  output: {schema: BreakdownPrioritiesOutputSchema},
  prompt: `You are an AI assistant designed to help a user break down their priority into 3-5 actionable steps.

You will receive the user's priority and their role within the company. Your task is to provide a list of actionable steps that the user can take to achieve their priority, taking into account their role and responsibilities. Each step should be a clear, concise action item.

Priority: {{{priority}}}
Role: {{{userRole}}}

Return a JSON object with a field "actionableSteps" containing an array of strings.`,
});

const breakdownPrioritiesFlow = ai.defineFlow(
  {
    name: 'breakdownPrioritiesFlow',
    inputSchema: BreakdownPrioritiesInputSchema,
    outputSchema: BreakdownPrioritiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
