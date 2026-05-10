import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EventBadge } from "@/components/shared/EventBadge";
import { useCameraList } from "@/context/SettingsContext";
import { fetchLatestEvents } from "@/api/events";
import { requestSnapshot } from "@/api/stubs";
import { Camera, Loader2, ImageOff } from "lucide-react";
import { Link } from "@tanstack/react-router";

type SearchParams = { camera?: string };

export const Route = createFileRoute("/live")({
  component: LivePage,
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    camera: typeof s.camera === "string" ? s.camera : undefined,
  }),
});

function LivePage() {
  const { t } = useTranslation();
  const cameras = useCameraList();
  const search = Route.useSearch();
  const [cameraId, setCameraId] = useState<string | undefined>(search.camera || cameras[0]?.id);
  const [snapshot, setSnapshot] = useState<{ image: string; ts: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);
  const [interval, setInterval] = useState(30);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const camera = cameras.find((c) => c.id === cameraId);

  const capture = async () => {
    if (!cameraId) return;
    setLoading(true); setError(null);
    try {
      const res = await requestSnapshot(cameraId);
      setSnapshot({ image: `data:image/png;base64,${res.image_base64}`, ts: res.timestamp });
    } catch {
      setError(t("live.captureError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auto) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    setCountdown(interval);
    const tick = () => {
      setCountdown((c) => {
        if (c <= 1) {
          void capture();
          return interval;
        }
        return c - 1;
      });
      timerRef.current = setTimeout(tick, 1000);
    };
    timerRef.current = setTimeout(tick, 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, interval, cameraId]);

  const latest = useQuery({
    queryKey: ["events", "live", cameraId],
    queryFn: () => fetchLatestEvents({ camera_id: cameraId, limit: 5 }),
    enabled: !!cameraId,
    refetchInterval: 10000,
    retry: false,
  });

  return (
    <AppShell title={t("live.title")}>
      <div className="space-y-4">
        <Card className="p-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Select value={cameraId} onValueChange={setCameraId}>
              <SelectTrigger><SelectValue placeholder={t("live.selectCamera")} /></SelectTrigger>
              <SelectContent>
                {cameras.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={capture} disabled={!cameraId || loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
            {t("live.request")}
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">{t("live.autoRefresh")}</span>
            <Switch checked={auto} onCheckedChange={setAuto} />
            {auto && <Badge variant="outline" className="text-[10px]">{countdown}s</Badge>}
          </div>
        </Card>

        {auto && (
          <Card className="p-4">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              {t("live.interval")}: {interval} {t("live.seconds")}
            </label>
            <Slider value={[interval]} min={5} max={60} step={5} onValueChange={(v) => setInterval(v[0])} />
          </Card>
        )}

        <Card className="p-0 overflow-hidden">
          <div className="bg-[#0F172A] aspect-video relative flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            {snapshot ? (
              <>
                <img src={snapshot.image} alt="snapshot" className="max-h-full max-w-full" />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {camera?.name}
                </div>
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono">
                  {format(new Date(snapshot.ts), "yyyy-MM-dd HH:mm:ss")}
                </div>
              </>
            ) : (
              <div className="text-center text-white/60">
                <ImageOff className="h-16 w-16 mx-auto mb-3 opacity-40" />
                <p className="text-sm">{t("live.placeholder")}</p>
              </div>
            )}
          </div>
          {error && (
            <div className="p-3 bg-danger/10 border-t border-danger/20 text-danger text-sm">{error}</div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">{t("live.latest")}</h2>
            <Link to="/events" search={{ camera: cameraId } as never}>
              <Button variant="ghost" size="sm">{t("live.viewInEvents")}</Button>
            </Link>
          </div>
          {!latest.data?.length ? (
            <p className="text-xs text-muted-foreground py-6 text-center">{t("events.noneTitle")}</p>
          ) : (
            <div className="divide-y">
              {latest.data.map((e, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
                  <EventBadge type={e.event} />
                  <span className="font-medium">{e.identity || t("events.unknownPerson")}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{format(new Date(e.timestamp), "HH:mm:ss")}</span>
                  <span className="text-xs font-mono text-muted-foreground">{(e.score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
