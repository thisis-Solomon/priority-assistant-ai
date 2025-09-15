'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing context-aware assistance to users
 *  regarding their to-do list, incorporating details about their role and providing tailored advice.
 *
 * - contextAwareAssistance - The main function that triggers the flow.
 * - ContextAwareAssistanceInput - The input type for the contextAwareAssistance function.
 * - ContextAwareAssistanceOutput - The output type for the contextAwareAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextAwareAssistanceInputSchema = z.object({
  userRole: z.string().describe('The user\'s job role or position.'),
  priorities: z.array(z.string()).describe('A list of the user\'s top priorities for the week.'),
  achievements: z.array(z.string()).optional().describe('A list of tasks already achieved.'),
  blockages: z.array(z.string()).optional().describe('A list of blockages encountered.'),
});

export type ContextAwareAssistanceInput = z.infer<typeof ContextAwareAssistanceInputSchema>;

const ContextAwareAssistanceOutputSchema = z.object({
  advice: z.string().describe('Tailored advice and recommendations for the user\'s to-do list, considering their role.'),
});

export type ContextAwareAssistanceOutput = z.infer<typeof ContextAwareAssistanceOutputSchema>;

export async function contextAwareAssistance(input: ContextAwareAssistanceInput): Promise<ContextAwareAssistanceOutput> {
  return contextAwareAssistanceFlow(input);
}

const contextAwareAssistancePrompt = ai.definePrompt({
  name: 'contextAwareAssistancePrompt',
  input: {
    schema: ContextAwareAssistanceInputSchema,
  },
  output: {
    schema: ContextAwareAssistanceOutputSchema,
  },
  prompt: `You are an AI assistant designed to provide tailored advice to users regarding their to-do list.
  Consider the user's role and their listed priorities to generate helpful and actionable advice.

  User Role: {{{userRole}}}
  Priorities: {{#each priorities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  {{#if achievements}}
  Achievements: {{#each achievements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}

  {{#if blockages}}
  Blockages: {{#each blockages}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}

  Provide advice on how to approach the priorities and overcome potential obstacles, tailored to their role.`,
});

const contextAwareAssistanceFlow = ai.defineFlow(
  {
    name: 'contextAwareAssistanceFlow',
    inputSchema: ContextAwareAssistanceInputSchema,
    outputSchema: ContextAwareAssistanceOutputSchema,
  },
  async input => {
    const {output} = await contextAwareAssistancePrompt(input);
    return output!;
  }
);
