"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const formSchema = z.object({
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
});

type WelcomeSetupProps = {
  onRoleSet: (role: string) => void;
};

export default function WelcomeSetup({ onRoleSet }: WelcomeSetupProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onRoleSet(values.role);
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-3xl">Welcome to Priority Assistant AI</CardTitle>
                <CardDescription>Let&apos;s get started. To give you the best advice, we need to know your role.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What is your role at work?</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Software Engineer, Product Manager..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Get Started</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
