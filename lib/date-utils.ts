import { isSameDay, startOfWeek } from 'date-fns';

export function isDateInCurrentWeek(isoDateString: string | null): boolean {
  if (!isoDateString) return false;
  
  try {
    const today = new Date();
    const providedDate = new Date(isoDateString);

    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const startOfProvidedWeek = startOfWeek(providedDate, { weekStartsOn: 1 });

    return isSameDay(startOfThisWeek, startOfProvidedWeek);
  } catch (error) {
    console.error("Invalid date string:", isoDateString, error);
    return false;
  }
}
