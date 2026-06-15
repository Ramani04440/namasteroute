import { z } from "zod";

/**
 * NamasteRoute Validation Schemas
 * Used for runtime validation across API boundaries
 */

// ============================================================================
// Location & Coordinates
// ============================================================================

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const LocationSchema = CoordinatesSchema.extend({
  address: z.string().optional(),
  placeId: z.string().optional(),
});

// ============================================================================
// Routes & Journey Planning
// ============================================================================

export const TransportModeSchema = z.enum([
  "metro",
  "bus",
  "auto",
  "cab",
  "train",
  "walk",
]);

export const RouteSegmentSchema = z.object({
  id: z.string(),
  mode: TransportModeSchema,
  startLocation: LocationSchema,
  endLocation: LocationSchema,
  durationMinutes: z.number().positive(),
  costInRupees: z.number().nonnegative(),
  co2EmissionsGrams: z.number().nonnegative(),
  lineNumber: z.string().optional(),
  lineName: z.string().optional(),
  stops: z.array(z.string()).optional(),
  crowdLevel: z.enum(["low", "moderate", "high", "very_high"]).optional(),
  safetyScore: z.number().min(0).max(5).optional(),
  womenSafe: z.boolean().optional(),
});

export const RouteOptionSchema = z.object({
  id: z.string(),
  segments: z.array(RouteSegmentSchema),
  durationMinutes: z.number().positive(),
  costInRupees: z.number().nonnegative(),
  co2EmissionsGrams: z.number().nonnegative(),
  transferCount: z.number().nonnegative(),
  safetyScore: z.number().min(0).max(5),
  comfortScore: z.number().min(0).max(5),
  womenSafeIndicator: z.boolean(),
  routeType: z.enum(["fastest", "cheapest", "greenest", "safest", "balanced"]),
  isFavorite: z.boolean().optional(),
});

export const JourneySearchParamsSchema = z.object({
  origin: LocationSchema,
  destination: LocationSchema,
  departureTime: z.date().optional(),
  preferences: z
    .object({
      maxTransfers: z.number().nonnegative().optional(),
      avoidModes: z.array(TransportModeSchema).optional(),
      preferModes: z.array(TransportModeSchema).optional(),
      womenSafeOnly: z.boolean().optional(),
      maxCost: z.number().positive().optional(),
    })
    .optional(),
});

export const JourneyStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["planned", "in_progress", "completed", "cancelled"]),
  currentSegmentIndex: z.number().nonnegative(),
  currentLocation: CoordinatesSchema.optional(),
  currentSegment: RouteSegmentSchema.optional(),
  eta: z.date().optional(),
  delayMinutes: z.number(),
  progress: z.number().min(0).max(100),
});

// ============================================================================
// Safety
// ============================================================================

export const SafetyMetricsSchema = z.object({
  score: z.number().min(0).max(5),
  womenSafeScore: z.number().min(0).max(5),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]),
  area: z.string(),
  transportMode: TransportModeSchema,
  incidentCount: z.number().nonnegative(),
  alerts: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          "crowding",
          "delay",
          "safety_concern",
          "service_disruption",
        ]),
        severity: z.enum(["low", "medium", "high"]),
        message: z.string(),
        location: LocationSchema,
        timestamp: z.date(),
      })
    )
    .optional(),
});

export const SafetyIncidentReportSchema = z.object({
  type: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  description: z.string(),
  location: LocationSchema,
  transportMode: TransportModeSchema.optional(),
  timeOfDay: z.string().optional(),
});

// ============================================================================
// Sustainability & Rewards
// ============================================================================

export const SustainabilityMetricsSchema = z.object({
  co2SavedGrams: z.number().nonnegative(),
  greenScore: z.number().min(0).max(100),
  greenCoins: z.number().nonnegative(),
  streakDays: z.number().nonnegative(),
  totalJourneysCompleted: z.number().nonnegative(),
  totalCo2Saved: z.number().nonnegative(),
});

export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  unlockedAt: z.date().optional(),
});

export const UserRewardsDataSchema = z.object({
  totalGreenPoints: z.number().nonnegative(),
  totalGreenCoins: z.number().nonnegative(),
  currentStreak: z.number().nonnegative(),
  longestStreak: z.number().nonnegative(),
  badges: z.array(AchievementSchema),
  leaderboardRank: z.number().positive().optional(),
  totalJourneysCompleted: z.number().nonnegative(),
  totalCo2Saved: z.number().nonnegative(),
});

// ============================================================================
// Transit Status & Real-time Data
// ============================================================================

export const TransitServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: TransportModeSchema,
  status: z.enum(["operational", "delayed", "cancelled", "disrupted"]),
  delayMinutes: z.number(),
  crowdLevel: z.enum(["low", "moderate", "high", "very_high"]),
  alert: z.string().optional(),
  lastUpdated: z.date(),
});

export const TransitStatusFeedSchema = z.object({
  services: z.array(TransitServiceSchema),
  lastUpdated: z.date(),
  alerts: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          "crowding",
          "delay",
          "safety_concern",
          "service_disruption",
        ]),
        severity: z.enum(["low", "medium", "high"]),
        message: z.string(),
        location: LocationSchema,
        timestamp: z.date(),
      })
    )
    .optional(),
});

// ============================================================================
// Chat & AI Assistant
// ============================================================================

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.date(),
  context: z
    .object({
      journeyId: z.string().optional(),
      location: LocationSchema.optional(),
      preferences: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export const ChatConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  messages: z.array(ChatMessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// User & Preferences
// ============================================================================

export const UserPreferencesSchema = z.object({
  language: z.enum(["en", "hi", "ta", "bn", "te"]),
  theme: z.enum(["light", "dark"]),
  notifications: z
    .object({
      delays: z.boolean().optional(),
      safetyAlerts: z.boolean().optional(),
      rewards: z.boolean().optional(),
    })
    .optional(),
  accessibility: z
    .object({
      highContrast: z.boolean().optional(),
      screenReader: z.boolean().optional(),
    })
    .optional(),
});

export const SavedPlaceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  label: z.string(),
  location: LocationSchema,
  createdAt: z.date(),
});

export const FrequentJourneySchema = z.object({
  id: z.string(),
  userId: z.string(),
  origin: LocationSchema,
  destination: LocationSchema,
  tripCount: z.number().positive(),
  lastUsed: z.date(),
});

// ============================================================================
// Leaderboard
// ============================================================================

export const LeaderboardEntrySchema = z.object({
  rank: z.number().positive(),
  userId: z.string(),
  userName: z.string(),
  totalGreenPoints: z.number().nonnegative(),
  totalCo2Saved: z.number().nonnegative(),
  streakDays: z.number().nonnegative(),
});

export const LeaderboardSchema = z.object({
  entries: z.array(LeaderboardEntrySchema),
  userRank: LeaderboardEntrySchema.optional(),
  period: z.enum(["weekly", "monthly", "all_time"]),
  lastUpdated: z.date(),
});
