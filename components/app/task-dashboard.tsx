"use client";
import { Button } from '@/components/ui/button';
import { getActionableSteps } from '@/lib/actions';
import { ActionableStep, Priority } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import AllPrioritiesComplete from './all-priorities-complete';

type TaskDashboardProps = {
  userRole: string;
  priorities: Priority[];
  onUpdatePriorities: (priorities: Priority[]) => void;
  onAllPrioritiesCompleted: () => void;
};

export default function TaskDashboard({ userRole, priorities, onUpdatePriorities, onAllPrioritiesCompleted }: TaskDashboardProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const handlePriorityToggle = (id: string) => {
    const updatedPriorities = priorities.map(p =>
      p.id === id ? { ...p, isCompleted: !p.isCompleted } : p
    );
    onUpdatePriorities(updatedPriorities);
  };
  
  const handleStepToggle = (priorityId: string, stepId: string) => {
    const updatedPriorities = priorities.map(p => {
      if (p.id === priorityId) {
        const updatedSteps = p.actionableSteps?.map(s => 
          s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
        );
        const allStepsCompleted = updatedSteps?.every(s => s.isCompleted);
        return { ...p, actionableSteps: updatedSteps, isCompleted: allStepsCompleted || p.isCompleted };
      }
      return p;
    });
    onUpdatePriorities(updatedPriorities);
  };

  const handleGenerateSteps = async (priorityId: string) => {
    setIsGenerating(priorityId);
    const priority = priorities.find(p => p.id === priorityId);
    if (!priority) return;

    try {
      const steps = await getActionableSteps(priority.text, userRole);
      const newActionableSteps: ActionableStep[] = steps.map(stepText => ({
        id: uuidv4(),
        text: stepText,
        isCompleted: false,
      }));
      
      const updatedPriorities = priorities.map(p => 
        p.id === priorityId ? {...p, actionableSteps: newActionableSteps} : p
      );
      onUpdatePriorities(updatedPriorities);

    } catch (error) {
      console.error("Failed to generate steps", error);
    } finally {
      setIsGenerating(null);
    }
  };

  const completedCount = priorities.filter(p => p.isCompleted).length;
  const totalCount = priorities.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  if (totalCount === 0) {
    return (
        <Card className="w-full text-center">
            <CardHeader>
                <CardTitle>No priorities set for this week.</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Come back on Monday to set your new priorities!</p>
            </CardContent>
        </Card>
    )
  }

  if (allCompleted) {
      return <AllPrioritiesComplete userRole={userRole} completedPriorities={priorities} onArchive={onAllPrioritiesCompleted} />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>This Week&apos;s Focus</CardTitle>
          <CardDescription>
            {currentDate} - You&apos;ve completed {completedCount} of {totalCount} priorities.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="space-y-4">
        {priorities.map(priority => (
          <Card key={priority.id} className={`transition-all ${priority.isCompleted ? 'bg-muted/50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  id={`priority-${priority.id}`}
                  checked={priority.isCompleted}
                  onCheckedChange={() => handlePriorityToggle(priority.id)}
                  className="mt-1"
                  aria-label={`Mark priority as ${priority.isCompleted ? 'incomplete' : 'complete'}`}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`priority-${priority.id}`}
                    className={`font-medium cursor-pointer ${priority.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {priority.text}
                  </label>
                  
                  <Accordion type="single" collapsible className="w-full mt-2">
                      <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-sm py-1 hover:no-underline text-primary">View AI Insights</AccordionTrigger>
                        <AccordionContent className="pt-2">
                          <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                              <h4 className="font-semibold text-foreground">Actionable Steps:</h4>
                              {priority.actionableSteps && Array.isArray(priority.actionableSteps) && priority.actionableSteps.length > 0 ? (
                                <ul className="list-none pl-0 space-y-2">
                                  {priority.actionableSteps.map((step) => (
                                    <li key={step.id} className="flex items-start gap-2">
                                      <Checkbox
                                        id={`step-${step.id}`}
                                        checked={step.isCompleted}
                                        onCheckedChange={() => handleStepToggle(priority.id, step.id)}
                                        className="mt-1"
                                      />
                                      <label 
                                        htmlFor={`step-${step.id}`} 
                                        className={`flex-1 font-normal ${step.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                      >
                                        {step.text}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div>
                                    <p>No actionable steps generated yet.</p>
                                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleGenerateSteps(priority.id)} disabled={isGenerating === priority.id}>
                                    {isGenerating === priority.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Generate Steps
                                    </Button>
                                </div>
                              )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
