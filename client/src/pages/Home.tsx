import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  MapPin,
  Zap,
  Shield,
  Leaf,
  MessageSquare,
  Trophy,
  ArrowRight,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/store";

export default function Home() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore();

  const features = [
    {
      icon: MapPin,
      title: t("routes.title"),
      description:
        "Find the best multimodal routes combining metro, bus, auto, cab, and train",
    },
    {
      icon: Zap,
      title: t("chat.title"),
      description:
        "Ask natural language questions and get intelligent travel recommendations",
    },
    {
      icon: Shield,
      title: t("safety.title"),
      description:
        "Dynamic safety scores based on time, location, and transport mode",
    },
    {
      icon: Leaf,
      title: t("sustainability.title"),
      description:
        "Track your carbon savings and earn green points for eco-friendly choices",
    },
    {
      icon: MessageSquare,
      title: t("transit.title"),
      description: "Real-time delays, cancellations, and crowd level updates",
    },
    {
      icon: Trophy,
      title: t("rewards.title"),
      description:
        "Earn badges, maintain streaks, and compete on the green leaderboard",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-metro-blue to-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              {t("app.name")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <a href="/planner" className="text-sm hover:text-accent">
                  {t("navigation.planner")}
                </a>
                <a href="/dashboard" className="text-sm hover:text-accent">
                  {t("navigation.dashboard")}
                </a>
                <a href="/rewards" className="text-sm hover:text-accent">
                  {t("navigation.rewards")}
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                  {t("navigation.profile")}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate("/dashboard")}>
                {t("common.confirm")}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="container py-4 flex flex-col gap-3">
              {isAuthenticated && (
                <>
                  <a
                    href="/planner"
                    className="text-sm py-2 hover:text-accent"
                    onClick={() => toggleMobileMenu()}
                  >
                    {t("navigation.planner")}
                  </a>
                  <a
                    href="/dashboard"
                    className="text-sm py-2 hover:text-accent"
                    onClick={() => toggleMobileMenu()}
                  >
                    {t("navigation.dashboard")}
                  </a>
                  <a
                    href="/rewards"
                    className="text-sm py-2 hover:text-accent"
                    onClick={() => toggleMobileMenu()}
                  >
                    {t("navigation.rewards")}
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                {t("app.tagline")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                {t("app.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? "/planner" : "/dashboard")}
                  className="gap-2"
                >
                  {isAuthenticated ? t("navigation.planner") : "Get Started"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-96 bg-gradient-to-br from-accent/10 to-metro-blue/10 rounded-2xl border border-border flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-metro-blue/5 to-accent/5 opacity-50" />
              <div className="relative z-10 text-center">
                <MapPin className="w-24 h-24 mx-auto text-accent/30 mb-4" />
                <p className="text-muted-foreground">{t("app.name")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for smart, safe, and sustainable urban transit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users planning smarter, safer, and greener journeys
            across India
          </p>
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/planner" : "/dashboard")}
            className="gap-2"
          >
            {isAuthenticated ? "Start Planning" : "Get Started Now"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-display font-bold mb-4">{t("app.name")}</h4>
              <p className="text-sm text-muted-foreground">
                Smart urban transit planning for India
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 {t("app.name")}. All rights reserved.</p>
            <p>Made with ❤️ for sustainable urban transit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
