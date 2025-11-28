import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

export const useAnalytics = () => {
  const track = (event: string, properties: Record<string, any> = {}) => {
    const data: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };
    
    // Send to multiple providers
    Promise.all([
      // Custom analytics
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
      // Real-time WebSocket
      (window as any).ws?.send(JSON.stringify({ type: 'analytics', data }))
    ]).catch(console.error);
  };
  
  return { track };
};

export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: () => fetch('/api/metrics/realtime').then(r => r.json()),
    refetchInterval: 1000,
    staleTime: 0
  });
};