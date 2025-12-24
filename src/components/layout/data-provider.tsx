'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const setInitialData = useAppStore((state) => state.setInitialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sync/get-all');
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchData();
  }, [setInitialData]);

  return <>{children}</>;
}