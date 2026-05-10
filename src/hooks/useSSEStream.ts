import { useCallback, useEffect, useRef, useState } from "react";
import type { SurveillanceEvent } from "@/types/surveillance";

export type SSEStatus = "connecting" | "connected" | "disconnected";

export function useSSEStream(url: string, autoConnect = true) {
  const [events, setEvents] = useState<SurveillanceEvent[]>([]);
  const [status, setStatus] = useState<SSEStatus>("disconnected");
  const esRef = useRef<EventSource | null>(null);

  const disconnect = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setStatus("disconnected");
  }, []);

  const connect = useCallback(() => {
    if (esRef.current) return;
    setStatus("connecting");
    try {
      const es = new EventSource(url);
      esRef.current = es;
      es.onopen = () => setStatus("connected");
      es.onerror = () => setStatus("disconnected");
      es.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data) as SurveillanceEvent;
          setEvents((prev) => [data, ...prev].slice(0, 200));
        } catch {
          /* ignore parse errors / keepalives */
        }
      };
    } catch {
      setStatus("disconnected");
    }
  }, [url]);

  useEffect(() => {
    if (autoConnect) connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoConnect]);

  const clear = useCallback(() => setEvents([]), []);

  return { events, status, connect, disconnect, clear };
}
