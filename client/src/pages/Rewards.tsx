import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Gift,
  Award,
  Flame,
  Target,
} from "lucide-react";

export default function Rewards() {
  const { t } = useTranslation();

  const userStats = {
    points: 2850,
    level: 12,
    streak: 23,
    co2Saved: 45.2,
    rank: 127,
  };

  const achievements = [
    {
      id: 1,
      name: t("rewards.ecoWarrior"),
      description: t("rewards.ecoWarriorDesc"),
      icon: "🌱",
      unlocked: true,
      progress: 100,
    },
    {
      id: 2,
      name: t("rewards.greenCommuter"),
      description: t("rewards.greenCommuterDesc"),
      icon: "🚇",
      unlocked: true,
      progress: 100,
    },
    {
      id: 3,
      name: t("rewards.safeTravel"),
      description: t("rewards.safeTravelDesc"),
      icon: "🛡️",
      unlocked: true,
      progress: 100,
    },
    {
      id: 4,
      name: t("rewards.weeklyStreak"),
      description: t("rewards.weeklyStreakDesc"),
      icon: "🔥",
      unlocked: false,
      progress: 75,
    },
    {
      id: 5,
      name: t("rewards.monthlyChampion"),
      description: t("rewards.monthlyChampionDesc"),
      icon: "👑",
      unlocked: false,
      progress: 45,
    },
    {
      id: 6,
      name: t("rewards.sustainabilityLeader"),
      description: t("rewards.sustainabilityLeaderDesc"),
      icon: "🌍",
      unlocked: false,
      progress: 20,
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Priya Sharma", points: 8920, streak: 45, avatar: "👩" },
    { rank: 2, name: "Rajesh Kumar", points: 7650, streak: 38, avatar: "👨" },
    { rank: 3, name: "Ananya Singh", points: 6480, streak: 32, avatar: "👩" },
    { rank: 4, name: "You", points: 2850, streak: 23, avatar: "🧑", highlight: true },
    { rank: 5, name: "Vikram Patel", points: 2720, streak: 19, avatar: "👨" },
    { rank: 6, name: "Neha Gupta", points: 2450, streak: 15, avatar: "👩" },
  ];

  const rewards = [
    {
      id: 1,
      name: t("rewards.metroPass"),
      description: t("rewards.metroPassDesc"),
      cost: 5000,
      icon: "🎟️",
    },
    {
      id: 2,
      name: t("rewards.coffeeCoupon"),
      description: t("rewards.coffeeCouponDesc"),
      cost: 1500,
      icon: "☕",
    },
    {
      id: 3,
      name: t("rewards.movieTicket"),
      description: t("rewards.movieTicketDesc"),
      cost: 3000,
      icon: "🎬",
    },
    {
      id: 4,
      name: t("rewards.plantTree"),
      description: t("rewards.plantTreeDesc"),
      cost: 2000,
      icon: "🌳",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">{t("rewards.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("rewards.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 text-center">
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.points}</div>
              <div className="text-xs text-muted-foreground">
                {t("rewards.points")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">L{userStats.level}</div>
              <div className="text-xs text-muted-foreground">
                {t("rewards.level")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.streak}</div>
              <div className="text-xs text-muted-foreground">
                {t("rewards.streak")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.co2Saved}</div>
              <div className="text-xs text-muted-foreground">
                {t("rewards.co2Saved")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">#{userStats.rank}</div>
              <div className="text-xs text-muted-foreground">
                {t("rewards.rank")}
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">
                {t("rewards.achievements")}
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                {t("rewards.leaderboard")}
              </TabsTrigger>
              <TabsTrigger value="redeem">{t("rewards.redeem")}</TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`p-6 text-center transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                        : "opacity-60"
                    }`}
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.progress}% {t("rewards.progress")}
                        </div>
                      </div>
                    )}
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-500">{t("rewards.unlocked")}</Badge>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-6">
              <Card className="p-6">
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        user.highlight
                          ? "bg-accent/10 border-2 border-accent"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center font-bold text-white">
                          {user.rank <= 3 ? (
                            user.rank === 1 ? (
                              "🥇"
                            ) : user.rank === 2 ? (
                              "🥈"
                            ) : (
                              "🥉"
                            )
                          ) : (
                            user.rank
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            🔥 {user.streak} {t("rewards.dayStreak")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{user.points}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("rewards.points")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Redeem Tab */}
            <TabsContent value="redeem" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{reward.icon}</div>
                      <Badge variant="outline" className="text-lg font-bold">
                        {reward.cost}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {reward.description}
                    </p>
                    <Button
                      className="w-full"
                      disabled={userStats.points < reward.cost}
                    >
                      {userStats.points >= reward.cost
                        ? t("rewards.redeem")
                        : `${reward.cost - userStats.points} ${t("rewards.pointsNeeded")}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
