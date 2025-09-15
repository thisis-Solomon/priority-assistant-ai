"use client";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { getMotivationalFeedback } from '@/lib/actions';
import { Priority } from '@/lib/types';
import { Loader2, PartyPopper, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type AllPrioritiesCompleteProps = {
    userRole: string;
    completedPriorities: Priority[];
    onArchive: () => void;
};

export default function AllPrioritiesComplete({ userRole, completedPriorities, onArchive }: AllPrioritiesCompleteProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGetFeedback = async () => {
        setIsLoading(true);
        try {
            const priorityTexts = completedPriorities.map(p => p.text);
            const result = await getMotivationalFeedback(userRole, priorityTexts);
            setFeedback(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error instanceof Error ? error.message : "There was a problem getting your feedback.",
            });
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        setFeedback(null);
        setIsLoading(false);
        onArchive();
    }

    return (
        <>
            <Card className="w-full text-center bg-card border-primary/50 shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
                        <PartyPopper className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mt-4">Congratulations!</CardTitle>
                    <CardDescription>You&apos;ve completed all your priorities for the week. Amazing work!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGetFeedback} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Get Motivational Feedback
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={!!feedback} onOpenChange={(open) => !open && handleDialogClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your AI-Powered Feedback</DialogTitle>
                        <DialogDescription>Incredible job this week. Here&apos;s some feedback on your accomplishments.</DialogDescription>
                    </DialogHeader>
                    <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto pr-2">
                        <p>{feedback}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
