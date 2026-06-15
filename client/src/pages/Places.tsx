import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Heart,
  Clock,
  Home,
  Briefcase,
  Star,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

export default function Places() {
  const { t } = useTranslation();

  const savedPlaces = [
    {
      id: 1,
      name: "Home",
      address: "123 Andheri West, Mumbai",
      type: "home",
      icon: Home,
      lastUsed: "Today, 8:30 AM",
      frequency: 45,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: 2,
      name: "Office",
      address: "Business Park, Bandra",
      type: "work",
      icon: Briefcase,
      lastUsed: "Today, 6:15 PM",
      frequency: 38,
      color: "bg-green-50 border-green-200",
    },
    {
      id: 3,
      name: "Gym",
      address: "Fitness Center, Worli",
      type: "gym",
      icon: Star,
      lastUsed: "Yesterday, 7:00 AM",
      frequency: 12,
      color: "bg-orange-50 border-orange-200",
    },
    {
      id: 4,
      name: "Coffee Shop",
      address: "Café Mumbai, Dadar",
      type: "cafe",
      icon: MapPin,
      lastUsed: "2 days ago",
      frequency: 8,
      color: "bg-purple-50 border-purple-200",
    },
  ];

  const frequentJourneys = [
    {
      id: 1,
      from: "Home",
      to: "Office",
      frequency: 38,
      avgTime: "45 min",
      cost: "₹85",
    },
    {
      id: 2,
      from: "Office",
      to: "Home",
      frequency: 35,
      avgTime: "52 min",
      cost: "₹85",
    },
    {
      id: 3,
      from: "Home",
      to: "Gym",
      frequency: 12,
      avgTime: "30 min",
      cost: "₹65",
    },
    {
      id: 4,
      from: "Office",
      to: "Coffee Shop",
      frequency: 8,
      avgTime: "25 min",
      cost: "₹45",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">Saved Places</h1>
                <p className="text-sm text-muted-foreground">
                  Your favorite locations and frequent journeys
                </p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Place
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Search */}
          <div>
            <Input
              placeholder="Search places..."
              className="w-full"
            />
          </div>

          {/* Saved Places */}
          <div>
            <h2 className="text-xl font-bold mb-4">My Places</h2>
            <div className="grid gap-4">
              {savedPlaces.map((place) => {
                const Icon = place.icon;
                return (
                  <Card
                    key={place.id}
                    className={`p-4 border-l-4 ${place.color}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4 flex-1">
                        <Icon className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {place.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {place.address}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {place.lastUsed}
                            </div>
                            <div>
                              Used {place.frequency} times
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Frequent Journeys */}
          <div>
            <h2 className="text-xl font-bold mb-4">Frequent Journeys</h2>
            <div className="grid gap-4">
              {frequentJourneys.map((journey) => (
                <Card
                  key={journey.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center">
                        <div className="font-semibold text-sm">
                          {journey.from}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Start
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          {journey.frequency} times
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-px flex-1 bg-border" />
                          <MapPin className="w-4 h-4 text-accent" />
                          <div className="h-px flex-1 bg-border" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm">
                          {journey.to}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          End
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-sm">
                        {journey.avgTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {journey.cost}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer text-center">
                <Heart className="w-6 h-6 text-accent mx-auto mb-2" />
                <h3 className="font-semibold">Favorite Routes</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  View your saved routes
                </p>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer text-center">
                <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                <h3 className="font-semibold">Recent Searches</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Quick access to recent queries
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
