import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Navigation,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  StopCircle,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function Journey() {
  const { t } = useTranslation();
  const [journeyStatus, setJourneyStatus] = useState<
    "idle" | "in_progress" | "paused" | "completed"
  >("idle");

  const activeJourney = {
    id: "j1",
    from: "Andheri Station",
    to: "Bandra Station",
    startTime: new Date(Date.now() - 15 * 60000),
    estimatedEndTime: new Date(Date.now() + 30 * 60000),
    progress: 35,
    currentSegment: 1,
    segments: [
      {
        mode: "🚇",
        name: "Metro Line 1",
        from: "Andheri",
        to: "Bandra",
        duration: 45,
        status: "in_progress",
      },
    ],
    safetyScore: 8.5,
    co2Saved: 2.3,
    pointsEarned: 150,
  };

  const journeyHistory = [
    {
      id: "h1",
      from: "Andheri",
      to: "Bandra",
      date: "Today, 8:30 AM",
      duration: "45 min",
      cost: "₹85",
      co2Saved: 2.3,
      points: 150,
      safetyScore: 8.5,
      status: "completed",
    },
    {
      id: "h2",
      from: "Andheri",
      to: "Worli",
      date: "Yesterday, 6:15 PM",
      duration: "52 min",
      cost: "₹120",
      co2Saved: 1.8,
      points: 120,
      safetyScore: 7.9,
      status: "completed",
    },
    {
      id: "h3",
      from: "Bandra",
      to: "Dadar",
      date: "2 days ago, 9:00 AM",
      duration: "38 min",
      cost: "₹65",
      co2Saved: 2.1,
      points: 140,
      safetyScore: 8.8,
      status: "completed",
    },
  ];

  const stats = {
    totalJourneys: 127,
    totalDistance: 2450,
    totalCo2Saved: 185.3,
    totalPoints: 8920,
    averageSafetyScore: 8.4,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">{t("journey.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("journey.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Active Journey */}
          {journeyStatus === "in_progress" && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t("journey.activeJourney")}</h2>
                <Badge className="bg-blue-600">{t("journey.inProgress")}</Badge>
              </div>

              <div className="space-y-6">
                {/* Route */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("journey.from")}
                    </div>
                    <div className="font-semibold">{activeJourney.from}</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("journey.to")}
                    </div>
                    <div className="font-semibold">{activeJourney.to}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t("journey.progress")}</span>
                    <span className="font-semibold">{activeJourney.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${activeJourney.progress}%` }}
                    />
                  </div>
                </div>

                {/* Current Segment */}
                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{activeJourney.segments[0].mode}</span>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {activeJourney.segments[0].name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activeJourney.segments[0].from} →{" "}
                        {activeJourney.segments[0].to}
                      </div>
                    </div>
                    <Badge variant="outline">
                      ⏱️ {activeJourney.segments[0].duration} min
                    </Badge>
                  </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm text-muted-foreground">
                      {t("journey.eta")}
                    </div>
                    <div className="font-semibold">
                      {activeJourney.estimatedEndTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
                    <div className="text-sm text-muted-foreground">
                      {t("journey.points")}
                    </div>
                    <div className="font-semibold">+{activeJourney.pointsEarned}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600" />
                    <div className="text-sm text-muted-foreground">
                      {t("journey.co2Saved")}
                    </div>
                    <div className="font-semibold">{activeJourney.co2Saved} kg</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => setJourneyStatus("paused")}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {t("journey.pause")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setJourneyStatus("completed")}
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    {t("journey.endJourney")}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Start Journey Button */}
          {journeyStatus === "idle" && (
            <Card className="p-8 text-center">
              <Navigation className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">{t("journey.noActive")}</h2>
              <p className="text-muted-foreground mb-6">
                {t("journey.startNewJourney")}
              </p>
              <Button
                size="lg"
                onClick={() => setJourneyStatus("in_progress")}
              >
                <Play className="w-4 h-4 mr-2" />
                {t("journey.startJourney")}
              </Button>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">{t("journey.history")}</TabsTrigger>
              <TabsTrigger value="stats">{t("journey.statistics")}</TabsTrigger>
            </TabsList>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6 space-y-4">
              {journeyHistory.map((journey) => (
                <Card key={journey.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {journey.from} → {journey.to}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {journey.date}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("journey.duration")}
                      </div>
                      <div className="font-semibold">{journey.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("journey.cost")}
                      </div>
                      <div className="font-semibold">{journey.cost}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("journey.co2Saved")}
                      </div>
                      <div className="font-semibold">{journey.co2Saved} kg</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("journey.points")}
                      </div>
                      <div className="font-semibold">+{journey.points}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("journey.safety")}
                      </div>
                      <div className="font-semibold">{journey.safetyScore}/10</div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-6 text-center">
                  <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalJourneys}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("journey.totalJourneys")}
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalDistance}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("journey.totalDistance")} km
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalCo2Saved}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("journey.totalCo2")} kg
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalPoints}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("journey.totalPoints")}
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {stats.averageSafetyScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("journey.avgSafety")}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
