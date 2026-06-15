import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  IndianRupee,
  Leaf,
  Shield,
  ArrowRight,
  Navigation,
  Zap,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useRouteStore } from "@/store";

interface Route {
  id: string;
  type: "fastest" | "cheapest" | "greenest" | "safest" | "balanced";
  duration: number;
  cost: number;
  transfers: number;
  co2Saved: number;
  safetyScore: number;
  comfortScore: number;
  segments: Array<{
    mode: "metro" | "bus" | "auto" | "cab" | "train" | "walk";
    duration: number;
    stops: number;
  }>;
  womenSafe: boolean;
}

export default function Planner() {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoutes, selectRoutes] = useState<string[]>([]);
  const { selectRoute, addToCompare } = useRouteStore();

  const mockRoutes: Route[] = [
    {
      id: "route-1",
      type: "fastest",
      duration: 45,
      cost: 85,
      transfers: 2,
      co2Saved: 2.5,
      safetyScore: 8.5,
      comfortScore: 7,
      segments: [
        { mode: "metro", duration: 25, stops: 5 },
        { mode: "bus", duration: 15, stops: 3 },
        { mode: "walk", duration: 5, stops: 0 },
      ],
      womenSafe: true,
    },
    {
      id: "route-2",
      type: "cheapest",
      duration: 65,
      cost: 45,
      transfers: 3,
      co2Saved: 2.8,
      safetyScore: 7,
      comfortScore: 5,
      segments: [
        { mode: "bus", duration: 35, stops: 8 },
        { mode: "auto", duration: 20, stops: 2 },
        { mode: "walk", duration: 10, stops: 0 },
      ],
      womenSafe: false,
    },
    {
      id: "route-3",
      type: "greenest",
      duration: 55,
      cost: 65,
      transfers: 1,
      co2Saved: 3.2,
      safetyScore: 8,
      comfortScore: 8,
      segments: [
        { mode: "metro", duration: 40, stops: 6 },
        { mode: "walk", duration: 15, stops: 0 },
      ],
      womenSafe: true,
    },
  ];

  const handleSearch = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 800);
  };

  const toggleRouteSelection = (routeId: string) => {
    selectRoutes((prev) => {
      if (prev.includes(routeId)) {
        return prev.filter((id) => id !== routeId);
      } else if (prev.length < 3) {
        return [...prev, routeId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    const routesToCompare = routes.filter((r) => selectedRoutes.includes(r.id));
    routesToCompare.forEach((route) => {
      addToCompare(route as any);
    });
  };

  const getModeIcon = (mode: string) => {
    const icons: Record<string, string> = {
      metro: "🚇",
      bus: "🚌",
      auto: "🛺",
      cab: "🚕",
      train: "🚆",
      walk: "🚶",
    };
    return icons[mode] || "📍";
  };

  const getRouteTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fastest: t("routes.fastest"),
      cheapest: t("routes.cheapest"),
      greenest: t("routes.greenest"),
      safest: t("routes.safest"),
      balanced: t("routes.balanced"),
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">{t("planner.title")}</h1>
        </div>
      </div>

      <div className="container py-8">
        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="origin">{t("planner.origin")}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="origin"
                  placeholder="e.g., Andheri"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">{t("planner.destination")}</Label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="e.g., Bandra"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure">{t("planner.departureTime")}</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="departure"
                  type="date"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    {t("planner.searching")}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {t("planner.search")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {routes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedRoutes.length} / 3 {t("comparison.selectUp")}
              </div>
              <Button
                onClick={handleCompare}
                disabled={selectedRoutes.length === 0}
                variant="outline"
              >
                {t("routes.compare")} ({selectedRoutes.length})
              </Button>
            </div>

            <div className="grid gap-4">
              {routes.map((route) => (
                <Card
                  key={route.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedRoutes.includes(route.id)
                      ? "ring-2 ring-accent bg-accent/5"
                      : "hover:shadow-lg hover:-translate-y-1"
                  }`}
                  onClick={() => {
                    selectRoute(route as any);
                    toggleRouteSelection(route.id);
                  }}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col justify-between">
                      <Badge variant="outline" className="w-fit mb-2">
                        {getRouteTypeLabel(route.type)}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {route.transfers} {t("routes.transfers")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {t("routes.duration")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{route.duration} min</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {t("routes.cost")}
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">₹{route.cost}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {t("routes.co2")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">
                          {route.co2Saved} kg
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {t("routes.safety")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">
                          {route.safetyScore}/10
                        </span>
                      </div>
                      {route.womenSafe && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          👩 {t("routes.womenSafe")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRoute(route as any);
                        }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 flex-wrap">
                      {route.segments.map((segment, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="text-lg">{getModeIcon(segment.mode)}</span>
                          <span className="text-xs text-muted-foreground">
                            {segment.duration}m
                          </span>
                          {idx < route.segments.length - 1 && (
                            <ChevronDown className="w-3 h-3 text-muted-foreground rotate-90" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && routes.length === 0 && origin && destination && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t("planner.noResults")}</h3>
            <p className="text-sm text-muted-foreground">
              Try different locations or times
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
