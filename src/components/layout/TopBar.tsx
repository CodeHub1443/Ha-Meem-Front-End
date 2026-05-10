import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { User } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  const { isOnline } = useHealthCheck(15000);
  const { t } = useTranslation();
  return (
    <header className="h-14 px-6 border-b bg-card flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-success" : "bg-danger"}`} />
          <span className="text-muted-foreground">{isOnline ? t("common.online") : t("common.offline")}</span>
        </div>
        <LanguageToggle />
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
