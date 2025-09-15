"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

import type { Priority } from '@/lib/types';
import { getWeeklyAdvice } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  blockages: z.string().optional(),
  improvements: z.string().optional(),
  carryOver: z.array(z.string()).optional(),
});

type FridayRetrospectiveProps = {
  userRole: string;
  priorities: Priority[];
  onRetrospectiveComplete: (carryOverPriorities: Priority[]) => void;
};

export default function FridayRetrospective({ userRole, priorities, onRetrospectiveComplete }: FridayRetrospectiveProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const { toast } = useToast();

  const uncompletedPriorities = priorities.filter(p => !p.isCompleted);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockages: "",
      improvements: "",
      carryOver: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const generatedAdvice = await getWeeklyAdvice(userRole, priorities, values.blockages || '');
      setAdvice(generatedAdvice);

      const carryOverPriorities = values.carryOver?.map(text => ({
        id: uuidv4(),
        text,
        isCompleted: false,
      })) || [];

      onRetrospectiveComplete(carryOverPriorities);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem getting your weekly advice.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Weekly Retrospective</CardTitle>
          <CardDescription>Let's reflect on your week to plan for the next one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Review your week</AlertTitle>
                <AlertDescription>You completed <strong>{priorities.filter(p => p.isCompleted).length}</strong> of <strong>{priorities.length}</strong> priorities.</AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="blockages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What were the main blockages for the uncompleted tasks?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Unexpected meetings, waiting for feedback..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="improvements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How could you improve your approach next week?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Block out focus time, follow up more quickly..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {uncompletedPriorities.length > 0 && (
                <FormField
                  control={form.control}
                  name="carryOver"
                  render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Carry over to next week?</FormLabel>
                        </div>
                        {uncompletedPriorities.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="carryOver"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(item.text)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), item.text])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value) => value !== item.text
                                            )
                                            );
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.text}
                                </FormLabel>
                                </FormItem>
                            );
                            }}
                        />
                        ))}
                        <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Finish Week & Get AI Advice
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Dialog open={!!advice} onOpenChange={(open) => !open && setAdvice(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Your AI-Powered Weekly Advice</DialogTitle>
                <DialogDescription>Based on your week, here are some suggestions for improvement.</DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto pr-2">
                <p>{advice}</p>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
