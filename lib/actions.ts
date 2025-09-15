'use server';

import { breakdownPriorities } from '@/ai/flows/breakdown-priorities';
import type { Priority } from './types';
import { contextAwareAssistance } from '@/ai/flows/context-aware-assistance';
import { generateMotivation } from '@/ai/flows/generate-motivation';

export async function getActionableSteps(
  priority: string,
  userRole: string
): Promise<string[]> {
  try {
    const result = await breakdownPriorities({ priority, userRole });
    return result.actionableSteps;
  } catch (error) {
    console.error('Error getting actionable steps:', error);
    throw new Error('Failed to get insights from AI. Please try again.');
  }
}

export async function getWeeklyAdvice(
  userRole: string,
  priorities: Priority[],
  blockagesText: string
): Promise<string> {
  try {
    const allPriorities = priorities.map(p => p.text);
    const achievements = priorities.filter(p => p.isCompleted).map(p => p.text);
    const blockages = priorities.filter(p => !p.isCompleted).map(p => p.text);
    
    // Add user's written blockages if any
    if (blockagesText.trim()) {
        blockages.push(blockagesText);
    }

    const result = await contextAwareAssistance({
      userRole,
      priorities: allPriorities,
      achievements,
      blockages,
    });
    return result.advice;
  } catch (error) {
    console.error('Error getting weekly advice:', error);
    throw new Error('Failed to get advice from AI. Please try again.');
  }
}

export async function getMotivationalFeedback(
    userRole: string,
    completedPriorities: string[]
): Promise<string> {
    try {
        const result = await generateMotivation({ userRole, completedPriorities });
        return result.motivationalMessage;
    } catch (error) {
        console.error('Error generating motivation:', error);
        throw new Error('Failed to get feedback from AI. Please try again.');
    }
}
