"use client";

import FridayRetrospective from '@/components/app/friday-retrospective';
import Header from '@/components/app/header';
import MondayPriorityInput from '@/components/app/monday-priority-input';
import TaskDashboard from '@/components/app/task-dashboard';
import WelcomeSetup from '@/components/app/welcome-setup';
import { Skeleton } from '@/components/ui/skeleton';
import usePersistentState from '@/hooks/use-persistent-state';
import { isDateInCurrentWeek } from '@/lib/date-utils';
import { Priority, UserData } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userData, setUserData] = usePersistentState<UserData>('priority-assistant-data', {
    role: null,
    priorities: [],
    lastPrioritySetDate: null,
    lastRetrospectiveDate: null,
  });

  const [view, setView] = useState<'loading' | 'welcome' | 'monday' | 'dashboard' | 'friday'>('loading');
  const [currentDay, setCurrentDay] = useState<number | null>(null);

  useEffect(() => {
    setCurrentDay(new Date().getDay());
  }, []);

  useEffect(() => {
    if (currentDay === null) return;

    if (!userData.role) {
      setView('welcome');
      return;
    }

    const prioritiesSetForCurrentWeek = isDateInCurrentWeek(userData.lastPrioritySetDate);
    const retrospectiveDoneForCurrentWeek = isDateInCurrentWeek(userData.lastRetrospectiveDate);

    // Day: 0:Sun, 1:Mon, 2:Tue, 3:Wed, 4:Thu, 5:Fri, 6:Sat
    if (currentDay === 5 && prioritiesSetForCurrentWeek && !retrospectiveDoneForCurrentWeek) {
      setView('friday');
    } else if (prioritiesSetForCurrentWeek) {
      setView('dashboard');
    } else {
      setView('monday');
    }
  }, [userData, currentDay]);

  const handleRoleSet = (role: string) => {
    setUserData(prev => ({ ...prev, role }));
  };

  const handlePrioritiesSet = (priorities: Priority[]) => {
    setUserData(prev => ({
      ...prev,
      priorities,
      lastPrioritySetDate: new Date().toISOString(),
    }));
  };

  const handleUpdatePriorities = (updatedPriorities: Priority[]) => {
    setUserData(prev => ({ ...prev, priorities: updatedPriorities }));
  };

  const handleAllPrioritiesCompleted = () => {
    setUserData(prev => ({
      ...prev,
      priorities: [],
      lastRetrospectiveDate: new Date().toISOString(),
      lastPrioritySetDate: null,
    }));
  }

  const handleRetrospectiveComplete = (carryOverPriorities: Priority[]) => {
    setUserData(prev => ({
      ...prev,
      priorities: carryOverPriorities,
      lastRetrospectiveDate: new Date().toISOString(),
      lastPrioritySetDate: carryOverPriorities.length > 0 ? new Date().toISOString() : null,
    }));
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        );
      case 'welcome':
        return <WelcomeSetup onRoleSet={handleRoleSet} />;
      case 'monday':
        return <MondayPriorityInput userRole={userData.role!} onPrioritiesSet={handlePrioritiesSet} />;
      case 'dashboard':
        return <TaskDashboard userRole={userData.role!} priorities={userData.priorities} onUpdatePriorities={handleUpdatePriorities} onAllPrioritiesCompleted={handleAllPrioritiesCompleted} />;
      case 'friday':
        return <FridayRetrospective userRole={userData.role!} priorities={userData.priorities} onRetrospectiveComplete={handleRetrospectiveComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
