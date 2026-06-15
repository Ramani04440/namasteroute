import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  IndianRupee,
  Leaf,
  Shield,
  Users,
  AlertCircle,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useRouteStore } from "@/store";
import { useLocation } from "wouter";

export default function Comparison() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { compareRoutes, removeFromCompare } = useRouteStore();

  if (compareRoutes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
          <div className="container py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/planner")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
            <h1 className="text-2xl font-bold">{t("comparison.title")}</h1>
          </div>
        </div>

        <div className="container py-12">
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t("comparison.noRoutes")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("comparison.selectRoutes")}
            </p>
            <Button onClick={() => setLocation("/planner")}>
              {t("comparison.goToPlanner")}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      key: "duration",
      label: t("routes.duration"),
      icon: Clock,
      format: (val: number) => `${val} min`,
      color: "text-blue-600",
    },
    {
      key: "cost",
      label: t("routes.cost"),
      icon: IndianRupee,
      format: (val: number) => `₹${val}`,
      color: "text-green-600",
    },
    {
      key: "transfers",
      label: t("routes.transfers"),
      icon: Users,
      format: (val: number) => `${val}`,
      color: "text-orange-600",
    },
    {
      key: "co2",
      label: t("routes.co2"),
      icon: Leaf,
      format: (val: number) => `${val} kg`,
      color: "text-green-eco",
    },
    {
      key: "safety",
      label: t("routes.safety"),
      icon: Shield,
      format: (val: number) => `${val}/10`,
      color: "text-blue-600",
    },
  ];

  const getMetricValue = (route: any, key: string) => {
    const mapping: Record<string, string> = {
      duration: "durationMinutes",
      cost: "costInRupees",
      transfers: "transferCount",
      co2: "co2EmissionsGrams",
      safety: "safetyScore",
    };
    return route[mapping[key]] || 0;
  };

  const getBestRoute = (key: string) => {
    if (compareRoutes.length === 0) return null;
    const mapping: Record<string, boolean> = {
      duration: true,
      cost: true,
      transfers: true,
      co2: true,
      safety: false,
    };
    const isLowerBetter = mapping[key];

    return compareRoutes.reduce((best, current) => {
      const bestVal = getMetricValue(best, key);
      const currentVal = getMetricValue(current, key);
      if (isLowerBetter) {
        return currentVal < bestVal ? current : best;
      } else {
        return currentVal > bestVal ? current : best;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/planner")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
            <h1 className="text-2xl font-bold">{t("comparison.title")}</h1>
          </div>
          <Badge variant="outline">
            {compareRoutes.length} / 3 {t("comparison.selected")}
          </Badge>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const bestRoute = getBestRoute(metric.key);

            return (
              <Card key={metric.key} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <h3 className="font-semibold">{metric.label}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {compareRoutes.map((route, idx) => {
                    const value = getMetricValue(route, metric.key);
                    const isBest = bestRoute?.id === route.id;

                    return (
                      <div
                        key={route.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isBest
                            ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {t("routes.option")} {idx + 1}
                          </span>
                          {isBest && (
                            <Badge variant="default" className="text-xs">
                              ⭐ {t("comparison.best")}
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold">
                          {metric.format(value)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {route.routeType}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}

          {/* Segments Comparison */}
          <Card className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <ChevronDown className="w-5 h-5" />
              {t("comparison.segments")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareRoutes.map((route, idx) => (
                <div key={route.id} className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">
                      {t("routes.option")} {idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCompare(route.id)}
                    >
                      ✕
                    </Button>
                  </div>

                  {route.segments.map((segment, segIdx) => (
                    <div
                      key={segIdx}
                      className="p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {segment.mode === "metro"
                            ? "🚇"
                            : segment.mode === "bus"
                              ? "🚌"
                              : segment.mode === "auto"
                                ? "🛺"
                                : segment.mode === "cab"
                                  ? "🚕"
                                  : segment.mode === "train"
                                    ? "🚆"
                                    : "🚶"}
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {segment.mode}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>
                          ⏱️ {segment.durationMinutes} {t("common.minutes")}
                        </div>
                        {segment.lineName && (
                          <div>📍 {segment.lineName}</div>
                        )}
                        {segment.crowdLevel && (
                          <div>
                            👥{" "}
                            {segment.crowdLevel === "low"
                              ? "🟢"
                              : segment.crowdLevel === "moderate"
                                ? "🟡"
                                : segment.crowdLevel === "high"
                                  ? "🟠"
                                  : "🔴"}{" "}
                            {segment.crowdLevel}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setLocation("/planner")} variant="outline">
              {t("comparison.backToPlanner")}
            </Button>
            <Button>
              {t("comparison.selectBest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
