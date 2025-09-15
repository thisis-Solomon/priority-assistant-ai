"use client";

import { useEffect, useState } from 'react';

function usePersistentState<T>(key: string, initialState: T): [T, (value: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    // This effect runs once on mount on the client side.
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      // Keep initial state if there's an error
    }
  }, [key]);

  useEffect(() => {
    // This effect runs whenever the state changes, to update localStorage.
    try {
      const serializedState = JSON.stringify(state);
      window.localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
