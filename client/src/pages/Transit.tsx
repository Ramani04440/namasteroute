import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function Transit() {
  const { t } = useTranslation();

  const transitLines = [
    {
      id: 1,
      name: "Metro Line 1 (Red)",
      status: "operational",
      delay: 0,
      crowdLevel: "moderate",
      nextTrain: "2 min",
      frequency: "Every 3 min",
    },
    {
      id: 2,
      name: "Metro Line 2 (Blue)",
      status: "delayed",
      delay: 8,
      crowdLevel: "high",
      nextTrain: "5 min",
      frequency: "Every 4 min",
    },
    {
      id: 3,
      name: "Metro Line 3 (Green)",
      status: "operational",
      delay: 0,
      crowdLevel: "low",
      nextTrain: "1 min",
      frequency: "Every 3 min",
    },
    {
      id: 4,
      name: "Bus Route 201",
      status: "operational",
      delay: 2,
      crowdLevel: "moderate",
      nextTrain: "3 min",
      frequency: "Every 5 min",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "delay",
      severity: "high",
      title: "Metro Line 2 Delayed",
      description: "Signal failure near Bandra Station. Expected delay: 15 minutes",
      time: "5 minutes ago",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "crowding",
      severity: "medium",
      title: "High Crowding",
      description: "Peak hour crowding at Andheri Station. Avoid if possible",
      time: "10 minutes ago",
      icon: Users,
    },
    {
      id: 3,
      type: "maintenance",
      severity: "low",
      title: "Scheduled Maintenance",
      description: "Line 5 maintenance window: 11 PM - 5 AM",
      time: "1 hour ago",
      icon: Zap,
    },
  ];

  const stations = [
    {
      id: 1,
      name: "Andheri Station",
      crowdLevel: "high",
      waitTime: "8 min",
      facilities: ["WiFi", "ATM", "Food Court"],
    },
    {
      id: 2,
      name: "Bandra Station",
      crowdLevel: "very_high",
      waitTime: "12 min",
      facilities: ["WiFi", "ATM", "Pharmacy"],
    },
    {
      id: 3,
      name: "Worli Station",
      crowdLevel: "moderate",
      waitTime: "4 min",
      facilities: ["WiFi", "ATM"],
    },
    {
      id: 4,
      name: "Dadar Station",
      crowdLevel: "low",
      waitTime: "2 min",
      facilities: ["WiFi", "ATM", "Food Court", "Bookstore"],
    },
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200";
      case "moderate":
        return "bg-yellow-50 border-yellow-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "very_high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getCrowdBadge = (level: string) => {
    switch (level) {
      case "low":
        return "🟢 Low";
      case "moderate":
        return "🟡 Moderate";
      case "high":
        return "🟠 High";
      case "very_high":
        return "🔴 Very High";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">Real-Time Transit Status</h1>
              <p className="text-sm text-muted-foreground">
                Live updates from all transit lines
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Tabs */}
          <Tabs defaultValue="lines" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lines">Transit Lines</TabsTrigger>
              <TabsTrigger value="stations">Stations</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Transit Lines Tab */}
            <TabsContent value="lines" className="mt-6 space-y-4">
              {transitLines.map((line) => {
                const statusColor =
                  line.status === "operational"
                    ? "bg-green-50 border-green-200"
                    : "bg-orange-50 border-orange-200";
                const statusIcon =
                  line.status === "operational" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  );

                return (
                  <Card
                    key={line.id}
                    className={`p-4 border-l-4 ${statusColor}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {statusIcon}
                        <div>
                          <h3 className="font-semibold">{line.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {line.status === "operational"
                              ? "Operational"
                              : `Delayed ${line.delay} min`}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          line.status === "operational" ? "default" : "destructive"
                        }
                      >
                        {line.status === "operational" ? "✓ On Time" : "⚠ Delayed"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Next Train
                        </div>
                        <div className="font-semibold">{line.nextTrain}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Frequency
                        </div>
                        <div className="font-semibold">{line.frequency}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Crowd Level
                        </div>
                        <div className="font-semibold">
                          {line.crowdLevel === "low"
                            ? "🟢 Low"
                            : line.crowdLevel === "moderate"
                              ? "🟡 Moderate"
                              : "🔴 High"}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Stations Tab */}
            <TabsContent value="stations" className="mt-6 space-y-4">
              {stations.map((station) => (
                <Card
                  key={station.id}
                  className={`p-4 border-l-4 ${getCrowdColor(
                    station.crowdLevel
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{station.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Crowd Level: {getCrowdBadge(station.crowdLevel)}
                      </div>
                    </div>
                    <div className="text-right">
                      <Clock className="w-5 h-5 text-muted-foreground mb-1" />
                      <div className="text-sm font-semibold">
                        {station.waitTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {station.facilities.map((facility, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="mt-6 space-y-4">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                const severityColor =
                  alert.severity === "high"
                    ? "border-red-200 bg-red-50"
                    : alert.severity === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50";

                return (
                  <Card
                    key={alert.id}
                    className={`p-4 border-l-4 ${severityColor}`}
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge
                            variant={
                              alert.severity === "high"
                                ? "destructive"
                                : alert.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
