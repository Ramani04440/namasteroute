import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  TrendingUp,
  Zap,
  MapPin,
  AlertCircle,
  Trophy,
  Leaf,
  Clock,
  Navigation,
} from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const quickStats = [
    {
      label: t("dashboard.todayPoints"),
      value: "450",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: t("dashboard.weekCo2"),
      value: "12.4",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("dashboard.currentStreak"),
      value: "23",
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: t("dashboard.safetyScore"),
      value: "8.5",
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const recentJourneys = [
    {
      id: 1,
      from: "Andheri",
      to: "Bandra",
      time: "Today, 8:30 AM",
      duration: "45 min",
      cost: "₹85",
      co2: 2.3,
      points: 150,
    },
    {
      id: 2,
      from: "Andheri",
      to: "Worli",
      time: "Yesterday, 6:15 PM",
      duration: "52 min",
      cost: "₹120",
      co2: 1.8,
      points: 120,
    },
    {
      id: 3,
      from: "Bandra",
      to: "Dadar",
      time: "2 days ago",
      duration: "38 min",
      cost: "₹65",
      co2: 2.1,
      points: 140,
    },
  ];

  const upcomingAlerts = [
    {
      id: 1,
      type: "crowding",
      message: t("dashboard.alert1"),
      location: "Bandra Station",
      severity: "high",
    },
    {
      id: 2,
      type: "delay",
      message: t("dashboard.alert2"),
      location: "Western Express",
      severity: "medium",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <Button onClick={() => setLocation("/planner")}>
              {t("dashboard.planJourney")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className={`p-6 ${stat.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Journeys */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{t("dashboard.recentJourneys")}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/journey")}
                  >
                    {t("dashboard.viewAll")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentJourneys.map((journey) => (
                    <div
                      key={journey.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {journey.from} → {journey.to}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {journey.time}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {t("dashboard.duration")}
                          </div>
                          <div className="font-semibold">{journey.duration}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {t("dashboard.co2")}
                          </div>
                          <div className="font-semibold text-green-600">
                            {journey.co2} kg
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {t("dashboard.points")}
                          </div>
                          <div className="font-semibold text-yellow-600">
                            +{journey.points}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">{t("dashboard.alerts")}</h3>
                <div className="space-y-3">
                  {upcomingAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === "high"
                          ? "border-red-500 bg-red-50"
                          : "border-yellow-500 bg-yellow-50"
                      }`}
                    >
                      <div className="text-sm font-semibold mb-1">
                        {alert.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        📍 {alert.location}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">{t("dashboard.quickActions")}</h3>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation("/planner")}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {t("dashboard.planTrip")}
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation("/safety")}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {t("dashboard.checkSafety")}
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setLocation("/rewards")}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {t("dashboard.viewRewards")}
                  </Button>
                </div>
              </Card>

              {/* Achievement */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="font-semibold mb-1">{t("dashboard.achievement")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("dashboard.achievementDesc")}
                  </p>
                  <Badge className="bg-purple-600">
                    {t("dashboard.unlocked")}
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
