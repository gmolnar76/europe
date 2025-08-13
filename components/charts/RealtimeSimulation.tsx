"use client";
import React from 'react';
import { applyRandomDelta, DashboardData, mockDashboardData } from './mockData';

export default function RealtimeSimulation({ enabled, onTick }: { enabled: boolean; onTick: (delta: Partial<DashboardData>) => void }) {
  const stateRef = React.useRef<DashboardData>(mockDashboardData());
  React.useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      stateRef.current = applyRandomDelta(stateRef.current);
      // send only changed top-level props to reduce re-render cost (simplified: send whole)
      onTick(stateRef.current);
    }, 2500);
    return () => clearInterval(id);
  }, [enabled, onTick]);
  return null;
}
