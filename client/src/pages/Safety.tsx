import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, Flag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Safety() {
  const { t } = useTranslation();

  const safetyMetrics = [
    {
      label: t("safety.overallScore"),
      value: "8.2",
      max: "10",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("safety.womenSafeScore"),
      value: "8.9",
      max: "10",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: t("safety.nightScore"),
      value: "7.1",
      max: "10",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: t("safety.crowdLevel"),
      value: "Moderate",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "crowding",
      severity: "high",
      title: t("safety.alert1Title"),
      description: t("safety.alert1Desc"),
      location: "Bandra Station",
      time: "2 hours ago",
      icon: Users,
    },
    {
      id: 2,
      type: "delay",
      severity: "medium",
      title: t("safety.alert2Title"),
      description: t("safety.alert2Desc"),
      location: "Western Express Highway",
      time: "30 minutes ago",
      icon: Clock,
    },
    {
      id: 3,
      type: "safety_concern",
      severity: "high",
      title: t("safety.alert3Title"),
      description: t("safety.alert3Desc"),
      location: "Andheri East",
      time: "1 hour ago",
      icon: AlertTriangle,
    },
  ];

  const safeRoutes = [
    {
      id: 1,
      name: "Andheri → Bandra (Metro + Bus)",
      score: 9.2,
      time: "45 min",
      cost: "₹85",
      womenSafe: true,
      crowdLevel: "low",
    },
    {
      id: 2,
      name: "Andheri → Bandra (Metro Only)",
      score: 8.8,
      time: "52 min",
      cost: "₹45",
      womenSafe: true,
      crowdLevel: "moderate",
    },
    {
      id: 3,
      name: "Andheri → Bandra (Auto + Metro)",
      score: 7.5,
      time: "38 min",
      cost: "₹120",
      womenSafe: false,
      crowdLevel: "high",
    },
  ];

  const timeOfDayScores = [
    { time: "6 AM", score: 9.2, label: "Early Morning" },
    { time: "9 AM", score: 7.8, label: "Morning Peak" },
    { time: "12 PM", score: 8.5, label: "Noon" },
    { time: "6 PM", score: 7.2, label: "Evening Peak" },
    { time: "9 PM", score: 7.8, label: "Night" },
    { time: "12 AM", score: 6.1, label: "Late Night" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">{t("safety.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("safety.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Safety Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {safetyMetrics.map((metric, idx) => (
              <Card key={idx} className={`p-6 ${metric.bgColor}`}>
                <div className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </div>
                <div className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                  {metric.max && <span className="text-lg">/{metric.max}</span>}
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="alerts">{t("safety.alerts")}</TabsTrigger>
              <TabsTrigger value="routes">{t("safety.safeRoutes")}</TabsTrigger>
              <TabsTrigger value="timeline">{t("safety.timeline")}</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="sos">{t("safety.sos")}</TabsTrigger>
            </TabsList>

            {/* Community Reports Tab */}
            <TabsContent value="community" className="space-y-4 mt-6">
              <CommunityReporting />
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4 mt-6">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                const severityColor =
                  alert.severity === "high"
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50";
                const severityBadgeColor =
                  alert.severity === "high" ? "destructive" : "secondary";

                return (
                  <Card key={alert.id} className={`p-4 border-l-4 ${severityColor}`}>
                    <div className="flex items-start gap-4">
                      <Icon className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge variant={severityBadgeColor} className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Safe Routes Tab */}
            <TabsContent value="routes" className="space-y-4 mt-6">
              {safeRoutes.map((route) => (
                <Card key={route.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{route.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>⏱️ {route.time}</span>
                        <span>💰 {route.cost}</span>
                        <span>
                          👥{" "}
                          {route.crowdLevel === "low"
                            ? "🟢"
                            : route.crowdLevel === "moderate"
                              ? "🟡"
                              : "🔴"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {route.score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Safety Score
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {route.womenSafe && (
                      <Badge variant="outline" className="text-xs">
                        👩 Women Safe
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {route.crowdLevel}
                    </Badge>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-6">{t("safety.safetyByTime")}</h3>
                <div className="space-y-4">
                  {timeOfDayScores.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium">{item.time}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 bg-muted rounded-full flex-1">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                              style={{ width: `${(item.score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{item.score}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* SOS Tab */}
            <TabsContent value="sos" className="mt-6">
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("safety.emergencySupport")}</h3>
                <p className="text-muted-foreground mb-6">
                  {t("safety.sosDescription")}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button size="lg" className="gap-2">
                    <Phone className="w-4 h-4" />
                    {t("safety.callEmergency")}
                  </Button>
                  <Button size="lg" variant="outline">
                    {t("safety.shareLocation")}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/**
 * Community Reporting Component
 * Allows users to report crowd levels and safety incidents
 */
function CommunityReporting() {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("crowd");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [crowdLevel, setCrowdLevel] = useState("moderate");

  const communityReports = [
    {
      id: 1,
      type: "crowd",
      location: "Bandra Station - Platform 2",
      crowdLevel: "high",
      description: "Peak hour crowding, difficult to board",
      reporter: "User #4521",
      time: "5 min ago",
      upvotes: 24,
      downvotes: 2,
      verified: true,
    },
    {
      id: 2,
      type: "incident",
      location: "Andheri East - Main Road",
      severity: "medium",
      description: "Pickpocketing reported near station entrance",
      reporter: "User #7823",
      time: "15 min ago",
      upvotes: 18,
      downvotes: 1,
      verified: true,
    },
    {
      id: 3,
      type: "crowd",
      location: "Dadar Station - Exit A",
      crowdLevel: "low",
      description: "Unusually quiet for this time, safe to travel",
      reporter: "User #2156",
      time: "8 min ago",
      upvotes: 12,
      downvotes: 0,
      verified: false,
    },
    {
      id: 4,
      type: "incident",
      location: "Western Express Highway",
      severity: "low",
      description: "Minor accident causing minor delays",
      reporter: "User #5634",
      time: "22 min ago",
      upvotes: 8,
      downvotes: 3,
      verified: true,
    },
  ];

  const handleSubmitReport = () => {
    console.log({
      type: reportType,
      location,
      description,
      crowdLevel: reportType === "crowd" ? crowdLevel : undefined,
    });
    setIsOpen(false);
    setLocation("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Report Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Community Safety Reports</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report Safety Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crowd">Crowd Level</SelectItem>
                    <SelectItem value="incident">Safety Incident</SelectItem>
                    <SelectItem value="delay">Service Delay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="e.g., Bandra Station, Platform 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Crowd Level (if crowd report) */}
              {reportType === "crowd" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Crowd Level</label>
                  <Select value={crowdLevel} onValueChange={setCrowdLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="moderate">🟡 Moderate</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                      <SelectItem value="extreme">🔴 Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Provide details about the situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReport}
                className="w-full"
                disabled={!location || !description}
              >
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {communityReports.map((report) => (
          <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Flag className="w-4 h-4 text-accent" />
                  <h4 className="font-semibold">
                    {report.type === "crowd"
                      ? `Crowd Level: ${report.crowdLevel}`
                      : `Incident: ${report.severity}`}
                  </h4>
                  {report.verified && (
                    <Badge variant="outline" className="text-xs">✓ Verified</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {report.description}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.time}
                  </span>
                  <span>by {report.reporter}</span>
                </div>
              </div>
            </div>

            {/* Crowd Level Badge */}
            {report.type === "crowd" && (
              <div className="mb-3">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    report.crowdLevel === "low"
                      ? "bg-green-50 border-green-200"
                      : report.crowdLevel === "moderate"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  {report.crowdLevel === "low"
                    ? "🟢 Low Crowd"
                    : report.crowdLevel === "moderate"
                      ? "🟡 Moderate Crowd"
                      : "🔴 High Crowd"}
                </Badge>
              </div>
            )}

            {/* Upvote/Downvote */}
            <div className="flex items-center gap-4 pt-3 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
              >
                <ThumbsUp className="w-3 h-3" />
                {report.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
              >
                <ThumbsDown className="w-3 h-3" />
                {report.downvotes}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Community reports help other travelers make informed decisions.
          Reports with more upvotes are more reliable. Always verify information before making
          travel decisions.
        </p>
      </Card>
    </div>
  );
}
